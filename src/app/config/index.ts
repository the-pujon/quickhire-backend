import dotenv from "dotenv";
import path from "path";

const envPath = path.join(process.cwd(), ".env");
// console.log('🧪 Loading .env from:', envPath);

dotenv.config({ path: envPath });

// console.log('✅ JWT_ACCESS_SECRET loaded inside config.ts:', process.env.JWT_ACCESS_SECRET);

export default {
  port: process.env.PORT,
  database_url: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_password_secret: process.env.JWT_PASSWORD_SECRET,
  jwt_password_expires_in: process.env.JWT_PASSWORD_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,

  redis_ttl: process.env.REDIS_TTL,
  redis_cache_key_prefix: process.env.REDIS_CACHE_KEY_PREFIX,
  redis_url: process.env.REDIS_URL,
  redis_port: process.env.REDIS_PORT,
  redis_password: process.env.REDIS_PASSWORD,
  redis_ttl_access_token: process.env.REDIS_TTL_ACCESS_TOKEN,
  redis_ttl_refresh_token: process.env.REDIS_TTL_REFRESH_TOKEN,

  email_host: process.env.EMAIL_HOST,
  email_port: process.env.EMAIL_PORT,
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
};
