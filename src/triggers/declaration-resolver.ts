import * as vscode from "vscode";
import { Project } from "ts-morph";
import { DeclarationMeta } from "../core/generators/types";
import { collectMultilineDeclarations } from "../core/generators";

/**
 * @private used internally to resolve the best-matching declaration
 * Resolve the best-matching declaration near the cursor.
 * @param document The current text document
 * @param position The current cursor position
 * @param mode Smart (same or below) or below-only
 * @returns DeclarationMeta or undefined
 */
export function getNextLineDeclaration(
  document: vscode.TextDocument,
  position: vscode.Position
): { declaration: DeclarationMeta; insertLine: number } | undefined {
  const triggerLine = position.line;
  const lines = document.getText().split("\n");

  const trigger = vscode.workspace
    .getConfiguration("tsdocGen")
    .get<string>("triggerKeyword", "/*!");

  if (lines[triggerLine].trim() === trigger) {
    lines[triggerLine] = "";
  }

  const cleanSource = lines.join("\n");

  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile("virtual.ts", cleanSource, {
    overwrite: true,
  });

  const declarations = collectMultilineDeclarations(sourceFile);

  for (const declaration of declarations) {
    const declLine = declaration.node.getStartLineNumber();
    if (declLine === triggerLine + 2) {
      // add 2 because triggerLine is 0-based(+1) and we skip the trigger line(+1)
      return { declaration, insertLine: triggerLine };
    }
  }

  return undefined;
}

/**
 * Finds a declaration that starts on the same line as the current cursor.
 *
 * @param document The VS Code document
 * @param position The active cursor position
 * @returns A matching declaration and insert line, or undefined
 */
export function getSameLineDeclaration(
  document: vscode.TextDocument,
  position: vscode.Position
): { declaration: DeclarationMeta; insertLine: number } | undefined {
  const sourceText = document.getText();
  const cursorLine = position.line; // VS Code line (0-based)

  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile("virtual.ts", sourceText, {
    overwrite: true,
  });

  const declarations = collectMultilineDeclarations(sourceFile);

  for (const declaration of declarations) {
    const declLine = declaration.node.getStartLineNumber() - 1; // ts-morph is 1-based
    if (declLine === cursorLine) {
      return { declaration, insertLine: cursorLine };
    }
  }

  return undefined;
}
