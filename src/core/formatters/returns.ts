const IGNORED_RETURN_TYPES = [
  /^void$/,
  /^undefined$/,
  /^null$/,
  /^Promise<\s*(void|undefined|null)\s*>$/,
  /^Observable<\s*(void|undefined|null)\s*>$/,
];

export function shouldIncludeReturns(type: string, force: boolean): boolean {
  if (force) {
    return true;
  }
  return !IGNORED_RETURN_TYPES.some((pattern) => pattern.test(type.trim()));
}
