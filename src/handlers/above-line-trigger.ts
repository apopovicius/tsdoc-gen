import * as vscode from "vscode";
import { generateTSDoc } from "../core/tsdoc-engine";

export function registerAboveLineDocTrigger(): vscode.Disposable {
  return vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || event.document !== editor.document) {
      return;
    }

    const change = event.contentChanges[0];
    if (!change || !change.text.includes("!")) {
      return;
    }

    const position = change.range.end;
    const lineText = editor.document.lineAt(position.line).text.trim();

    if (/^\/\*!$/.test(lineText)) {
      triggerAutoTSDoc(editor, position.line);
    }
  });
}

async function triggerAutoTSDoc(editor: vscode.TextEditor, line: number) {
  const nextLine = line + 1;
  if (nextLine >= editor.document.lineCount) {
    return;
  }

  const codeLine = editor.document.lineAt(nextLine).text.trim();
  const comment = generateTSDoc(codeLine);

  await editor.edit((editBuilder) => {
    const currentLineRange = editor.document.lineAt(line).range;
    editBuilder.replace(currentLineRange, comment);
  });
}
