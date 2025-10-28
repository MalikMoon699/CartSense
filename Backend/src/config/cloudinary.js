import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dv6rm8olh",
  api_key: process.env.CLOUDINARY_API_KEY || "263474424935978",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "PAfjEVXKmq_llM660zR6DHALd4Q",
});

export default cloudinary;
