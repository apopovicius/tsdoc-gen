import * as vscode from "vscode";
import { TSDocGeneratorOptions } from "../core/";

/**
 * Reads tsdocGen settings from the user's VS Code config.
 */
export function getTSDocGeneratorOptions(): TSDocGeneratorOptions {
  const config = vscode.workspace.getConfiguration("tsdocGen");

  return {
    includeReturnsForVoid: config.get("includeReturnsForVoid", false),
    includeEmptyParamBlock: config.get("includeEmptyParamBlock", false),
  };
}
