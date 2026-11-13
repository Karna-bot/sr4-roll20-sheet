// Convertit la feuille compilee (mode "legacy") au format CSE (sans "legacy sanitization") :
//  - CSS : supprime le prefixe "sheet-" des classes (sauf roll templates), prefixe chaque selecteur par
//          ".ui-dialog .tab-content .charsheet", renomme les classes reservees par Roll20 (row, col, ...) en "sr-<nom>".
//  - HTML : renomme les memes classes reservees dans les attributs class.
// Usage : node tools/to-cse.js [css] [html]      (par defaut Shadowrun4thEdition.css / .html, ecrits sur place)
const fs = require("fs");

const PREFIX = ".ui-dialog .tab-content .charsheet";
const RESERVED = ["row", "col", "character", "new-window", "3colrow", "2colrow"];
const renameClass = name => (RESERVED.includes(name) ? `sr-${name}` : name);

// ---- selecteurs ----
const splitTopLevel = (text, sep) => {
    const parts = []; let depth = 0, quote = "", last = 0;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (quote) { if (c === "\\") i++; else if (c === quote) quote = ""; continue; }
        if (c === '"' || c === "'") quote = c;
        else if (c === "(" || c === "[") depth++;
        else if (c === ")" || c === "]") depth--;
        else if (c === sep && depth === 0) { parts.push(text.slice(last, i)); last = i + 1; }
    }
    parts.push(text.slice(last));
    return parts;
};

const convertSelector = sel => {
    const s = sel.trim();
    if (!s) return s;
    if (s.includes("sheet-rolltemplate")) return s;           // roll templates : prefixe "sheet-" conserve
    let out = "", bracket = 0, quote = "";
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (quote) { out += c; if (c === "\\") out += s[++i] || ""; else if (c === quote) quote = ""; continue; }
        if (c === '"' || c === "'") { quote = c; out += c; continue; }
        if (c === "[") bracket++;
        if (c === "]") bracket--;
        if (bracket === 0 && c === "." && s.startsWith("sheet-", i + 1)) {
            const m = /^[A-Za-z0-9_-]+/.exec(s.slice(i + 7));
            if (m) { out += "." + renameClass(m[0]); i += 6 + m[0].length; continue; }
        }
        out += c;
    }
    return `${PREFIX} ${out}`;
};

// ---- CSS ----
const stripComments = css => css.replace(/\/\*[\s\S]*?\*\//g, "");

const findBlockEnd = (text, open) => {
    let depth = 0, quote = "";
    for (let i = open; i < text.length; i++) {
        const c = text[i];
        if (quote) { if (c === "\\") i++; else if (c === quote) quote = ""; continue; }
        if (c === '"' || c === "'") quote = c;
        else if (c === "{") depth++;
        else if (c === "}") { depth--; if (depth === 0) return i; }
    }
    throw new Error("accolade non fermee");
};

const processCss = text => {
    let out = "", pos = 0;
    while (pos < text.length) {
        // prochain "{" ou ";" de niveau 0
        let i = pos, quote = "", paren = 0, found = -1;
        for (; i < text.length; i++) {
            const c = text[i];
            if (quote) { if (c === "\\") i++; else if (c === quote) quote = ""; continue; }
            if (c === '"' || c === "'") quote = c;
            else if (c === "(") paren++;
            else if (c === ")") paren--;
            else if ((c === "{" || c === ";") && paren === 0) { found = i; break; }
        }
        if (found < 0) { out += text.slice(pos); break; }
        const prelude = text.slice(pos, found).trim();
        if (text[found] === ";") { out += `${prelude};\n`; pos = found + 1; continue; }
        const end = findBlockEnd(text, found);
        const body = text.slice(found + 1, end);
        if (prelude.startsWith("@")) {
            const name = /^@[\w-]+/.exec(prelude)[0];
            out += ["@media", "@supports", "@document"].includes(name) ? `${prelude} {\n${processCss(body)}}\n` : `${prelude} {${body}}\n`;
        } else {
            out += `${splitTopLevel(prelude, ",").map(convertSelector).filter(Boolean).join(",\n")} {${body}}\n`;
        }
        pos = end + 1;
    }
    return out;
};

// ---- HTML ----
const convertHtml = html => html.replace(/(<rolltemplate[\s\S]*?<\/rolltemplate>)|(\bclass\s*=\s*)(["'])([^"']*)\3/g,
    (all, roll, attr, q, value) => {
        if (roll) return roll;
        return `${attr}${q}${value.split(/\s+/).map(t => (RESERVED.includes(t) ? `sr-${t}` : t)).join(" ")}${q}`;
    });

if (require.main === module) {
    const cssPath = process.argv[2] || "Shadowrun4thEdition.css";
    const htmlPath = process.argv[3] || "Shadowrun4thEdition.html";
    fs.writeFileSync(cssPath, processCss(stripComments(fs.readFileSync(cssPath, "utf8"))));
    fs.writeFileSync(htmlPath, convertHtml(fs.readFileSync(htmlPath, "utf8")));
    console.log(`CSE : ${cssPath} et ${htmlPath} convertis`);
}
module.exports = { processCss, stripComments, convertHtml, convertSelector };
