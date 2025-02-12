import { clsx, type ClassValue } from "clsx";
import { getCldImageUrl } from "next-cloudinary";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPublicIdFromUrl(url: string) {
  const startIndex = url.indexOf("spill-it-uploads/");
  if (startIndex !== -1) {
    return url.substring(startIndex);
  }
  return null;
}

export function getOptimizedAvatarImageUrl(url: string) {
  const publicId = getPublicIdFromUrl(url);

  return getCldImageUrl({
    width: 150,
    height: 150,
    src: publicId ?? "",
    format: "auto",
    crop: "auto",
    quality: "auto",
  });
}
