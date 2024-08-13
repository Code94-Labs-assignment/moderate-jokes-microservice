import "dotenv/config";
export const DB_CONNECTION_STRING = process.env.MONGODB_URL;
export const PORT = process.env.PORT || 9092;

export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const baseUrl = process.env.BASE_URL;
