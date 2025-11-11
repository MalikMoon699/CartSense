import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  NODE_ENV,
  Frontend_Url,
  DB_URI,
  PORT,
  JWT_SECRET,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  ADMIN_EMAIL,
} = process.env;