const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");

async function setupNodeEvents(on, config) {
  await addCucumberPreprocessorPlugin(on, config);

  on("before:browser:launch", (browser = {}, launchOptions) => {
    if (browser.family === "chromium") {
      // Mitiga falhas intermitentes de service worker/proxy em sites de terceiros.
      launchOptions.args.push("--disable-service-worker");
      launchOptions.args.push("--disable-background-networking");
    }
    return launchOptions;
  });

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );

  return config;
}

function readBaseUrlFromEnvFile() {
  try {
    const envPath = path.resolve(__dirname, ".env");
    if (!fs.existsSync(envPath)) {
      return null;
    }

    const envContent = fs.readFileSync(envPath, "utf8");
    const line = envContent
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith("#") && l.startsWith("BASE_URL="));

    if (!line) {
      return null;
    }

    const value = line.substring("BASE_URL=".length).trim();
    return value || null;
  } catch {
    return null;
  }
}

const resolvedBaseUrl = process.env.BASE_URL || readBaseUrlFromEnvFile() || "https://www.amazon.com.br";

module.exports = defineConfig({
  e2e: {
    baseUrl: resolvedBaseUrl,
    specPattern: "cypress/e2e/features/**/*.feature",
    supportFile: "cypress/support/e2e.js",
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 240000,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    // Ambiente para testes locais: usar mock em fixtures quando true
        env: {
          USE_MOCK: false,
        },
    async setupNodeEvents(on, config) {
      return setupNodeEvents(on, config);
    },
  },

  reporter: "mochawesome",

  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: true,
    json: true,
  },

  screenshotsFolder: "cypress/screenshots",

  videosFolder: "cypress/videos",

  trashAssetsBeforeRuns: true,

  video: true,
});