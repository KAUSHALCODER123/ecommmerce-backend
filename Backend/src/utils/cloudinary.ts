import cloudinary from "cloudinary";

// ======================
// Cloudinary Config (optional)
// ======================
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const uploadToCloudinary = async (filePath: string, folder = "uploads") => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder,
      use_filename: true,
      unique_filename: true,
    });
    return result.secure_url;
  } catch (error) {
    throw new Error("Cloudinary upload failed");
  }
};
