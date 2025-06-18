import * as vscode from "vscode";
import {
  getNextLineDeclaration,
  getSameLineDeclaration,
} from "./declaration-resolver";
import { createTSDocCommentFor } from "../core";

/**
 * @public
 * Registers the TSDoc generation command (`tsdoc-gen.generateTSDoc`),
 * which is triggered manually via:
 * - Command Palette
 * - Context menu
 * - Editor title menu
 * - Keyboard shortcut (e.g. Ctrl+Alt+D)
 *
 * It resolves the nearest TypeScript declaration (on the same line or below
 * the cursor) and inserts a generated TSDoc comment block above it.
 */
export function registerCommandTrigger(): vscode.Disposable {
  console.log("[tsdoc-gen] Registering command trigger...");
  return vscode.commands.registerCommand(
    "tsdoc-gen.generateTSDoc",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const document = editor.document;
      const position = editor.selection.active;
      const triggerLine = position.line;

      function isBlankOrTriggerLine(
        document: vscode.TextDocument,
        line: number
      ): boolean {
        const text = document.lineAt(line).text.trim();
        const trigger = vscode.workspace
          .getConfiguration("tsdocGen")
          .get<string>("triggerKeyword", "/*!");
        return text === "" || text === trigger;
      }

      let match;
      let sameLine = false;

      if (isBlankOrTriggerLine(document, triggerLine)) {
        match = getNextLineDeclaration(document, position);
      } else {
        match = getSameLineDeclaration(document, position);
        sameLine = true;
      }

      if (!match) {
        vscode.window.showWarningMessage(
          "No matching declaration found on or below the cursor."
        );
        return;
      }

      const { declaration, insertLine } = match;
      let tsdoc = createTSDocCommentFor(declaration);
      if (sameLine) {
        tsdoc = tsdoc + "\n";
      }
      const insertPos = new vscode.Position(insertLine, 0);

      await editor.edit((editBuilder) => {
        editBuilder.insert(insertPos, tsdoc);
      });

      vscode.window.showInformationMessage("TSDoc comment inserted.");
    }
  );
}
