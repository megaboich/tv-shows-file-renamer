import * as path from "path";

export function normalizeFileName(fileName: string) {
  let name = path.basename(fileName);

  // Remove extension from filename
  const dotIndex = name.indexOf(".");
  if (dotIndex >= 0) {
    name = name.substr(0, dotIndex);
  }

  // Remove S01E01 from filename
  name = name.replace(/(S|s)(\d+)(E|e)(\d+)([\s-\.]*)/g, "");

  return name;
}
