const dotenv = require("dotenv");
dotenv.config();

const processArray = (rawString = "") => rawString.split(",").map(p => p.trim());

module.exports = {
  api_url: process.env.API_URL,
  available_code: process.env.AVAILABLE_CODE || "",
  heartbeat_ms: process.env.HEARTBEAT_MS || 15000,
  notify_cooldown_ms: process.env.NOTIFY_COOLDOWN_MS || 300000,
  sms_number: process.env.SMS_NUMBER || "",
  region: process.env.REGION || "US-EAST-1",
  products: processArray(process.env.PRODUCTS),
  stores: processArray(process.env.STORES),
};