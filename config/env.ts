import dotenv from "dotenv";
import path from "path";

// Which environment should we load?
if (!process.env.CI) {
  const environment = process.env.TEST_ENV || "dev";

  dotenv.config({
    path: path.resolve(process.cwd(), `config/environments/${environment}.env`),
  });
}

// Export all configuration in one object
export const env = {
  baseUrl: process.env.BASE_URL || "",
  email: process.env.ACME_EMAIL || "",
  password: process.env.PASSWORD || "",
  browser: process.env.BROWSER || "chromium",
  headless: process.env.HEADLESS ? process.env.HEADLESS === "true" : true,
  logLevel: process.env.LOG_LEVEL || "INFO",

  logToFile: process.env.LOG_TO_FILE === "true",
  apiBaseUrl: process.env.API_BASE_URL || "https://dummyjson.com",
  apiUsername: process.env.API_USERNAME || "",
  apiPassword: process.env.API_PASSWORD || "",
};
