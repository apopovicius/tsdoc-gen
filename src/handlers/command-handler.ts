import * as vscode from "vscode";
import { generateTSDoc } from "../core/tsdoc-engine";

export async function generateTSDocAtCursor() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const position = editor.selection.active;
  const line = editor.document.lineAt(position.line);
  const codeLine = line.text.trim();

  const comment = generateTSDoc(codeLine);

  await editor.edit((editBuilder) => {
    editBuilder.insert(line.range.start, comment + "\n");
  });
}
