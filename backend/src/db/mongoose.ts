import mongoose from "mongoose";

export async function connectMongo(uri: string, maxAttempts = 30): Promise<void> {
  let delay = 1000;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await mongoose.connect(uri);
      return;
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      await Bun.sleep(delay);
      delay = Math.min(delay * 1.5, 5000);
    }
  }
}

export async function pingMongo(): Promise<boolean> {
  if (mongoose.connection.readyState !== 1) return false;
  try {
    await mongoose.connection.db?.admin().ping();
    return true;
  } catch {
    return false;
  }
}
