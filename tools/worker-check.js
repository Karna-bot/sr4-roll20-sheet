// Controle des sheet workers sans Roll20 : charge les fichiers de src/js dans un bac a sable avec getAttrs/setAttrs simules (node tools/worker-check.js).
const fs=require('fs');
const files=['attributes','Classes/PrimaryWeapon','Classes/PrimaryArmor','processingFunctions','spirit-types','sprite-types','technocritter-types','ai-types','tradition-types','stream-types','matrix-advanced-types','magic-catalog-types','scripts','versioning','eventhandlers'];
let src=files.map(f=>fs.readFileSync(__dirname+'/../src/js/'+f+'.js','utf8')).join('\n');
const handlers=[];
const sandbox={on:(e,f)=>handlers.push([e,f]),getAttrs:()=>{},setAttrs:()=>{},console,getTranslationByKey:()=>'',getTranslationLanguage:()=>'en',setTimeout,generateRowID:(()=>{let i=0;return()=>'r'+(i++)})(),getSectionIDs:(n,cb)=>cb((global.__rows||{})[n]||[]),removeRepeatingRow:r=>{global.__removed=(global.__removed||[]).concat(r)}};
const vm=require('vm');
vm.createContext(sandbox);
vm.runInContext(src,sandbox);
console.log('ok handlers',handlers.length);
// functional test of workers
let attrs={}, set={};
sandbox.getAttrs=(arr,cb)=>{const o={};arr.forEach(k=>o[k]=attrs[k]);cb(o)};
sandbox.setAttrs=(u)=>{Object.assign(set,u);Object.assign(attrs,u)};
vm.runInContext('globalThis.__t={updateLivingPersona,applyEcho,applyParagon,applyWidget,updateWidgetRating,updateResonanceDifference,applySpritePower,fillSpritePowers,updateAIAttributes,applyAIType,applyTechnocritterType,syncTechnocritterResonance,updateMatrixInitiative,updateEmergedMatrixMax,applyAIType,applySpriteType,updateSpriteAttributes}',sandbox);
const t=sandbox.__t;
attrs={sheet_type:'ai',charisma:3,intuition:5,logic:6,willpower:4};t.updateAIAttributes();console.log('AI',set);
attrs.mx_response=4;attrs.intuition=5;t.updateMatrixInitiative();console.log('AI init',set.matrix_mod,set.matrix_dice);
set={};attrs={sheet_type:'grunt',flag_special:'mundane'};t.applyTechnocritterType('flipper');console.log('flipper',JSON.stringify(set).slice(0,260));
attrs.sheet_type='grunt';attrs.technocritter_type='flipper';attrs.matrix_mod_modifier=0;t.updateMatrixInitiative();console.log('flipper init',set.matrix_mod,set.matrix_dice);
attrs.resonance=5;set={};t.syncTechnocritterResonance();console.log('sync',set.mx_system,set.matrix_max);
set={};attrs={sheet_type:'sprite',level:4,sprite_init_mult:3,mx_response_offset:1,mx_firewall_offset:1,charisma_offset:0};t.updateSpriteAttributes();console.log('sprite',set);
set={};attrs={sheet_type:'sprite'};t.applySpriteType('code');console.log('code',set.mx_response_offset,set.mx_firewall_offset);
set={};attrs={sheet_type:'ai'};t.applyAIType('predator');console.log(set.quality,'|',set.matrix_info.slice(0,60));
set={};attrs={sheet_type:'pc',intuition:3};t.updateMatrixInitiative();console.log('pc untouched',JSON.stringify(set));
// AI reference rating R : attributs = R + decalages du type (Unwired p.166-168)
set={};attrs={sheet_type:'ai',ai_r:4};t.applyAIType('predator');console.log('predator R4',set.charisma_base,set.intuition_base,set.logic_base,set.willpower_base,set.edge,set.matrix_mod_modifier);

// ---- Matrice avancee
global.__rows={echoes:['e1','e2','e3']};
set={};attrs={sheet_type:'pc',willpower:5,intuition:4,logic:5,charisma:3,resonance:6,submersion:0,
 repeating_echoes_e1_echo_type:'firewall_upgrade',repeating_echoes_e1_echo_times:2,
 repeating_echoes_e2_echo_type:'overclocking',repeating_echoes_e2_echo_times:1,
 repeating_echoes_e3_echo_type:'amplification',repeating_echoes_e3_echo_times:3};
t.updateLivingPersona();console.log('persona',JSON.stringify(set));
set={};attrs={'repeating_echoes_e1_echo_type':'system_upgrade'};t.applyEcho('repeating_echoes_e1_echo_type');console.log('echo',set.repeating_echoes_e1_echo_name,set.repeating_echoes_e1_echo_max);
set={};t.applyParagon('alias');console.log('paragon',set.paragon_advantage,'|',set.paragon_sprites);
set={};attrs={repeating_widgets_w1_widget_rating:3};t.updateWidgetRating('repeating_widgets_w1_widget_rating');console.log('widget',JSON.stringify(set));
set={};attrs={repeating_widgets_w1_widget_type:'amp'};t.applyWidget('repeating_widgets_w1_widget_type');console.log('widget type',set.repeating_widgets_w1_widget_name);
set={};attrs={resonance_difference:'1'};t.updateResonanceDifference();console.log('resdiff',set.resdiff_defense,set.resdiff_info.split('\n').length);
global.__rows={spritepowers:['p1']};global.__removed=[];set={};attrs={sheet_type:'sprite'};t.applySpriteType('courier');
setTimeout(()=>console.log('sprite powers',Object.keys(set).filter(k=>k.endsWith('sp_name')).map(k=>set[k]),global.__removed),0);

setTimeout(()=>{ // apres les tests asynchrones ci-dessus
// ---- Magie : assertions (un echec fait sortir avec le code 1, donc echouer npm test et la CI)
vm.runInContext('globalThis.__m={updateFoci,updatePowerPoints,updateBackgroundCount,applyAdeptPower,applySpell,applyMetamagic,updateInitiation}',sandbox);
const m=sandbox.__m;
let failures=0;
const check=(label,actual,expected)=>{if(JSON.stringify(actual)!==JSON.stringify(expected)){failures++;console.error(`ECHEC ${label}: obtenu ${JSON.stringify(actual)}, attendu ${JSON.stringify(expected)}`)}};
// focus : Karma = Force x multiplicateur ; avertissements liés > Magie, actifs > Logique
global.__rows={foci:['f1','f2']};set={};attrs={magic:1,logic:1,background_count:0,
 repeating_foci_f1_focus_type:'Power',repeating_foci_f1_force:2,repeating_foci_f1_bonded:1,repeating_foci_f1_active:1,
 repeating_foci_f2_focus_type:'Sustaining',repeating_foci_f2_force:3,repeating_foci_f2_bonded:1,repeating_foci_f2_active:1};
m.updateFoci();
check('focus karma',[set.repeating_foci_f1_karma_cost,set.repeating_foci_f2_karma_cost,set.foci_karma_total],[16,6,22]);
check('focus avertissement',set.foci_warning.includes('bonded foci > Magic')&&set.foci_warning.includes('active foci > Logic'),true);
// pouvoirs d'adepte : catalogue + points de pouvoir (Improved Reflexes 2 = 2.5 PP, Killing Hands fixe, favori -25 %)
global.__rows={powers:['p1','p2']};set={};attrs={magic:5,repeating_powers_p1_power_type:'improved_reflexes',repeating_powers_p2_power_type:'killing_hands'};
m.applyAdeptPower('repeating_powers_p1_power_type');m.applyAdeptPower('repeating_powers_p2_power_type');
check('IR catalogue',[attrs.repeating_powers_p1_name,attrs.repeating_powers_p1_pp_cost_table,attrs.repeating_powers_p1_pp_flat,attrs.repeating_powers_p1_rating],['Improved Reflexes','1.5,2.5,4',0,1]);
attrs.repeating_powers_p1_rating=2;attrs.repeating_powers_p2_pp_favored=1;set={};m.updatePowerPoints();
const kh=sandbox.ADEPT_POWERS||vm.runInContext('ADEPT_POWERS',sandbox);
check('PP utilises',set.pp_used,Math.round((2.5+Math.round(kh.killing_hands.cost*0.75*100)/100)*100)/100);
check('PP restants',set.pp_left,Math.round((5-set.pp_used)*100)/100);
attrs.background_count=-2;set={};m.updatePowerPoints();
check('PP avec background count',set.pp_left,Math.round((3-set.pp_used)*100)/100);
// sorts : valeurs compatibles avec les menus de la section
set={};attrs={repeating_spell_s1_spell_catalog:'acid_stream'};m.applySpell('repeating_spell_s1_spell_catalog');
check('sort',[set.repeating_spell_s1_name,set.repeating_spell_s1_type,set.repeating_spell_s1_range,set.repeating_spell_s1_duration,set.repeating_spell_s1_drain,set.repeating_spell_s1_category,set.repeating_spell_s1_combat_type],
 ['Acid Stream','Physical','LOS','Instant',3,'Combat','Indirect, Force ?{Force|}, AP -']);
const S=vm.runInContext('SPELLS',sandbox), allowed={type:['Mana','Physical'],range:['LOS','LOS (A)','Special','T','T (A)'],duration:['Instant','Permanent','Special','Sustained'],category:['Combat','Detection','Health','Illusion','Manipulation']};
Object.entries(S).forEach(([id,s])=>Object.entries(allowed).forEach(([f,vals])=>{if(!vals.includes(s[f]))check(`sort ${id}.${f}`,s[f],vals)}));
// metamagie + initiation : 10 + 3 x grade suivant, reductions, Magie max, avertissements
set={};attrs={repeating_metamagics_x_metamagic_type:'masking'};m.applyMetamagic('repeating_metamagics_x_metamagic_type');
check('metamagie',set.repeating_metamagics_x_metamagic_name,'Masking');
global.__rows={metamagics:['a','b']};set={};attrs={initiate:1,initiation_discount:'0.2',initiation_pp:0,magic:5};m.updateInitiation();
check('initiation',[set.initiation_next_cost,set.magic_max,set.metamagic_warning],[13,7,'metamagics + PP > grade']);
global.__rows={metamagics:[]};set={};attrs={initiate:0,initiation_discount:'0',magic:3};m.updateInitiation();
check('initiation grade 1',[set.initiation_next_cost,set.metamagic_warning],[13,'']);
console.log(failures?`magie : ${failures} echec(s)`:'magie : OK');
if(failures)process.exitCode=1;
},5);
