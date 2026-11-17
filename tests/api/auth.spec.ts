import { test, expect } from "@fixtures/api.fixture";
import { env } from "@config/env";
import { Logger } from "@core/Logger";

type LoginResponse = {
  id: number;
  username: string;
  accessToken: string;
  refreshToken: string;
};

type UserResponse = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
};

test("API - Login and get current user", async ({ apiServices }) => {
  // Variables declared here can be used by every step in this test.
  let accessToken: string;
  let userId: number;

  await test.step("1. Login and extract access token", async () => {
    Logger.info("Sending login request");

    const response = await apiServices.post("/auth/login", {
      data: {
        username: env.apiUsername,
        password: env.apiPassword,
      },
    });

    expect(response.status()).toBe(200);

    const responseBody: LoginResponse = await response.json();

    accessToken = responseBody.accessToken;
    userId = responseBody.id;

    expect(accessToken).toBeTruthy();
    expect(userId).toBeTruthy();

    Logger.info(`Login successful for ${responseBody.username}`);
    Logger.info(`User ID: ${userId}`);
    Logger.info("Access token received successfully");
  });

  await test.step("2. Get current user using access token", async () => {
    Logger.info("Sending get current user request");

    const response = await apiServices.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const responseBody: UserResponse = await response.json();

    expect(responseBody.id).toBe(userId);
    expect(responseBody.username).toBe(env.apiUsername);
    expect(responseBody.firstName).toBe("Emily");

    Logger.info(`Current user: ${responseBody.username}`);
    Logger.info(`Email: ${responseBody.email}`);
  });
});
