import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

export interface CloudinaryAsset {
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
}

let isConfigured = false;

const hasCloudinaryConfig = () =>
  Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

const getCloudinary = () => {
  if (!hasCloudinaryConfig()) {
    throw new Error("CLOUDINARY_NOT_CONFIGURED");
  }
  if (!isConfigured) {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });
    isConfigured = true;
  }
  return cloudinary;
};

const mapUploadResult = (result: UploadApiResponse): CloudinaryAsset => ({
  publicId: result.public_id,
  secureUrl: result.secure_url,
  width: result.width,
  height: result.height,
  bytes: result.bytes,
  format: result.format,
});

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
  const result = await uploadRawAsset(base64Image);
  return result.secureUrl;
}

/**
 * @deprecated Use uploadToCloudinary instead
 */
export const uploadWithBackgroundRemoval = uploadToCloudinary;

/**
 * Feltölt egy külső URL-ről elérhető képet Cloudinary-ra.
 */
export async function uploadFromUrl(imageUrl: string): Promise<string> {
  const client = getCloudinary();
  const result: UploadApiResponse = await client.uploader.upload(imageUrl, {
    folder: "ai-tee/raw",
    resource_type: "image",
    quality: "auto",
    fetch_format: "png",
  });

  if (!result.secure_url) {
    throw new Error("Cloudinary URL upload succeeded but returned no secure_url.");
  }

  return result.secure_url;
}

export async function uploadRawAsset(base64Image: string): Promise<CloudinaryAsset> {
  const client = getCloudinary();
  const dataUri = `data:image/png;base64,${base64Image}`;

  const result: UploadApiResponse = await client.uploader.upload(dataUri, {
    folder: "ai-tee/raw",
    resource_type: "image",
    quality: "auto",
    fetch_format: "png",
  });

  if (!result.secure_url) {
    throw new Error("Cloudinary upload succeeded but returned no secure_url.");
  }

  return mapUploadResult(result);
}

export async function uploadProcessedAsset(
  base64Image: string
): Promise<{ asset: CloudinaryAsset; backgroundRemoval: boolean }> {
  const client = getCloudinary();
  const dataUri = `data:image/png;base64,${base64Image}`;

  try {
    const result: UploadApiResponse = await client.uploader.upload(dataUri, {
      folder: "ai-tee/processed",
      resource_type: "image",
      quality: "auto",
      fetch_format: "png",
      transformation: [{ effect: "background_removal" }],
    });

    if (!result.secure_url) {
      throw new Error("Cloudinary upload succeeded but returned no secure_url.");
    }

    return { asset: mapUploadResult(result), backgroundRemoval: true };
  } catch (error) {
    console.warn("[Cloudinary] Background removal failed, falling back to plain upload.", error);
    const fallbackResult: UploadApiResponse = await client.uploader.upload(dataUri, {
      folder: "ai-tee/processed",
      resource_type: "image",
      quality: "auto",
      fetch_format: "png",
    });

    if (!fallbackResult.secure_url) {
      throw new Error("Cloudinary upload succeeded but returned no secure_url.");
    }

    return { asset: mapUploadResult(fallbackResult), backgroundRemoval: false };
  }
}

export { hasCloudinaryConfig };

const normalizeOverlayId = (publicId: string) => publicId.replace(/\//g, ":");

export function buildMockupUrl(params: {
  basePublicId: string;
  overlayPublicId: string;
}): string {
  const client = getCloudinary();
  const overlayId = normalizeOverlayId(params.overlayPublicId);

  return client.url(params.basePublicId, {
    secure: true,
    quality: "auto",
    fetch_format: "png",
    transformation: [
      {
        overlay: overlayId,
        width: 0.48,
        flags: "relative",
        gravity: "center",
      },
    ],
  });
}
