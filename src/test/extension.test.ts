import * as assert from "assert";
import { suite, test } from "vitest";
import * as vscode from "vscode";

suite("TSDoc Gen Extension", () => {
  test("Extension should be present and activate", async () => {
    const ext = vscode.extensions.getExtension("your-publisher.tsdoc-gen");
    assert.ok(ext, "Extension not found");

    if (!ext!.isActive) {
      await ext!.activate();
    }

    assert.strictEqual(ext!.isActive, true, "Extension failed to activate");
  });

  test('Command "tsdoc-gen.generateComment" should be registered', async () => {
    const commands = await vscode.commands.getCommands(true);
    const found = commands.includes("tsdoc-gen.generateComment");
    assert.ok(found, "Command tsdoc-gen.generateComment not found");
  });
});
