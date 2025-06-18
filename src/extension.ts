import * as vscode from "vscode";
import { registerCommandTrigger, registerKeywordTrigger } from "./triggers";

/**
 * Entry point for the TSDoc Generator extension.
 * Registers:
 * - Manual TSDoc generation command (Ctrl+Alt+D, context menu, etc.)
 * - Auto-insertion listener for the configured trigger keyword (e.g. /*!).
 */
export function activate(context: vscode.ExtensionContext) {
  console.log("[tsdoc-gen] Activating extension...");
  context.subscriptions.push(
    registerCommandTrigger(),
    registerKeywordTrigger()
  );
}

/**
 * Deactivation hook (optional for cleanup, currently unused).
 */
export function deactivate() {}
