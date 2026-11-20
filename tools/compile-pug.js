#!/usr/bin/env node
// Compile Shadowrun4thEdition.pug -> Shadowrun4thEdition.html avec l'API Pug 3.
// Remplace pug-cli (abandonné, embarquait Pug 2 et des dépendances vulnérables).
// Usage : node tools/compile-pug.js [sortie.html]
'use strict'
const fs = require('fs')
const path = require('path')
const pug = require('pug')

const root = path.resolve(__dirname, '..')
const input = path.join(root, 'Shadowrun4thEdition.pug')
const output = path.resolve(process.argv[2] || path.join(root, 'Shadowrun4thEdition.html'))

// pretty : HTML indenté (équivalent de l'option -P de pug-cli), garde des diffs lisibles
// et la mise en forme attendue par tools/to-cse.js.
const html = pug.renderFile(input, {basedir: root, pretty: true})
fs.writeFileSync(output, html)
console.log(`rendu : ${path.relative(root, output)}`)
