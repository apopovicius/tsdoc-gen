import * as vscode from "vscode";
import { resolveDeclarationFromPosition } from "./declaration-resolver";
import { createTSDocCommentFor, type DeclarationMeta } from "../core";

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
  return vscode.commands.registerCommand(
    "tsdoc-gen.generateTSDoc",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const document = editor.document;
      const position = editor.selection.active;

      const match: DeclarationMeta | undefined = resolveDeclarationFromPosition(
        document,
        position,
        "smart"
      );

      if (!match) {
        vscode.window.showWarningMessage(
          "No matching declaration found below or on the same line."
        );
        return;
      }

      const tsdoc = createTSDocCommentFor(match);
      const insertPos = new vscode.Position(match.node.getStartLineNumber(), 0);

      await editor.edit((editBuilder) => {
        editBuilder.insert(insertPos, tsdoc + "\n");
      });
    }
  );
}
