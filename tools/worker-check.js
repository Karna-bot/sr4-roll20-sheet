// Controle des sheet workers sans Roll20 : charge les fichiers de src/js dans un bac a sable avec getAttrs/setAttrs simules (node tools/worker-check.js).
const fs=require('fs');
const files=['attributes','Classes/PrimaryWeapon','Classes/PrimaryArmor','processingFunctions','spirit-types','sprite-types','technocritter-types','ai-types','tradition-types','stream-types','scripts','versioning','eventhandlers'];
let src=files.map(f=>fs.readFileSync(__dirname+'/../src/js/'+f+'.js','utf8')).join('\n');
const handlers=[];
const sandbox={on:(e,f)=>handlers.push([e,f]),getAttrs:()=>{},setAttrs:()=>{},console,getTranslationByKey:()=>'',getTranslationLanguage:()=>'en',setTimeout,generateRowID:()=>'x'};
const vm=require('vm');
vm.createContext(sandbox);
vm.runInContext(src,sandbox);
console.log('ok handlers',handlers.length);
// functional test of workers
let attrs={}, set={};
sandbox.getAttrs=(arr,cb)=>{const o={};arr.forEach(k=>o[k]=attrs[k]);cb(o)};
sandbox.setAttrs=(u)=>{Object.assign(set,u);Object.assign(attrs,u)};
vm.runInContext('globalThis.__t={updateAIAttributes,applyAIType,applyTechnocritterType,syncTechnocritterResonance,updateMatrixInitiative,updateEmergedMatrixMax,applySpriteType,updateSpriteAttributes}',sandbox);
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
