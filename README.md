# Playwright Automation Framework

A reusable UI and API test automation framework built with **Playwright Test**, **TypeScript**, and **Node.js**. It is designed to keep test scenarios readable while providing reusable page objects, API request methods, environment-based configuration, structured reports, and GitHub Actions CI.

[![Playwright](https://img.shields.io/badge/Playwright-Test-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![GitHub Actions](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)](https://docs.github.com/actions)

## Contents

- [Overview](#overview)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment configuration](#environment-configuration)
- [Running tests](#running-tests)
- [UI automation](#ui-automation)
- [API automation](#api-automation)
- [Reports and failure artifacts](#reports-and-failure-artifacts)
- [GitHub Actions CI](#github-actions-ci)
- [Design notes](#design-notes)
- [Known scope and next steps](#known-scope-and-next-steps)

## Overview

The repository currently contains:

- UI end-to-end tests using the Page Object Model (POM).
- Reusable UI fixtures for page objects and the UI authentication service.
- API tests using a small `BaseApi` wrapper around Playwright's `APIRequestContext`.
- Optional API authentication handled by the test scenario (no mandatory login flow).
- Environment-specific local configuration (`dev`, `stage`, and `test`).
- HTML, JUnit XML, and JSON reports.
- Failure screenshots, videos, and traces.
- GitHub Actions execution on pushes, pull requests, and manual runs.

## Technology stack

| Area            | Technology                                |
| --------------- | ----------------------------------------- |
| Language        | TypeScript                                |
| Test runner     | Playwright Test                           |
| Runtime         | Node.js 22                                |
| Package manager | npm                                       |
| UI pattern      | Page Object Model                         |
| API client      | Playwright `APIRequestContext`            |
| Configuration   | dotenv locally; GitHub Environments in CI |
| CI/CD           | GitHub Actions                            |
| Reports         | HTML, JUnit XML, JSON                     |

## Project structure

```text
myPlaywright_Framework/
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions workflow
├── config/
│   ├── env.ts                   # Central environment configuration
│   └── environments/
│       ├── dev.env.example      # Safe local configuration template
│       ├── stage.env.example
│       └── test.env.example
├── src/
│   ├── api/
│   │   └── ApiServices.ts       # API entry point used by tests
│   ├── core/
│   │   ├── BaseApi.ts           # Generic HTTP methods
│   │   ├── BaseComponent.ts
│   │   ├── BasePage.ts          # Shared page interactions
│   │   └── Logger.ts
│   ├── fixtures/
│   │   ├── api.fixture.ts       # Creates and disposes API context
│   │   ├── index.ts             # UI fixture exports
│   │   └── page.fixture.ts      # UI page-object fixtures
│   ├── pages/
│   │   ├── DashboardPage.ts
│   │   ├── LoginPage.ts
│   │   └── Page1.ts
│   └── services/
│       └── AuthenticationService.ts  # UI login orchestration
├── tests/
│   ├── api/
│   │   └── auth.spec.ts
│   └── e2e/
│       └── test1.spec.ts
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

Generated folders (`playwright-report/`, `test-results/`, and `reports/`) are created during test execution and are not committed.

## Getting started

### Prerequisites

- Node.js 22 (LTS) and npm.
- Git.
- Access to the UI test application and its test account, if running UI tests.

### Install dependencies and browser

```bash
npm ci
npx playwright install chromium
```

On Linux machines that need browser system dependencies, use:

```bash
npx playwright install --with-deps chromium
```

### Create your local environment file

Choose the environment you want to run. For example, on macOS/Linux:

```bash
cp config/environments/dev.env.example config/environments/dev.env
```

On Windows PowerShell:

```powershell
Copy-Item config/environments/dev.env.example config/environments/dev.env
```

Edit the newly created `dev.env` and provide the correct test credentials. Repeat with `stage` or `test` if needed.

**Never commit actual `.env` files or credentials.** The real `*.env` files are ignored by Git; only the safe `*.env.example` templates belong in the repository.

## Environment configuration

The environment is selected with `TEST_ENV`. Supported values are:

| Value           | Local file                      |
| --------------- | ------------------------------- |
| `dev` (default) | `config/environments/dev.env`   |
| `stage`         | `config/environments/stage.env` |
| `test`          | `config/environments/test.env`  |

Example local commands:

```bash
# Uses dev by default
npm test

# Select another environment
# macOS/Linux
TEST_ENV=stage npm test

# Windows PowerShell
$env:TEST_ENV="stage"; npm test
```

Environment variables:

| Variable       | Purpose                                                           |
| -------------- | ----------------------------------------------------------------- |
| `BASE_URL`     | Base URL for UI tests                                             |
| `ACME_EMAIL`   | UI test account email                                             |
| `PASSWORD`     | UI test account password                                          |
| `HEADLESS`     | Local browser mode (`true` or `false`); CI always forces headless |
| `LOG_LEVEL`    | Logger threshold: `DEBUG`, `INFO`, `WARN`, or `ERROR`             |
| `API_BASE_URL` | Base URL for API tests                                            |
| `API_USERNAME` | Optional API login username                                       |
| `API_PASSWORD` | Optional API login password                                       |

The API username/password are only used by tests that need to log in. They are not automatically sent with every API request.

In CI, the workflow reads configuration from the selected GitHub Environment instead of loading local `.env` files.

## Running tests

| Command                                      | Description                      |
| -------------------------------------------- | -------------------------------- |
| `npm test`                                   | Run all tests                    |
| `npm run test:api`                           | Run API tests only               |
| `npm run test:e2e`                           | Run UI end-to-end tests only     |
| `npm run test:headed`                        | Run tests with a visible browser |
| `npm run test:ui`                            | Open Playwright UI mode          |
| `npm run test:debug`                         | Run in Playwright debug mode     |
| `npm run typecheck`                          | Run TypeScript type checking     |
| `npm run show-report`                        | Open the latest HTML report      |
| `npx playwright test tests/api/auth.spec.ts` | Run one spec file                |

## UI automation

UI tests use page objects and fixtures to keep selectors and page actions separate from test scenarios.

Example:

```ts
import { test, expect } from "@fixtures";

test("User can log in and access the dashboard", async ({
  authenticationService,
  dashboardPage,
}) => {
  await test.step("Log in", async () => {
    await authenticationService.login();
  });

  await test.step("Verify dashboard action", async () => {
    await dashboardPage.smartButtonClick("Work Items"); // Example UI interaction
  });
});
```

`AuthenticationService` is for the **UI login flow**. It is separate from API authentication.

## API automation

API tests use `ApiServices`, which inherits generic HTTP methods from `BaseApi`:

- `get()`
- `post()`
- `put()`
- `patch()`
- `delete()`

The API fixture creates a Playwright request context with `API_BASE_URL`, passes it to `ApiServices`, and disposes of it after the test. Tests decide whether a request needs a payload, headers, an API key, or a token. Authentication is deliberately optional.

### Example: POST login, extract a token, then call a protected GET

The sample test uses the public DummyJSON practice API. Replace the endpoint, payload, response type, and assertions to match the API under test.

```ts
import { test, expect } from "@fixtures/api.fixture";
import { env } from "@config/env";

type LoginResponse = {
  accessToken: string;
};

test("Login and retrieve the current user", async ({ apiServices }) => {
  let accessToken: string;

  await test.step("Authenticate", async () => {
    const response = await apiServices.post("/auth/login", {
      data: {
        username: env.apiUsername,
        password: env.apiPassword,
      },
    });

    expect(response.status()).toBe(200);

    const body: LoginResponse = await response.json();
    accessToken = body.accessToken;
    expect(accessToken).toBeTruthy();
  });

  await test.step("Call protected endpoint", async () => {
    const response = await apiServices.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
  });
});
```

### Other API request examples

```ts
// Public GET - no authentication
const publicResponse = await apiServices.get("/products");
expect(publicResponse.status()).toBe(200);

// POST with a JSON body
const createResponse = await apiServices.post("/products/add", {
  data: { title: "Automation test product", price: 100 },
});

// GET with an API key
const keyedResponse = await apiServices.get("/some-endpoint", {
  headers: { "x-api-key": process.env.API_KEY ?? "" },
});

// GET with a token already provided to you
const token = "token-provided-to-the-test";
const protectedResponse = await apiServices.get("/some-endpoint", {
  headers: { Authorization: `Bearer ${token}` },
});
```

For an interview or a new API, use its Swagger/OpenAPI documentation to identify the base URL, endpoint, HTTP method, request body, required headers/authentication, and expected response. Change `API_BASE_URL` and write the scenario-specific test; the reusable HTTP layer normally stays unchanged.

## Reports and failure artifacts

The Playwright configuration generates:

| Output      | Location                       |
| ----------- | ------------------------------ |
| HTML report | `playwright-report/`           |
| JUnit XML   | `reports/junit/results.xml`    |
| JSON report | `reports/json/results.json`    |
| Screenshots | `test-results/` (failed tests) |
| Videos      | `test-results/` (failed tests) |
| Traces      | `test-results/` (failed tests) |

The HTML report can be opened locally:

```bash
npm run show-report
```

Screenshots and videos are retained on failure. Traces use `retain-on-failure` so a failed test can be inspected with:

```bash
npx playwright show-trace path/to/trace.zip
```

## GitHub Actions CI

The workflow is located at `.github/workflows/playwright.yml`.

### When it runs

- **Push:** runs on every pushed branch (a local commit alone does not trigger GitHub; push the commit).
- **Pull request:** runs when a pull request is opened or updated.
- **Manual run:** GitHub Actions provides a `test_environment` dropdown with `dev`, `stage`, and `test`.

Pushes and pull requests use `dev` by default. Manual runs use the environment selected in the dropdown.

### Configure GitHub Environments

In the GitHub repository, open **Settings → Environments** and create three environments named exactly:

- `dev`
- `stage`
- `test`

For each environment, add the following **Variables** (not secrets):

| Variable       | Example value           |
| -------------- | ----------------------- |
| `BASE_URL`     | UI application base URL |
| `API_BASE_URL` | API base URL            |

Add the following **Secrets**:

| Secret         | Purpose                         |
| -------------- | ------------------------------- |
| `ACME_EMAIL`   | UI test account email           |
| `PASSWORD`     | UI test account password        |
| `API_USERNAME` | API login username, if required |
| `API_PASSWORD` | API login password, if required |

Use the appropriate values for each environment. Do not put credentials in workflow YAML or commit them to the repository.

### CI behavior

The workflow:

1. Checks out the repository.
2. Sets up Node.js 22 and installs dependencies with `npm ci`.
3. Installs Chromium and its Linux dependencies.
4. Runs TypeScript type checking.
5. Runs the Playwright suite in headless mode.
6. Uploads reports and test output even if the test step fails.

CI uses one worker and retries failed tests up to two times. Artifacts are retained by GitHub for 14 days and can be downloaded from the workflow run under **Artifacts**. The `test-results/` artifact includes failure screenshots, videos, and traces when generated.

### Trigger a manual run

1. Open the repository on GitHub.
2. Select **Actions → Playwright Tests**.
3. Choose **Run workflow**.
4. Select `dev`, `stage`, or `test`.
5. Start the workflow.

## Design notes

- **Tests own the scenario.** They choose the endpoint, method, payload, headers, token handling, and assertions.
- **BaseApi owns generic HTTP calls.** It is intentionally thin and delegates to Playwright's `APIRequestContext`.
- **ApiServices is the API access point.** Add reusable endpoint-specific helpers only when there is a real need.
- **UI and API authentication are separate.** The UI `AuthenticationService` does not force API tests to authenticate.
- **Configuration is externalized.** Local values come from ignored environment files; CI values come from GitHub Environment variables and secrets.
- **Failure evidence is retained.** Screenshots, videos, and traces make CI failures easier to diagnose.

## Known scope and next steps

Current implementation is configured for Chromium. The repository includes a sample UI flow and a DummyJSON API authentication example. It does not currently implement Aqua integration, visual regression, performance testing, or a multi-browser matrix.

Potential future improvements:

- Add additional browser projects if cross-browser coverage is needed.
- Add API response schema validation where the API contract requires it.
- Add more UI and API scenarios based on application coverage.
- Add test data setup/cleanup helpers when test scenarios require them.
