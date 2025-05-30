import * as vscode from "vscode";
import { getNextLineDeclaration } from "./declaration-resolver";
import { createTSDocCommentFor } from "../core";

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
 * @returns A disposable listener for cleanup on extension deactivation.
 */
export function registerKeywordTrigger(): vscode.Disposable {
  return vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || event.document !== editor.document) {
      return;
    }

    const change = event.contentChanges[0];
    if (!change || change.text !== "!") {
      return;
    }

    const triggerLine = change.range.start.line;
    const cursorLine = editor.selection.active.line;

    if (cursorLine !== triggerLine) {
      return;
    }

    const trigger = vscode.workspace
      .getConfiguration("tsdocGen")
      .get<string>("triggerKeyword", "/*!");

    const currentLine = editor.document.lineAt(triggerLine).text.trim();

    if (currentLine === trigger) {
      tryInsertTSDocInline(editor, triggerLine);
    }
  });
}

/**
 * Attempts to resolve and insert a TSDoc comment block if a declaration
 * exists immediately on the trigger line.
 */
async function tryInsertTSDocInline(
  editor: vscode.TextEditor,
  triggerLine: number
) {
  const document = editor.document;
  const line = document.lineAt(triggerLine);
  const lineText = line.text;
  const trigger = vscode.workspace
    .getConfiguration("tsdocGen")
    .get<string>("triggerKeyword", "/*!");

  const triggerIndex = lineText.indexOf(trigger);
  if (triggerIndex === -1) {
    return;
  }

  const triggerRange = new vscode.Range(
    new vscode.Position(triggerLine, triggerIndex),
    new vscode.Position(triggerLine, triggerIndex + trigger.length)
  );

  const position = new vscode.Position(triggerLine, 0);
  const match = getNextLineDeclaration(document, position);

  if (
    !match ||
    match.declaration.node.getStartLineNumber() !== triggerLine + 2 // +2 because we skip the trigger line
  ) {
    return;
  }

  const tsdoc = createTSDocCommentFor(match.declaration);

  await editor.edit((editBuilder) => {
    editBuilder.replace(triggerRange, tsdoc);
  });
}
