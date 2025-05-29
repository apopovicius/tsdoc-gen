import { Node } from "ts-morph";

export interface TSDocHandler {
  /**
   * Returns true if this handler is responsible for generating docs for the given node.
   */
  canHandle(node: Node): boolean;

  /**
   * Returns the generated TSDoc string for the given node.
   */
  generate(node: Node): string;
}
