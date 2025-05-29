import * as vscode from "vscode";
import { generateTSDoc } from "../core/";

export async function generateTSDocAtCursor() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const position = editor.selection.active;
  const document = editor.document;

  const currentLineText = document.lineAt(position.line).text.trim();

  // Prefer next line if current is empty or trigger keyword
  const isTriggerLine =
    currentLineText === "" ||
    currentLineText === "/*!" ||
    currentLineText.startsWith("/*!");

  const targetLineIndex = isTriggerLine ? position.line + 1 : position.line;
  if (targetLineIndex >= document.lineCount) {
    return;
  }

  const targetLineText = document.lineAt(targetLineIndex).text.trim();
  if (!targetLineText) {
    return;
  }

  const tsdoc = generateTSDoc(targetLineText);

  // Insert TSDoc comment above the target line
  const insertPos = new vscode.Position(targetLineIndex, 0);
  await editor.edit((editBuilder) => {
    editBuilder.insert(insertPos, tsdoc + "\n");
  });
}
