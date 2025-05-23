const path = require("path");
const { runTests } = require("@vscode/test-electron");
const { execSync } = require("child_process");

async function runUnitTests() {
  console.log("Running unit tests...");
  execSync("npx vitest run", { stdio: "inherit" });
}

async function runExtensionTests() {
  console.log("Running VS Code extension tests...");
  await runTests({
    extensionDevelopmentPath: path.resolve(__dirname, "../../"),
    extensionTestsPath: path.resolve(__dirname, "./extension.test.ts"),
  });
}

runUnitTests()
  .then(runExtensionTests)
  .catch((err) => {
    console.error("Test run failed:", err);
    process.exit(1);
  });
