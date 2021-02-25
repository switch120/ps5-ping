const dotenv = require("dotenv");
dotenv.config();

const processArray = (rawString = "") => rawString.split(",").map(p => p.trim());

module.exports = {
  target: {
    api_url: process.env.TARGET_API_URL,
    available_code: process.env.TARGET_AVAILABLE_CODE || "",
    stores: processArray(process.env.TARGET_STORES),
    products: processArray(process.env.TARGET_PRODUCTS),
  },
  walmart: { 
    pdp_url: process.env.WALMART_PDP_URL,
    products: processArray(process.env.WALMART_PRODUCTS)
  },
  bestbuy: { 
    pdp_url: process.env.BESTBUY_PDP_URL,
    products: processArray(process.env.BESTBUY_PRODUCTS)
  },
  heartbeat_ms: process.env.HEARTBEAT_MS || 15000,
  notify_cooldown_ms: process.env.NOTIFY_COOLDOWN_MS || 300000,
  sms_number: process.env.SMS_NUMBER || "",
  region: process.env.REGION || "US-EAST-1",
};