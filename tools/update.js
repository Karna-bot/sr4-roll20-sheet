#!/usr/bin/env node
// npm run update : remet à zéro les fichiers générés (ils sont recréés par le build),
// récupère la branche distante, puis recompile.
// Les sources (pug, scss, js, data, traductions) ne sont jamais touchées : si elles ont
// des modifications locales, git pull refusera et rien n'est perdu.
'use strict'
const {execFileSync, execSync} = require('child_process')
const path = require('path')

const root = path.resolve(__dirname, '..')
const run = (cmd, args) => execFileSync(cmd, args, {cwd: root, stdio: 'inherit'})

// Fichiers produits par npm run build (voir tools/generate-spirits.js, compile-pug, compile:sass).
const generated = [
  'Shadowrun4thEdition.html',
  'Shadowrun4thEdition.css',
  'src/js/*-types.js',
  'src/pug/_*-types.pug',
]

run('git', ['checkout', '--', ...generated])
run('git', ['pull', '--rebase'])
execSync('npm run build', {cwd: root, stdio: 'inherit'})
