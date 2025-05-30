import * as vscode from "vscode";
import { Project } from "ts-morph";
import { DeclarationMeta } from "../core/generators/types";
import { collectMultilineDeclarations } from "../core/generators";

/**
 * Modes for how strictly to match declaration placement.
 */
export type ResolutionMode = "smart" | "below-only";

/**
 * @private used internally to resolve the best-matching declaration
 * Resolve the best-matching declaration near the cursor.
 * @param document The current text document
 * @param position The current cursor position
 * @param mode Smart (same or below) or below-only
 * @returns DeclarationMeta or undefined
 */
export function resolveDeclarationFromPosition(
  document: vscode.TextDocument,
  position: vscode.Position,
  mode: ResolutionMode
): DeclarationMeta | undefined {
  const sourceText = document.getText();
  const cursorLine = position.line;

  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile("virtual.ts", sourceText, {
    overwrite: true,
  });

  const declarations = collectMultilineDeclarations(sourceFile);

  return declarations.find(({ node }: DeclarationMeta) => {
    const nodeLine = node.getStartLineNumber();
    return mode === "below-only"
      ? nodeLine === cursorLine + 1
      : nodeLine === cursorLine || nodeLine === cursorLine + 1;
  });
}
