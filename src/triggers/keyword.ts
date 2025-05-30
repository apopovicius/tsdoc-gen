import * as vscode from "vscode";
import { resolveDeclarationFromPosition } from "./declaration-resolver";
import { createTSDocCommentFor, type DeclarationMeta } from "../core";

/**
 * @public
 * Registers the auto-insertion trigger for TSDoc comments.
 *
 * This sets up a listener on text document changes. When the user types
 * the configured trigger keyword (default: `/*!`) on a line, and the cursor
 * remains on that same line, the extension will:
 *
 * - Detect if a TypeScript declaration (function, class, method, etc.) exists
 *   immediately on the next line.
 * - Automatically replace the trigger keyword line with a generated TSDoc block.
 *
 * @remarks
 * This is used for "above-line" TSDoc generation, typically triggered by typing
 * a keyword directly in the editor, not via a command or menu.
 *
 * @returns A disposable listener for cleanup on extension deactivation.
 */
export function registerKeywordTrigger(): vscode.Disposable {
  return vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || event.document !== editor.document) {
      return;
    }

    const change = event.contentChanges[0];
    if (!change) {
      return;
    }

    const insertedText = change.text.trim();

    // Get trigger keyword from user config or default to /*!
    const trigger = vscode.workspace
      .getConfiguration("tsdocGen")
      .get<string>("triggerKeyword", "/*!");

    const triggerLine = change.range.start.line;
    const isOnTriggerLine = editor.selection.active.line === triggerLine;

    if (insertedText === trigger && isOnTriggerLine) {
      tryInsertTSDocBelowTriggerLine(editor, triggerLine);
    }
  });
}

/**
 * Attempts to resolve and insert a TSDoc comment block if a declaration
 * exists immediately below the trigger line.
 */
async function tryInsertTSDocBelowTriggerLine(
  editor: vscode.TextEditor,
  triggerLine: number
) {
  const document = editor.document;
  const position = new vscode.Position(triggerLine, 0);

  const match: DeclarationMeta | undefined = resolveDeclarationFromPosition(
    document,
    position,
    "below-only"
  );

  if (!match || match.node.getStartLineNumber() !== triggerLine + 1) {
    return;
  }

  const tsdoc = createTSDocCommentFor(match);
  const triggerLineRange = document.lineAt(triggerLine).range;

  await editor.edit((editBuilder) => {
    editBuilder.replace(triggerLineRange, tsdoc);
  });
}
