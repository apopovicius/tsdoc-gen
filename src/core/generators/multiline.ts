import { SourceFile, SyntaxKind } from "ts-morph";
import type { DeclarationMeta } from "./types";

/**
 * Collects all supported declaration types from the given TypeScript source file.
 * Returns a flat list of declaration nodes (functions, classes, methods, etc.)
 * each tagged with its specific kind, including support for multiline declarations.
 *
 * @param sourceFile - A ts-morph SourceFile instance to scan
 * @returns Array of typed declaration metadata for supported node kinds
 */
export function collectMultilineDeclarations(
  sourceFile: SourceFile
): DeclarationMeta[] {
  const declarations: DeclarationMeta[] = [];

  declarations.push(
    ...sourceFile.getFunctions().map(
      (node): DeclarationMeta => ({
        node,
        kind: "function",
      })
    ),
    ...sourceFile.getClasses().map(
      (node): DeclarationMeta => ({
        node,
        kind: "class",
      })
    ),
    ...sourceFile.getDescendantsOfKind(SyntaxKind.MethodDeclaration).map(
      (node): DeclarationMeta => ({
        node,
        kind: "method",
      })
    ),
    ...sourceFile.getDescendantsOfKind(SyntaxKind.PropertyDeclaration).map(
      (node): DeclarationMeta => ({
        node,
        kind: "property",
      })
    ),
    ...sourceFile.getDescendantsOfKind(SyntaxKind.ArrowFunction).map(
      (node): DeclarationMeta => ({
        node,
        kind: "arrow-function",
      })
    )
  );

  return declarations;
}
