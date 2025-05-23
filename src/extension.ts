import * as vscode from "vscode";
import { generateTSDocAtCursor } from "./handlers/command-handler";
import { registerAboveLineDocTrigger } from "./handlers/above-line-trigger";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "tsdoc-gen.generateTSDoc",
      generateTSDocAtCursor
    )
  );

  context.subscriptions.push(registerAboveLineDocTrigger());
}

export function deactivate() {}
