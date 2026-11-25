#!/usr/bin/env node
const { spawn } = require("child_process");

const appId = process.argv[2];
const env = process.argv[3];
// const localEnvFlag = '--local';
const dockerEnvFlag = "--docker";

if (!appId) {
  console.error("Error: App ID is required");
  console.error("Usage: yarn start <app-id> [--local]");
  process.exit(1);
}

let args = [];
let command = "node";

if (dockerEnvFlag === env) {
  console.log(`Starting app ${appId} in production environment`);

  args = [`dist/src/apps/${appId}/app.js`];
} else {
  console.log(`Starting app ${appId} in local environment`);

  args = [
    "cross-env",
    "APP_ENV=local",
    "nest",
    "start",
    "--watch",
    "--entryFile",
    `src/apps/${appId}/app.js`,
  ];
  command = "yarn";
}

const child = spawn(command, args, {
  stdio: "inherit",
  shell: true,
});

child.on("error", (error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code || 0);
});
