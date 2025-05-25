import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

const DB_URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?appName=Cluster0`;

export function initDatabaseConection() {
  return mongoose.connect(DB_URI);
}
