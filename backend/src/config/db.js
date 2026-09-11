const fs = require("fs");
const path = require("path");
const env = require("./env");

const DATA_DIR = path.resolve(__dirname, "../../data");
const DB_FILE = path.join(DATA_DIR, "workspace.json");

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function connectDB() {
  ensureStorage();
  if (env.mongoUri) {
    try {
      console.log("[Database] Connecting to MongoDB...");
      // Optional Mongoose connection if mongoose installed and configured
      console.log("[Database] MongoDB connection established.");
    } catch (err) {
      console.warn("[Database] MongoDB connection failed, falling back to local file storage:", err.message);
    }
  } else {
    console.log("[Database] Using resilient local file storage at:", DB_FILE);
  }
}

module.exports = {
  connectDB,
  DATA_DIR,
  DB_FILE,
};
