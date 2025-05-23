import { ParameterDeclaration } from "ts-morph";

/**
 * Extracts [[name, type]] tuples for @param doc generation.
 */
export function extractParamMetadata(
  params: ParameterDeclaration[]
): string[][] {
  return params.map((p) => {
    const name = p.getName();
    const type = p.getType().getText();
    return [name, type];
  });
}
