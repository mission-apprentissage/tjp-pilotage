export function isTerritoireSelected(code: string | undefined): boolean {
  return typeof code === "string" && code.length > 0;
}
