import {
  FunctionDeclaration,
  ClassDeclaration,
  MethodDeclaration,
  ArrowFunction,
  PropertyDeclaration,
  Node,
  VariableDeclaration,
  ConstructorDeclaration,
} from "ts-morph";
import { TSDocGeneratorOptions } from "../config";

/**
 * Represents the supported kinds of TypeScript declarations
 * that can be documented using TSDoc.
 */
export type DeclarationKind =
  | "function"
  | "class"
  | "method"
  | "arrow-function"
  | "property"
  | "variable"
  | "constructor";

/**
 * Metadata structure that pairs a TypeScript declaration node
 * with its identified kind. This serves as the normalized input
 * for TSDoc comment generation.
 */
export interface DeclarationMeta {
  node:
    | FunctionDeclaration
    | ClassDeclaration
    | MethodDeclaration
    | ArrowFunction
    | PropertyDeclaration
    | VariableDeclaration
    | ConstructorDeclaration;
  kind: DeclarationKind;
}

/**
 * Interface for TSDoc generators. Each generator is responsible for:
 * - Identifying whether it can handle a given AST node
 * - Generating a properly formatted TSDoc comment for that node
 *
 * Implementations of this interface are used in the comment engine
 * to modularize support for various node types (functions, classes, etc.).
 */
export interface TSDocGenerator {
  /**
   * Determines whether this generator supports the given node.
   * @param node - The AST node to inspect
   */
  canHandle(node: Node): boolean;

  /**
   * Generates a TSDoc comment string for the provided node.
   * @param node - The AST node to generate documentation for
   * @param options - Optional configuration for TSDoc generation
   * @returns A complete TSDoc comment block
   */
  generate(node: Node, options?: TSDocGeneratorOptions): string;
}
