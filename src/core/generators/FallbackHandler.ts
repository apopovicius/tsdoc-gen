import { Node } from "ts-morph";
import { TSDocHandler } from "./TSDocHandler";
import { tsdocTemplates } from "../templates";

export class FallbackHandler implements TSDocHandler {
  canHandle(_node: Node): boolean {
    return true; // fallback catches all
  }

  generate(): string {
    return tsdocTemplates.fallback();
  }
}
