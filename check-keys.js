const en = require("./public/locales/en/chatbots.json");
const nl = require("./public/locales/nl/chatbots.json");
const es = require("./public/locales/es/chatbots.json");
function check(a, b, p) {
  p = p || "";
  for (const k of Object.keys(a)) {
    if (!(k in b)) console.log("MISSING:", p + k);
    else if (typeof a[k] === "object" && !Array.isArray(a[k])) check(a[k], b[k], p + k + ".");
  }
}
check(en, nl);
check(en, es);
console.log("Key check done");
