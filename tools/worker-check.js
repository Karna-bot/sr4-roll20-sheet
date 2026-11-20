// Controle des sheet workers sans Roll20 : charge les fichiers de src/js dans un bac a sable avec getAttrs/setAttrs simules (node tools/worker-check.js).
const fs=require('fs');
const files=['attributes','Classes/PrimaryWeapon','Classes/PrimaryArmor','processingFunctions','spirit-types','sprite-types','technocritter-types','ai-types','tradition-types','stream-types','matrix-advanced-types','scripts','versioning','eventhandlers'];
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
