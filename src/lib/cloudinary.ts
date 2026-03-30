import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

// Konfiguráció — CSAK ha megvannak az adatok
if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });
}

/**
 * Feltölt egy base64 képet Cloudinary-ra.
 * Egyszerű feltöltés, háttér eltávolítás nélkül (background_removal fizetős feature).
 *
 * @param base64Image - Nyers base64 string (NEM data URI, tehát "iVBOR..." formátum)
 * @returns A feltöltött kép secure_url-je (pl. "https://res.cloudinary.com/...")
 * @throws Error ha a feltöltés sikertelen
 */
export async function uploadToCloudinary(
  base64Image: string
): Promise<string> {
  // A Cloudinary a "data:image/png;base64,..." formátumot várja
  const dataUri = `data:image/png;base64,${base64Image}`;

  const result: UploadApiResponse = await cloudinary.uploader.upload(dataUri, {
    folder: "ai-tee-designs",
    resource_type: "image",
    quality: "auto",
    fetch_format: "png",
  });

  if (!result.secure_url) {
    throw new Error("Cloudinary upload succeeded but returned no secure_url.");
  }

  return result.secure_url;
}

/**
 * @deprecated Use uploadToCloudinary instead
 */
export const uploadWithBackgroundRemoval = uploadToCloudinary;

/**
 * Feltölt egy külső URL-ről elérhető képet Cloudinary-ra.
 */
export async function uploadFromUrl(imageUrl: string): Promise<string> {
  const result: UploadApiResponse = await cloudinary.uploader.upload(imageUrl, {
    folder: "ai-tee-designs",
    resource_type: "image",
    quality: "auto",
    fetch_format: "png",
  });

  if (!result.secure_url) {
    throw new Error("Cloudinary URL upload succeeded but returned no secure_url.");
  }

  return result.secure_url;
}
