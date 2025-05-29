import {
  SourceFile,
  FunctionDeclaration,
  ClassDeclaration,
  MethodDeclaration,
  ArrowFunction,
  PropertyDeclaration,
  Node,
  SyntaxKind,
} from "ts-morph";

export type DeclarationKind =
  | "function"
  | "class"
  | "method"
  | "arrow-function"
  | "property";

export interface DeclarationMeta {
  node: Node;
  kind: DeclarationKind;
}

export function collectMultilineDeclarations(
  sourceFile: SourceFile
): DeclarationMeta[] {
  const declarations: DeclarationMeta[] = [];

  declarations.push(
    ...sourceFile.getFunctions().map((node) => ({
      node,
      kind: "function" as const,
    })),
    ...sourceFile.getClasses().map((node) => ({
      node,
      kind: "class" as const,
    })),
    ...sourceFile
      .getDescendantsOfKind(SyntaxKind.MethodDeclaration)
      .map((node) => ({
        node,
        kind: "method" as const,
      })),
    ...sourceFile
      .getDescendantsOfKind(SyntaxKind.ArrowFunction)
      .map((node) => ({
        node,
        kind: "arrow-function" as const,
      })),
    ...sourceFile
      .getDescendantsOfKind(SyntaxKind.PropertyDeclaration)
      .map((node) => ({
        node,
        kind: "property" as const,
      }))
  );

  return declarations;
}
