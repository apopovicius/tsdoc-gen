import { Node, SyntaxKind } from "ts-morph";
import type { DeclarationMeta, TSDocGenerator } from "./generators";

import {
  FunctionHandler,
  ArrowFunctionHandler,
  ClassHandler,
  MethodHandler,
  PropertyHandler,
  VariableHandler,
  ConstructorHandler,
  FallbackHandler,
} from "./generators";

import type { TSDocGeneratorOptions } from "./config";

/**
 * Static TSDoc engine that manages generator registration and
 * TSDoc comment creation from TypeScript declarations.
 *
 * This engine is used internally to map AST node types to the appropriate
 * generator and produce a complete TSDoc comment block.
 */
class TSDocEngine {
  private static generators: TSDocGenerator[] = [];

  /**
   * Registers one or more TSDoc generators.
   * Generators are matched in the order they are registered.
   *
   * @param handlers - One or more implementations of TSDocGenerator
   */
  static register(...handlers: TSDocGenerator[]) {
    this.generators.push(...handlers);
  }

  /**
   * Generates a TSDoc comment block from the given declaration.
   * Delegates to the first generator that reports it can handle the node.
   * Falls back to a generic TSDoc block if no handler matches.
   *
   * @param declaration - A normalized TypeScript declaration node and kind
   * @param options - User-configurable TSDoc generation options
   * @returns A full TSDoc comment block as a string
   */
  static generate(
    declaration: DeclarationMeta,
    options?: TSDocGeneratorOptions
  ): string {
    const generator = this.generators.find((g) => {
      try {
        return g.canHandle(declaration.node);
      } catch {
        return false;
      }
    });

    return generator
      ? generator.generate(declaration.node, options)
      : new FallbackHandler().generate(
          {
            getKind: () => SyntaxKind.Unknown,
          } as Node,
          options
        );
  }
}

// Register built-in generators (priority order)
TSDocEngine.register(
  new FunctionHandler(),
  new ArrowFunctionHandler(),
  new ClassHandler(),
  new MethodHandler(),
  new PropertyHandler(),
  new VariableHandler(),
  new ConstructorHandler(),
  new FallbackHandler() // Always last
);

/**
 * Public API to generate a TSDoc comment for a given declaration.
 *
 * Use this as the main entry point to create documentation strings
 * from any supported TypeScript declaration (function, class, method, etc.).
 *
 * @param declaration - A resolved and typed declaration
 * @param options - User-defined generation preferences
 * @returns A formatted TSDoc comment block
 */
export const createTSDocCommentFor = TSDocEngine.generate.bind(TSDocEngine);
