import * as iconvlite from 'iconv-lite';
import * as fs from "fs-extra";

export function convertFileToUtf8(fileName: string, srcEncoding: string) {
  const content = fs.readFileSync(fileName);
  const decoded = iconvlite.decode(content, srcEncoding);
  fs.writeFileSync(fileName, decoded);
}
