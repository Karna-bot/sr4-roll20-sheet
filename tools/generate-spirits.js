// Genere src/js/spirit-types.js et src/pug/_spirit-types.pug depuis data/spirits.json
// Lance automatiquement par "npm run build". Ne modifie pas les fichiers generes a la main.
const fs = require('fs')
const path = require('path')
const root = path.join(__dirname, '..')
const spirits = JSON.parse(fs.readFileSync(path.join(root, 'data', 'spirits.json'), 'utf8'))
const ATTRS = ['body', 'agility', 'reaction', 'strength', 'charisma', 'intuition', 'logic', 'willpower']
const key = name => name.toLowerCase()
const label = name => name.replace(/_/g, ' ')

const js = [
  '// FICHIER GENERE par tools/generate-spirits.js depuis data/spirits.json : ne pas modifier a la main.',
  '// Attribut = Force + decalage ; ordre des decalages : ' + ATTRS.join(', ') + '.',
  'const SPIRIT_TYPES = {',
  Object.entries(spirits).map(([name, s]) =>
    `  ${key(name)}: {offsets: [${ATTRS.map(a => (s.attrMod || {})[a] || 0).join(', ')}], powers: ${JSON.stringify((s.powers || []).join(', '))}}`
  ).join(',\n'),
  '}',
  ''
].join('\n')
fs.writeFileSync(path.join(root, 'src', 'js', 'spirit-types.js'), js)

const pug = '//- FICHIER GENERE par tools/generate-spirits.js : ne pas modifier a la main.\n' +
  '- const spiritTypes = [' + Object.keys(spirits).map(n => `['${key(n)}', '${label(n)}']`).join(', ') + '];\n'
fs.writeFileSync(path.join(root, 'src', 'pug', '_spirit-types.pug'), pug)
console.log(`${Object.keys(spirits).length} types d'esprits generes`)

// ---- TRADITIONS (onglet Magie de la fiche PC) : data/traditions.json -> src/js/tradition-types.js, src/pug/_tradition-types.pug
const traditions = JSON.parse(fs.readFileSync(path.join(root, 'data', 'traditions.json'), 'utf8'))
const CORE = ['body', 'agility', 'reaction', 'strength', 'charisma', 'intuition', 'logic', 'willpower']
const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
// Les traditions "libres" (ex. "Trad GM") sont remplacees par l'option "Custom" de la fiche
const usable = Object.entries(traditions).filter(([name]) => !/^Trad GM/i.test(name))
const parseDrain = text => {
  // Les deux premiers attributs de base cites ("Willpower + Intuition / Logic" -> willpower, intuition)
  const found = (String(text || '').toLowerCase().match(/[a-z]+/g) || []).filter(w => CORE.includes(w))
  return found.length >= 2 ? found.slice(0, 2) : null
}
const spiritsText = t => ['combat', 'detection', 'health', 'illusion', 'manipulation']
  .map(k => `${k[0].toUpperCase()}${k.slice(1)}: ${((t.spirits || {})[k] || '-').replace(/_/g, ' ')}`).join(' | ')

const tjs = [
  '// FICHIER GENERE par tools/generate-spirits.js depuis data/traditions.json : ne pas modifier a la main.',
  'const TRADITIONS = {',
  usable.map(([name, t]) => `  ${slug(name)}: {drain: ${JSON.stringify(parseDrain(t.drainAttribute))}, spirits: ${JSON.stringify(spiritsText(t))}}`).join(',\n'),
  '}',
  ''
].join('\n')
fs.writeFileSync(path.join(root, 'src', 'js', 'tradition-types.js'), tjs)
fs.writeFileSync(path.join(root, 'src', 'pug', '_tradition-types.pug'),
  '//- FICHIER GENERE par tools/generate-spirits.js : ne pas modifier a la main.\n' +
  '- const traditionTypes = [' + usable.map(([n]) => `['${slug(n)}', '${n.replace(/'/g, "\\'")}']`).join(', ') + '];\n')
console.log(`${usable.length} traditions generees`)

// ---- SPRITES (fiche type sprite) : data/sprites.json -> src/js/sprite-types.js, src/pug/_sprite-types.pug
// Attribut = Niveau + decalage (charisme, intuition, logique ; les autres attributs d'un sprite valent 0 d'apres Chummer).
const sprites = JSON.parse(fs.readFileSync(path.join(root, 'data', 'sprites.json'), 'utf8'))
const SPRITE_ATTRS = ['charisma', 'intuition', 'logic']
const list = a => JSON.stringify((a || []).join(', '))
fs.writeFileSync(path.join(root, 'src', 'js', 'sprite-types.js'), [
  '// FICHIER GENERE par tools/generate-spirits.js depuis data/sprites.json : ne pas modifier a la main.',
  '// Attribut = Niveau + decalage ; ordre des decalages : ' + SPRITE_ATTRS.join(', ') + '. initMult : initiative matricielle = Niveau x initMult.',
  'const SPRITE_TYPES = {',
  Object.entries(sprites).map(([name, s]) =>
    `  ${key(name)}: {offsets: [${SPRITE_ATTRS.map(a => (s.attrMod || {})[a] || 0).join(', ')}], initMult: ${s.initMult || 1}, matrix: ${s.matrix ? `[${s.matrix.response || 0}, ${s.matrix.firewall || 0}]` : 'null'}, powers: ${list(s.powers)}, powerList: ${JSON.stringify((s.powers || []).map(slug))}, skills: ${list(s.skills)}, forms: ${list(s.complexForms)}, optionalForms: ${list(s.optionalComplexForms)}}`
  ).join(',\n'),
  '}',
  ''
].join('\n'))
fs.writeFileSync(path.join(root, 'src', 'pug', '_sprite-types.pug'),
  '//- FICHIER GENERE par tools/generate-spirits.js : ne pas modifier a la main.\n' +
  '- const spriteTypes = [' + Object.keys(sprites).map(n => `['${key(n)}', '${label(n)}']`).join(', ') + '];\n')
console.log(`${Object.keys(sprites).length} types de sprites generes`)

// ---- STREAMS (onglet Matrice de la fiche PC, technomanciens) : data/streams.json -> src/js/stream-types.js, src/pug/_stream-types.pug
const streams = JSON.parse(fs.readFileSync(path.join(root, 'data', 'streams.json'), 'utf8'))
const parseFade = text => {
  const found = (String(text || '').toLowerCase().match(/[a-z]+/g) || []).filter(w => CORE.includes(w) || w === 'resonance')
  return found.length >= 2 ? found.slice(0, 2) : null
}
const spriteLabel = n => n.replace(/_/g, ' ')
fs.writeFileSync(path.join(root, 'src', 'js', 'stream-types.js'), [
  '// FICHIER GENERE par tools/generate-spirits.js depuis data/streams.json : ne pas modifier a la main.',
  'const STREAMS = {',
  Object.entries(streams).map(([name, st]) =>
    `  ${slug(name)}: {fade: ${JSON.stringify(parseFade(st.fadeAttribute))}, sprites: ${JSON.stringify((st.sprites || []).map(spriteLabel).join(', '))}}`
  ).join(',\n'),
  '}',
  ''
].join('\n'))
fs.writeFileSync(path.join(root, 'src', 'pug', '_stream-types.pug'),
  '//- FICHIER GENERE par tools/generate-spirits.js : ne pas modifier a la main.\n' +
  '- const streamTypes = [' + Object.keys(streams).map(n => `['${slug(n)}', '${n.replace(/'/g, "\\'")}', ${JSON.stringify((streams[n].sprites || []).map(x => x.toLowerCase()))}]`).join(', ') + '];\n')
console.log(`${Object.keys(streams).length} flux generes`)

// ---- TECHNOCRITTERS (fiche grunt emergee) : data/technocritters.json -> src/js/technocritter-types.js, src/pug/_technocritter-types.pug
// Statistiques matricielles (Reponse, Signal, Systeme, Pare-feu, Filtre de biofeedback) = Resonance (Running Wild p.189-192).
const critters = JSON.parse(fs.readFileSync(path.join(root, 'data', 'technocritters.json'), 'utf8'))
fs.writeFileSync(path.join(root, 'src', 'js', 'technocritter-types.js'), [
  '// FICHIER GENERE par tools/generate-spirits.js depuis data/technocritters.json : ne pas modifier a la main.',
  'const TECHNOCRITTER_TYPES = {',
  Object.entries(critters).map(([name, c]) =>
    `  ${key(name)}: {resonance: ${c.resonance}, passes: ${c.passes}, skills: ${list([c.skills])}, forms: ${list([c.complexForms])}, powers: ${list([c.powers])}}`
  ).join(',\n'),
  '}',
  ''
].join('\n'))
fs.writeFileSync(path.join(root, 'src', 'pug', '_technocritter-types.pug'),
  '//- FICHIER GENERE par tools/generate-spirits.js : ne pas modifier a la main.\n' +
  '- const technocritterTypes = [' + Object.keys(critters).map(n => `['${key(n)}', '${label(n)}']`).join(', ') + '];\n')
console.log(`${Object.keys(critters).length} technocritters generes`)

// ---- IA (fiche type "ai") : data/ai.json -> src/js/ai-types.js, src/pug/_ai-types.pug
const ais = JSON.parse(fs.readFileSync(path.join(root, 'data', 'ai.json'), 'utf8'))
const aiKey = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '_')
fs.writeFileSync(path.join(root, 'src', 'js', 'ai-types.js'), [
  '// FICHIER GENERE par tools/generate-spirits.js depuis data/ai.json : ne pas modifier a la main.',
  '// offsets = Charisme, Intuition, Logique, Volonte, Edge par rapport a R (indice de reference) ; null = non renseigne (IA ferales).',
  'const AI_TYPES = {',
  Object.entries(ais).map(([name, a]) =>
    `  ${aiKey(name)}: {group: ${JSON.stringify(a.group)}, notes: ${JSON.stringify(a.notes || '')}, skills: ${JSON.stringify(a.skills || '')}, programs: ${JSON.stringify(a.programs || '')}, qualities: ${JSON.stringify(a.qualities || '')}, offsets: ${a.attrMod ? JSON.stringify(['charisma', 'intuition', 'logic', 'willpower', 'edge'].map(k => a.attrMod[k] || 0)) : 'null'}, initBonus: ${a.initBonus || 0}}`
  ).join(',\n'),
  '}',
  ''
].join('\n'))
fs.writeFileSync(path.join(root, 'src', 'pug', '_ai-types.pug'),
  '//- FICHIER GENERE par tools/generate-spirits.js : ne pas modifier a la main.\n' +
  '- const aiTypes = [' + Object.entries(ais).map(([n, a]) => `['${aiKey(n)}', '${a.group} - ${n.replace(/'/g, "\\'")}']`).join(', ') + '];\n')
console.log(`${Object.keys(ais).length} types d'IA generes`)

// ---- MATRICE AVANCEE (onglet Matrice PC + pouvoirs de sprites) : echoes, paragons, widgets, pouvoirs de sprites, Resonance Difference
// data/*.json -> src/js/matrix-advanced-types.js, src/pug/_matrix-advanced-types.pug
const readData = f => JSON.parse(fs.readFileSync(path.join(root, 'data', f), 'utf8'))
const echoData = readData('echoes.json'), paragonData = readData('paragons.json'), widgetData = readData('widgets.json'), powerData = readData('sprite_powers.json'), techRules = readData('technomancer_rules.json')
const spritePowerSlug = n => slug(n)
const echoJs = Object.entries(echoData).map(([n, x]) => `  "${slug(n)}": {name: ${JSON.stringify(n)}, effect: ${JSON.stringify(x.effect)}, source: ${JSON.stringify(x.source || '')}, max: ${x.maxTimes || 1}, mods: ${JSON.stringify(x.mods || {})}}`).join(',\n')
const paragonJs = Object.entries(paragonData).map(([n, x]) => `  "${slug(n)}": {name: ${JSON.stringify(n)}, advantage: ${JSON.stringify(x.advantage)}, disadvantage: ${JSON.stringify(x.disadvantage)}, sprites: ${JSON.stringify((x.spriteBonus || []).join(', '))}, source: ${JSON.stringify(x.source || '')}}`).join(',\n')
const widgetEntries = Object.entries(widgetData).filter(([n]) => !n.startsWith('_'))
const widgetJs = widgetEntries.map(([n, x]) => `  "${slug(n)}": {name: ${JSON.stringify(n)}, effect: ${JSON.stringify(x.effect)}, source: ${JSON.stringify(x.source || '')}}`).join(',\n')
const powerJs = Object.entries(powerData).map(([n, x]) => `  "${spritePowerSlug(n)}": {name: ${JSON.stringify(n)}, effect: ${JSON.stringify(x.effect)}, source: ${JSON.stringify(x.source || '')}}`).join(',\n')
const rd = (techRules.resonance_difference || {})
const rdText = Object.entries(rd.effects || {}).map(([k, v]) => `${k}: ${v}`).join('\n')
fs.writeFileSync(path.join(root, 'src', 'js', 'matrix-advanced-types.js'), [
  '// FICHIER GENERE par tools/generate-spirits.js depuis data/echoes.json, paragons.json, widgets.json, sprite_powers.json, technomancer_rules.json : ne pas modifier a la main.',
  '// ECHOES : mods = bonus par prise (response, signal, system, firewall, biofeedback, passes), max = nombre de prises.',
  'const ECHOES = {', echoJs, '}',
  'const PARAGONS = {', paragonJs, '}',
  'const WIDGETS = {', widgetJs, '}',
  `const WIDGET_RULES = ${JSON.stringify((widgetData._rules || {}).effect || '')}`,
  'const SPRITE_POWERS = {', powerJs, '}',
  `const RESONANCE_DIFFERENCE = ${JSON.stringify(rdText)}`,
  ''
].join('\n'))
const opt = (obj, skip) => '[' + Object.keys(obj).filter(n => !(skip && n.startsWith('_'))).map(n => `['${slug(n)}', '${n.replace(/'/g, "\\'")}']`).join(', ') + ']'
fs.writeFileSync(path.join(root, 'src', 'pug', '_matrix-advanced-types.pug'),
  '//- FICHIER GENERE par tools/generate-spirits.js : ne pas modifier a la main.\n' +
  `- const echoTypes = ${opt(echoData)};\n- const paragonTypes = ${opt(paragonData)};\n- const widgetTypes = ${opt(widgetData, true)};\n- const spritePowerTypes = ${opt(powerData)};\n`)
console.log(`matrice avancee : ${Object.keys(echoData).length} echos, ${Object.keys(paragonData).length} paragons, ${widgetEntries.length} widgets, ${Object.keys(powerData).length} pouvoirs de sprites`)

// ---- CATALOGUES DE MAGIE (onglet Magie PC) : pouvoirs d'adepte, sorts, metamagies
// data/adept_powers.json, spells.json, metamagics.json -> src/js/magic-catalog-types.js, src/pug/_magic-catalog-types.pug
const adeptPowers = readData('adept_powers.json').powers
const spellList = readData('spells.json').spells
const metamagicList = readData('metamagics.json').metamagics
const byId = (list, fn) => '{\n' + list.map(x => `  ${JSON.stringify(x.id)}: ${JSON.stringify(fn(x))}`).join(',\n') + '\n}'
// Valeurs des menus existants de la section sorts (src/pug/_variables.pug : spellTypes, spellRanges...)
const SPELL_TYPE = {P: 'Physical', M: 'Mana'}
const SPELL_RANGE = {'LOS': 'LOS', 'LOS (A)': 'LOS (A)', 'LOS(A)': 'LOS (A)', 'T': 'T', 'Touch': 'T', 'T (A)': 'T (A)'}
const SPELL_DURATION = {I: 'Instant', S: 'Sustained', P: 'Permanent'}
const spellCombat = s => s.category !== 'combat' ? 'Force ' : /^direct/i.test(s.kind) ? 'Direct, Force ' : /^indirect/i.test(s.kind) ? 'Indirect, Force ?{Force|}, AP -' : 'Force '
const cap = s => s.charAt(0).toUpperCase() + s.slice(1)
const bonusText = b => b.map(x => `${x.value > 0 ? '+' : ''}${x.value} ${x.target.replace(/_/g, ' ')}${x.perLevel ? '/level' : ''}`).join(', ')
fs.writeFileSync(path.join(root, 'src', 'js', 'magic-catalog-types.js'), [
  '// FICHIER GENERE par tools/generate-spirits.js depuis data/adept_powers.json, spells.json, metamagics.json : ne pas modifier a la main.',
  '// ADEPT_POWERS : cost = PP (par niveau si perLevel), costTable = cout total par niveau (Improved Reflexes...), max = niveau max.',
  'const ADEPT_POWERS = ' + byId(adeptPowers, p => ({
    name: p.name, cost: p.cost == null ? '' : p.cost, perLevel: !!p.perLevel, costTable: (p.costByLevel || []).join(','),
    max: p.maxLevel == null ? '' : String(p.maxLevel), mode: p.mode, test: p.test || '',
    notes: [p.note, p.bonus.length ? `Bonus: ${bonusText(p.bonus)}` : '', p.action ? `Action: ${p.action}` : '', p.maxLevel != null ? `Max level: ${p.maxLevel}` : '', p.source].filter(Boolean).join('\n')
  })),
  '// SPELLS : valeurs deja converties pour les menus de la section sorts ; drain = modificateur de DV (DV = Force/2 + drain).',
  'const SPELLS = ' + byId(spellList, s => ({
    name: s.name, type: SPELL_TYPE[s.type] || '', range: SPELL_RANGE[s.range] || 'Special', duration: SPELL_DURATION[s.duration.charAt(0)] || 'Special',
    drain: typeof s.dvMod === 'number' ? s.dvMod : '', category: cap(s.category), combat_type: spellCombat(s), damage: s.damage || '',
    notes: [s.kind, `DV ${s.dv}`, s.notes, s.source].filter(Boolean).join('\n')
  })),
  '// METAMAGICS : adept = utilisable par un adepte (adeptAllowed).',
  'const METAMAGICS = ' + byId(metamagicList, m => ({
    name: m.name, adept: !!m.adeptAllowed, effect: m.effect, source: [m.prerequisite ? `Prerequisite: ${m.prerequisite}` : '', m.source].filter(Boolean).join(' | ')
  })),
  ''
].join('\n'))
const group = (list, keyFn, labelFn) => {
  const g = {}
  list.forEach(x => (g[keyFn(x)] = g[keyFn(x)] || []).push([x.id, labelFn(x)]))
  return Object.entries(g).map(([k, v]) => [k, v.sort((a, b) => a[1].localeCompare(b[1]))])
}
const book = src => (src || '').split(' ')[0]
fs.writeFileSync(path.join(root, 'src', 'pug', '_magic-catalog-types.pug'),
  '//- FICHIER GENERE par tools/generate-spirits.js : ne pas modifier a la main.\n' +
  `- const adeptPowerCatalog = ${JSON.stringify(group(adeptPowers, p => p.mode, p => `${p.name} (${book(p.source)})`))};\n` +
  `- const spellCatalog = ${JSON.stringify(group(spellList, s => cap(s.category), s => `${s.name} (${book(s.source)})`))};\n` +
  `- const metamagicCatalog = ${JSON.stringify(group(metamagicList, m => m.adeptOnly ? 'Adept' : m.tier, m => `${m.name}${m.adeptAllowed && !m.adeptOnly ? ' *' : ''}`))};\n`)
console.log(`catalogues magie : ${adeptPowers.length} pouvoirs d'adepte, ${spellList.length} sorts, ${metamagicList.length} metamagies`)
