"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EXPERIENCE_TYPES } from "@/app/hmos/[slug]/review/constants";

const ReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  experienceType: z.enum(EXPERIENCE_TYPES),
  customerServiceRating: z.coerce.number().int().min(1).max(5),
  approvalRating: z.coerce.number().int().min(1).max(5),
  hospitalRating: z.coerce.number().int().min(1).max(5),
  medicationRating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(10).max(2000),
});

export async function submitReview(hmoSlug: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/auth/signin?callbackUrl=/hmos/${hmoSlug}/review`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    redirect(`/auth/signin?callbackUrl=/hmos/${hmoSlug}/review`);
  }

  const hmo = await prisma.hmo.findUnique({
    where: { slug: hmoSlug },
    select: { id: true },
  });
  if (!hmo) {
    redirect("/hmos");
  }

  const parsed = ReviewSchema.safeParse({
    rating: formData.get("rating"),
    experienceType: formData.get("experienceType"),
    customerServiceRating: formData.get("customerServiceRating"),
    approvalRating: formData.get("approvalRating"),
    hospitalRating: formData.get("hospitalRating"),
    medicationRating: formData.get("medicationRating"),
    title: formData.get("title"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    redirect(`/hmos/${hmoSlug}/review?error=invalid`);
  }

  const recentDuplicate = await prisma.review.findFirst({
    where: {
      hmoId: hmo.id,
      userId: user.id,
      createdAt: { gt: new Date(Date.now() - 60_000) },
    },
    select: { id: true },
  });
  if (recentDuplicate) {
    redirect(`/hmos/${hmoSlug}?submitted=1`);
  }

  await prisma.review.create({
    data: {
      hmoId: hmo.id,
      userId: user.id,
      status: "PENDING",
      ...parsed.data,
    },
  });

  revalidatePath(`/hmos/${hmoSlug}`);
  redirect(`/hmos/${hmoSlug}?submitted=1`);
}
