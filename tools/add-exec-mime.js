const fs = require("fs");
const fname = process.argv[2];
console.log("Add exec mime to " + fname);
const mimeHeader = "#!/usr/bin/env node\n";
const fileContent = fs.readFileSync(fname);
fs.writeFileSync(fname, mimeHeader + fileContent);
console.log("...ok");
