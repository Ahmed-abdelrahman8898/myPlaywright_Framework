import dotenv from "dotenv";
import path from "path";

// Select environment
const environment = process.env.TEST_ENV || "dev";

const allowedEnvironments = ["dev", "stage", "test"];

if (!allowedEnvironments.includes(environment)) {
  throw new Error(`Invalid TEST_ENV: ${environment}`);
}

// Load the selected environment file
const envFilePath = path.resolve(
  process.cwd(),
  `config/environments/${environment}.env`,
);

const result = dotenv.config({
  path: envFilePath,
  override: true,
});

if (result.error) {
  throw new Error(`Failed to load environment file: ${envFilePath}`);
}

// Export configuration
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

if (!env.baseUrl) {
  throw new Error(`BASE_URL is missing in ${environment}.env`);
}
