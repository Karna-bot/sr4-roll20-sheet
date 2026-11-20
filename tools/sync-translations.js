// Complete chaque translations/<langue>.json avec les cles de translation.json (anglais) qui lui manquent :
// plus de libelles "[cle]" quand une nouvelle cle est ajoutee. fr.json est maintenu a la main (aucune cle ajoutee en anglais).
// Lance automatiquement par "npm run build" ; idempotent.
const fs = require('fs')
const path = require('path')
const root = path.join(__dirname, '..')
const base = JSON.parse(fs.readFileSync(path.join(root, 'translation.json'), 'utf8'))
const dir = path.join(root, 'translations')
let total = 0
fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'fr.json').forEach(file => {
  const target = path.join(dir, file)
  const text = fs.readFileSync(target, 'utf8')
  const data = JSON.parse(text)
  const missing = Object.keys(base).filter(k => !(k in data))
  if (!missing.length) return
  const body = text.slice(0, text.lastIndexOf('}')).replace(/\s+$/, '')
  const extra = missing.map(k => `    ${JSON.stringify(k)}: ${JSON.stringify(base[k])}`).join(',\n')
  const out = `${body},\n${extra}\n}\n`
  JSON.parse(out)
  fs.writeFileSync(target, out)
  total += missing.length
})
console.log(`translations : ${total} cle(s) ajoutee(s)`)
