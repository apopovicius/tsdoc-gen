import { Node, Project } from "ts-morph";
import {
  ArrowFunctionHandler,
  ClassHandler,
  FallbackHandler,
  FunctionHandler,
  MethodHandler,
  PropertyHandler,
  TSDocHandler,
} from "./generators";

const handlers: TSDocHandler[] = [
  new FunctionHandler(),
  new ArrowFunctionHandler(),
  new ClassHandler(),
  new MethodHandler(),
  new PropertyHandler(),
  new FallbackHandler(), // Always last
];

/**
 * Generates a TSDoc block based on a given TypeScript code line.
 * Automatically selects the appropriate handler based on the syntax node.
 */
export function generateTSDoc(codeLine: string): string {
  const wrappedCode = codeLine.endsWith("{") ? codeLine + "}" : codeLine;

  const project = new Project({ useInMemoryFileSystem: true });

  const topLevelFile = project.createSourceFile("virtual.ts", wrappedCode);
  const wrapperFile = project.createSourceFile(
    "virtual-class.ts",
    `class Wrapper { ${wrappedCode} }`
  );

  const candidates: Node[] = [
    ...topLevelFile.getFunctions(),
    ...topLevelFile.getClasses(),
    ...topLevelFile.getVariableDeclarations(),
    ...(wrapperFile.getClass("Wrapper")?.getMembers() ?? []),
  ];

  for (const node of candidates) {
    const handler = handlers.find((h) => h.canHandle(node));
    if (handler) {
      return handler.generate(node);
    }
  }

  // Fallback — should be unreachable if fallback handler is in the array
  return new FallbackHandler().generate();
}
