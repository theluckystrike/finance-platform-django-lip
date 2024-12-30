import "dotenv/config";
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.REACT_APP_BASE_URL,
    env: {
      API_URL: process.env.REACT_APP_API_URL,
      DEV_USERNAME: process.env.DEV_USERNAME,
      DEV_PASSWORD: process.env.DEV_PASSWORD,
    }
  },
});
