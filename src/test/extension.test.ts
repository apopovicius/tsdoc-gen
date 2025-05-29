import * as assert from "assert";
import { suite, test } from "vitest";
import * as vscode from "vscode";

suite("TSDoc Gen Extension", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Extension should be present and activate", async () => {
    const ext = vscode.extensions.getExtension("your-publisher.tsdoc-gen");
    assert.ok(ext, "Extension not found");

    if (!ext!.isActive) {
      await ext!.activate();
    }

    assert.strictEqual(ext!.isActive, true, "Extension failed to activate");
  });

  test('Command "tsdoc-gen.generateTSDoc" should be registered', async () => {
    const commands = await vscode.commands.getCommands(true);
    console.log(commands);
    const found = commands.includes("tsdoc-gen.generateTSDoc");
    assert.ok(found, "Command tsdoc-gen.generateTSDoc not found");
  });
});
