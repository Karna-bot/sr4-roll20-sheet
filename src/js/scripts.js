  //Edge toggle to include ! for exploding dice
const edgeToggle = newValue => {
  processingFunctions.setAttributes({
    explode_toggle: processingFunctions.shadowrun.determineExplodingEdge(newValue)
  })
}

const updateHostAttributes = newValue => {
  newValue = processingFunctions.parseInteger(newValue)
  processingFunctions.setAttributes({
    matrix_max: 8 + Math.ceil(newValue/2),
    ic_attack: Math.min(newValue + newValue)
  })
}

const updateSpriteConditionTrack = newValue => {
  newValue = processingFunctions.parseInteger(newValue)
  processingFunctions.setAttributes({
    matrix_max: 8 + Math.ceil(newValue/2)
  })
}

//ALSO COVER COMPLEX FORMS
const updateSpellsDicepool = eventinfo => {
  const repRowID = processingFunctions.getReprowid(eventinfo.triggerName)
  getAttrs([`${repRowID}_specialization`, `${repRowID}_dicepool_modifier`], attrs => {
    attrs = processingFunctions.parseIntegers(attrs)
    processingFunctions.setAttributes({
      [`${repRowID}_dicepool`]: processingFunctions.sumIntegers(Object.values(attrs))
    })
  })
}

const resetNpcCondition = () => setAttributes({physical: 0, stun: 0, matrix: 0})

const updatePrimary = eventinfo => {
  const repRowID = processingFunctions.getReprowid(eventinfo.triggerName)
  getAttrs([`${repRowID}_primary`], attrs => {
    if (attrs[`${repRowID}_primary`] === 'primary') {
      let update = {}

      if (repRowID.includes('armor')) {
        update = processingFunctions.shadowrun.updatePrimaryArmor({[eventinfo.triggerName]: eventinfo.newValue})
      } else {
        update = processingFunctions.shadowrun.updatePrimaryWeapons({[eventinfo.triggerName]: eventinfo.newValue})
      }

      processingFunctions.setAttributes(update)
    }
  })
}

const updateRepeatingPrimary = (eventinfo, type) => {
  const repRowID = processingFunctions.getReprowid(eventinfo.triggerName)
  if (eventinfo.newValue === undefined) {
    return false
  } else if (eventinfo.newValue === 'primary') {
    const constructedAttributes = type === 'armor' ? processingFunctions.shadowrun.addRepRow(repRowID, sheetAttributes.armorAttributes) : processingFunctions.shadowrun.contructRepeatingWeaponAttributes(repRowID, type);

    //get the attributes to update primary
    getAttrs(constructedAttributes, attrs => {
      const update = type === 'armor' ? processingFunctions.shadowrun.updatePrimaryArmor(attrs) : processingFunctions.shadowrun.updatePrimaryWeapons(attrs);
      processingFunctions.setAttributes(update)
    })

    //Reset all the other primaries
    processingFunctions.shadowrun.resetRepeatingFieldsPrimaries(`repeating_${type}`, repRowID)
  } else {
    const update = type === 'armor' ? processingFunctions.shadowrun.resetPrimaryArmor() : processingFunctions.shadowrun.resetPrimaryWeapon(type);
    processingFunctions.setAttributes(update)
  }
}

const updateRepeatingWeaponDicepool = trigger => {
  const repRowID = processingFunctions.getReprowid(trigger)
  getAttrs([`${repRowID}_dicepool_modifier`, `${repRowID}_specialization`], attrs => {   
    attrs = processingFunctions.parseIntegers(attrs)
    processingFunctions.setAttributes({
      [`${repRowID}_dicepool`]: processingFunctions.sumIntegers(Object.values(attrs))
    })
  })
}

const updateRepeatingSkillDicepool = eventinfo => {
   const repRowID = processingFunctions.getReprowid(eventinfo.triggerName)
    getAttrs([`${repRowID}_skill`], attrs => {
      let skill = processingFunctions.shadowrun.convertSkillSelectToHiddenSkill(attrs[`${repRowID}_skill`])
      processingFunctions.setAttributes({
        [`${skill}`]: eventinfo.newValue
      })
    })
}

const updateRepeatingSkillName = eventinfo => {
  const repRowID = processingFunctions.getReprowid(eventinfo.triggerName)
  const translationKey = eventinfo.newValue.replace(/ /g, '').toLowerCase()
  const translation = getTranslationByKey(translationKey);
  processingFunctions.setAttributes({
    [`${repRowID}_display_skill`]: translation
  })
}

const updateRepeatingSkillAttribute = eventinfo => {
  const repRowID = processingFunctions.getReprowid(eventinfo.triggerName)
  const translationKey = processingFunctions.sliceAttr(eventinfo.newValue)
  const translation = getTranslationByKey(translationKey);
  processingFunctions.setAttributes({
    [`${repRowID}_display_attribute`]: translation
  })
}

const updateRepeatingSkillRating = trigger => {
  const repRowID = processingFunctions.getReprowid(trigger)
  getAttrs([`${repRowID}_rating`, `${repRowID}_rating_modifier`], attrs => {   
    attrs = processingFunctions.shadowrun.attributeFactory(attrs)
    processingFunctions.setAttributes({
      [`${repRowID}_dicepool`]: attrs.total,
      [`${repRowID}_display_rating`]: processingFunctions.shadowrun.buildDisplay(attrs.base, attrs.bonus)
    })
  })
}

const updateWounds = () => {
  getAttrs(sheetAttributes.woundCalculation, attrs => {
    attrs = processingFunctions.parseIntegers(attrs)
    const sum = processingFunctions.shadowrun.calculateWounds(attrs)
    processingFunctions.setAttributes({wounds: sum})
  })
}

const updateConditionTracks= conditionTrack => {
  getAttrs(sheetAttributes[conditionTrack], attrs => {
    attrs = processingFunctions.shadowrun.conditionFactory(attrs)
    const conditionTotal = processingFunctions.shadowrun.calculateConditionTracks(attrs)
    processingFunctions.setAttributes({[`${conditionTrack}_max`]: conditionTotal}, true)
  })
}

const translations = () => {
  const attributes = sheetAttributes.translationsAttributes
  const translations = processingFunctions.getTranslations(attributes)
  let attribute_roll = `?{${translations.attribute}`
  delete translations.attribute
  for (let [key, value] of Object.entries(translations)) {
      attribute_roll += key !== 'none' ? `|${value},@{${key}}` : `|${value},0}`
  }
  processingFunctions.setAttributes({attribute_roll: attribute_roll})
} 

const updateShotsFired = trigger => {
  getAttrs([`shots_fired`], attrs => {   
    attrs = processingFunctions.parseIntegers(attrs)
    const shots = processingFunctions.shadowrun.shotsFired(attrs.shots_fired, trigger)
    processingFunctions.setAttributes({shots_fired: shots})
  });
}

const updateAmmoWithShotsFired = () => {
  getAttrs([`primary_range_weapon_ammo`, `shots_fired`], attrs => {
    attrs = processingFunctions.parseIntegers(attrs)
    attrs.shots_fired = processingFunctions.convertIntegerNegative(attrs.shots_fired)
    processingFunctions.setAttributes({primary_range_weapon_ammo: processingFunctions.sumIntegers(Object.values(attrs))})
  });
}

const updateAmmoWithMax = () => {
  getAttrs([`primary_range_weapon_ammo_max`], attrs => {
    attrs = processingFunctions.parseIntegers(attrs)
    processingFunctions.setAttributes({primary_range_weapon_ammo: attrs.primary_range_weapon_ammo_max})
  });
}

const updateTab = attr => processingFunctions.setAttributes({tab: attr})

const updateAttributes = (array, attribute) => {
  getAttrs(array, attrs => {
    attrs = processingFunctions.shadowrun.attributeFactory(attrs)
    processingFunctions.setAttributes({
      [attribute]: attrs.total,
      [`display_${attribute}`]: attrs.base === attrs.total ? attrs.base : `${attrs.base} (${attrs.total})`
    })
  })
}

const updateMovement = () => {
  getAttrs(['agility', 'walk_modifier', 'run_modifier'], attrs => {
    attrs = processingFunctions.parseIntegers(attrs)
    processingFunctions.setAttributes({
      walk: processingFunctions.shadowrun.calculateWalkSpeed(attrs.agility, attrs.walk_modifier),
      run: processingFunctions.shadowrun.calculateRunSpeed(attrs.agility, attrs.run_modifier)
    })
  })
}

const updateDerivedAttribute = derivedAttribute => {
  getAttrs(sheetAttributes[derivedAttribute], attrs => {
    attrs = processingFunctions.shadowrun.attributeFactory(attrs)
    processingFunctions.setAttributes({[derivedAttribute]: attrs.total})
  })
}

const updateInitiativeDice = () => {
  getAttrs(['reaction', 'intuition', "initiative_dice_modifier", "edge_toggle", "initiative_dice_temp", "initiative_dice_temp_flag"], values => {
    const edgeFlag = values.edge_toggle === "@{edge}" ? true : false;
    const temp = parseInt(values.initiative_dice_temp) || 0;
    const bonus = parseInt(values.initiative_dice_modifier) || 0;
    processingFunctions.setAttributes({
      initiative_dice: edgeFlag ? 5 : Math.min(bonus+temp+1,5)
    })
  })
}

//Calculate Astral Initiatve
const updateAstralInitiative = () => {
  getAttrs(["intuition", "astral_initiative_modifier"], v => {
    v = processingFunctions.parseIntegers(v);
    const base = v.intuition * 2, bonus = v.astral_initiative_modifier, total = base + bonus;

    setAttrs({
      ["astral_initiative"]: total,
      ["display_astral_initiative"]: bonus === 0 ? base : `${base} (${total})`
    });
  });
};

const updateAstralInitiativeDice = () => {
  getAttrs(["astral_dice_modifier", "edge_toggle"], v => {
    const edgeFlag = v.edge_toggle === "@{edge}" ? true : false;
    const bonus = parseInt(v.astral_dice_modifier) || 0;

    setAttrs({
      astral_dice: edgeFlag ? 5 : Math.min(bonus+3,5)
    })
  })
}

const resetConditionTrack = eventinfo => {
  const attr = eventinfo.triggerName.split("_").pop()
  processingFunctions.setAttributes({
    [`${attr}`] : 0
  })
}

//Calculate Matrix Initiatve.
const updateMatrixInitiative = () => {
  getAttrs(["sheet_type", "data_processing", "veh_response", "pilot", "intuition", "matrix_mod_modifier", "host_rating", "level", "matrix_dice_modifier", "edge_toggle", "sprite_init_mult"], v => {
    const sheetType = v.sheet_type;
    const edgeFlag = v.edge_toggle === "@{edge}" ? true : false;

    v = processingFunctions.parseIntegers(v);

    //- vehicle / drone node: Pilot + Response (deck statistics)
    let base = sheetType === "vehicle" ? v.veh_response : v.data_processing;
    base += sheetType === "sprite" ? v.level : sheetType === "vehicle" ? v.pilot : sheetType === "host" ? v.host_rating : v.intuition;

    //- sprite: Matrix initiative = Level x multiplier of its type (Chummer), no Data Processing
    if (sheetType === "sprite" && v.sprite_init_mult > 0) base = v.level * v.sprite_init_mult;

    const total = base + v.matrix_mod_modifier;

    setAttrs({
      ["matrix_mod"]: total,
      ["matrix_dice"]: sheetType === "grunt" && edgeFlag ? 5 : sheetType === "grunt" && !edgeFlag ? 4 + v.matrix_dice_modifier : 4,
      ["display_matrix_mod"]: v.matrix_mod_modifier === 0 ? base : `${base} (${total})`
    })
  })
}

//Setting the Default attribute name for default skill
const updateDefaultAttribute = newValue => {
  getAttrs(["default_display"], value => {
    const display   = value.default_display
    let update      = {};

    //This sets a hidden input with the Attribute name so the roll template can use it to indicate what attribute was rolled
    const attribute   = processingFunctions.sliceAttr(newValue)
    const translation = getTranslationByKey(`${attribute}`)
    if (translation != display) {
      processingFunctions.setAttributes({default_display: translation})
    }
  })
}


/* OLD SCRIPTS */

//Weapon displays set into an Array
// Builder function to display details properly
// Note that since undefined are falsey if there's no label or sign we can leave the parameters blank
function repeatingStringBuilder(v, keyBase) {
    return function(key, label, sign) {
        // fetch the attr from v checking if it has a value
        const val = v[`${keyBase}${key}`];
        if (!val) return '';

        // Apply the sign if needed
        const disp = sign && val > 0 ? `+${val}` : val;

        // Apply label if needed
        return label ? `${label} ${disp}` : disp;
    }
}

on("change:repeating_weapon", () => {
  const source = "repeating_weapon_weapon";
    getAttrs([`${source}_range`, `${source}_type`, `${source}_reach`, `${source}_dv`, `${source}_ap`, `${source}_mode`, `${source}_rc`, `${source}_ammo`, `${source}_note`, `${source}_primary`], (v) => {
        // Local builder putting the needed variables into scope for repeatingStringBuilder
        const b = repeatingStringBuilder(v, `${source}_`);
        // Determine fields to display and in their proper order and formatting
        // Anonymous function is purely stylistic and adds more overhead than just a simple switch/case.  Personally I find the function looks cleaner and hides any internal scope that might conflict with outside
        const display = (() => {
            // 0 for weapon_range is a ranged weapon. A 1 is a melee weapon.
            switch(v.repeating_weapon_weapon_range) {
                case '0':
                // Not a fan of how ammo has to be handled.  Could potentially be placed in the repeatingStringBuilder if used more often for other change:repeating functions as some sort of suffix parameter
                const ammo = b('amm');
                return [
                    b('type'),
                    b('dv', 'DV'),
                    b('ap', 'AP', true),
                    b('mode'),
                    b('rc', 'RC'),
                    ammo ? `${ammo} (c)` : '',
                    b('note')
                ];
                case '1': return [
                    b('type'),
                    b('reach', 'Reach', true),
                    b('dv', 'DV'),
                    b('ap', 'AP', true),
                    b('note')
                ];
                default: return [
                    b('type'),
                    b('dv', 'DV'),
                    b('ap', 'AP', true),
                    b('note')
                ];
            }
        })()
            // Remove all empty strings
            .filter(s => s)
            // Concat all the strings and add comma between
            .join(', ');

        let update = {};
        update[`${source}`] = `[${display}]`;

        // Finally wrap square brackets around the weapon display
        setAttrs(update);
    });
});


//Spell displays set into an Array
  on("change:repeating_NPCspell", () => {
      getAttrs(["repeating_NPCspell_combat_type", "repeating_NPCspell_type", "repeating_NPCspell_range", "repeating_NPCspell_damage", "repeating_NPCspell_duration", "repeating_NPCspell_drain", "repeating_NPCspell_note"], (v) =>{
          const com = v.repeating_NPCspell_combat_type;
          const typ = `Type ${v.repeating_NPCspell_type}, `;
      const ran = `${v.repeating_NPCspell_range}, `;
      const dam = `Damage ${v.repeating_NPCspell_damage}, `;
      const dur = `Duration ${v.repeating_NPCspell_duration}, `;
      const not = `, ${v.repeating_NPCspell_note}`;
      const dra = v.repeating_NPCspell_drain;

      const drain = (dra > 0) ? `F+${dra} ` : (dra < 0) ? `F${dra} ` :"F ";
      const info = `[${typ}${ran}${dam}${dur}${drain}${not}]`;

      display = (com === "Direct, Force ") ? ` (Direct) ${info}` : 
        (com === "Indirect, Force ?{Force|}, AP -") ? ` (Indirect) ${info}` : `${info}`;
          setAttrs({repeating_NPCspell_spell: display});
      });
  });

//Complex Form displays  set into an Array
  on("change:repeating_form", () => {
      getAttrs(["repeating_form_form_duration", "repeating_form_form_target", "repeating_form_form_fade", "repeating_form_form_note", ], (v) =>{
        const tar = `Target ${v.repeating_form_form_target}, `;
      const dur = `Duration ${v.repeating_form_form_duration}, `;
      const not = `, ${v.repeating_form_form_note}` || '';
      const fad = (v.repeating_form_form_fade > 0) ? `L+${v.repeating_form_form_fade}` : 
            (v.repeating_form_form_fade < 0) ? `L${v.repeating_form_form_fade}` : "L";

          setAttrs({
            repeating_form_form: ` [${tar}${dur}${fad}${not}]`
          });
      });
  });

//IC displays are set into an Array
  on("change:repeating_IC", () => {
      getAttrs(["attack", "data_processing", "repeating_IC_IC_limit", "repeating_IC_IC_attribute", "repeating_IC_IC_matrix", "repeating_IC_IC_note"], (v) =>{
        const att = parseInt(v.attack) || 0;
        const data = parseInt(v.data_processing) || 0;
        const attr = v.repeating_IC_IC_attribute;
        const mat = v.repeating_IC_IC_matrix;
        const not = v.repeating_IC_IC_note;

          setAttrs({
            repeating_IC_IC: (v.repeating_IC_IC_limit === "@{data_processing}") ? ` ([${data}] vs. ${attr} + ${mat}, ${not})` : `([${att}] vs. ${attr} + ${mat}, ${not})`
          });
      });
  });

   ['acceleration', 'armor', 'body', 'data_processing', 'handling', 'pilot', 'sensor','speed'].forEach(attr => {
        // Attach listener
        on(`change:repeating_vehicle:${attr}_base change:repeating_vehicle:${attr}_modifier change:repeating_vehicle:${attr}_temp`, () => {
            // Load attribute values
            getAttrs([`repeating_vehicle_${attr}_base`, `repeating_vehicle_${attr}_modifier`, `repeating_vehicle_${attr}_temp`], (v) => {
                // Do some math to calculate the total
                const bas = parseInt(v[`repeating_vehicle_${attr}_base`]) || 0;
                const mod = parseInt(v[`repeating_vehicle_${attr}_modifier`]) || 0;
                const tem = parseInt(v[`repeating_vehicle_${attr}_temp`]) || 0;
                const bon = mod + tem;
                const stat = bas + bon;

                // Update the finalized total
                setAttrs({
                    [attr]: stat,
                    [`repeating_vehicle_display_${attr}`]: bon === 0 ? bas : `${bas} (${stat})`
                }, {silent: true});
            });
        });
    });


// ---------------------------------------------------------------- SPIRIT
// Attribut d'un esprit = Force + décalage propre à l'attribut (champs *_offset). Pas de Magie ni d'Essence sur une fiche d'esprit.
// Règles perso : bonus à la défense (base Réaction) selon l'état de l'esprit,
// +50 % matérialisé, +100 % en astral. Le bonus est arrondi par SPIRIT_ROUND.
const SPIRIT_ATTRIBUTES = ['body', 'agility', 'reaction', 'strength', 'charisma', 'intuition', 'logic', 'willpower']
const SPIRIT_DEFENSE_BONUS = {astral: 1, materialized: 0.5, other: 0}
const SPIRIT_ROUND = Math.ceil
// Passes d'initiative selon l'état : 3 en astral, 2 matérialisé ('other' : valeur laissée telle quelle)
const SPIRIT_PASSES = {astral: 3, materialized: 2}

const updateSpiritAttributes = () => {
  const offsets = SPIRIT_ATTRIBUTES.concat(['edge']).map(attr => `${attr}_offset`)
  getAttrs(['sheet_type', 'force', 'spirit_state'].concat(offsets), v => {
    if (v.sheet_type !== 'spirit') return
    const force = parseInt(v.force) || 0
    const update = {edge: force + (parseInt(v.edge_offset) || 0)}
    SPIRIT_ATTRIBUTES.forEach(attr => update[`${attr}_base`] = force + (parseInt(v[`${attr}_offset`]) || 0))
    if (SPIRIT_PASSES[v.spirit_state]) update.initiative_passes_base = SPIRIT_PASSES[v.spirit_state]
    setAttrs(update)
  })
}

// Sprite : Charisme, Intuition, Logique, Edge = Niveau + decalage propre a l'attribut (champs *_offset).
// Corps, Agilite, Reaction, Force et Volonte n'existent pas pour un sprite (0 dans Chummer).
const SPRITE_ATTRIBUTES = ['charisma', 'intuition', 'logic']

const updateSpriteAttributes = () => {
  const offsets = SPRITE_ATTRIBUTES.concat(['edge']).map(attr => `${attr}_offset`)
  getAttrs(['sheet_type', 'level'].concat(offsets), v => {
    if (v.sheet_type !== 'sprite') return
    const level = parseInt(v.level) || 0
    const update = {edge: level + (parseInt(v.edge_offset) || 0)}
    SPRITE_ATTRIBUTES.forEach(attr => update[`${attr}_base`] = level + (parseInt(v[`${attr}_offset`]) || 0))
    setAttrs(update)
  })
}

const applySpriteType = type => {
  const sprite = SPRITE_TYPES[type]
  if (!sprite) return
  getAttrs(['sheet_type'], v => {
    if (v.sheet_type !== 'sprite') return
    const update = {
      powers: sprite.powers, edge_offset: 0, sprite_init_mult: sprite.initMult,
      sprite_info: `Skills (rating = Level): ${sprite.skills}. Complex forms: ${sprite.forms}. Optional: ${sprite.optionalForms}.`
    }
    SPRITE_ATTRIBUTES.forEach((attr, i) => update[`${attr}_offset`] = sprite.offsets[i])
    setAttrs(update)
  })
}

const updateDefense = () => {
  getAttrs(sheetAttributes.defense.concat(['sheet_type', 'spirit_state']), v => {
    const isSpirit = v.sheet_type === 'spirit'
    const rate = isSpirit ? (SPIRIT_DEFENSE_BONUS[v.spirit_state] || 0) : 0
    delete v.sheet_type
    delete v.spirit_state
    const attrs = processingFunctions.shadowrun.attributeFactory(v)
    setAttrs({defense: attrs.total + SPIRIT_ROUND(attrs.reaction * rate)})
  })
}

const applySpiritType = type => {
  const spirit = SPIRIT_TYPES[type]
  if (!spirit) return
  getAttrs(['sheet_type'], v => {
    if (v.sheet_type !== 'spirit') return
    const update = {powers: spirit.powers, edge_offset: 0}
    SPIRIT_ATTRIBUTES.forEach((attr, i) => update[`${attr}_offset`] = spirit.offsets[i])
    setAttrs(update)
  })
}

// Tradition (onglet Magie) : preremplit les attributs de resistance au drain et la liste des esprits.
// "custom" ne modifie rien : le MJ peut creer sa propre tradition.
const applyTradition = key => {
  const tradition = TRADITIONS[key]
  if (!tradition) return
  const update = {tradition_spirits: tradition.spirits}
  if (tradition.drain) {
    update.drain_attribute_1 = `@{${tradition.drain[0]}}`
    update.drain_attribute_2 = `@{${tradition.drain[1]}}`
  }
  setAttrs(update)
}

// ---------------------------------------------------------------- VEHICLE / DRONE CONTROL
// Dice pools depend on who controls the vehicle: manual, remote control, jumped-in rigger, autonomous (Pilot).
// Jumped-in: Control Rig bonus (+ Hot-sim bonus) added to every pool, threshold -1 (displayed only).
// Manual with AR subscription: +1 die. Initiative: see the table in docs/VEHICULES.md.
const VEHICLE_FIELDS = ['sheet_type', 'veh_mode', 'veh_interface', 'veh_ar', 'veh_response', 'veh_command', 'veh_op_reaction', 'veh_op_agility',
  'veh_op_intuition', 'veh_op_init', 'veh_op_ip', 'veh_sk_piloting', 'veh_sk_gunnery', 'veh_sk_dodge', 'veh_sk_melee', 'veh_sk_perception',
  'veh_sk_infiltration', 'veh_as_maneuver', 'veh_as_targeting', 'veh_as_defense', 'veh_as_clearsight', 'veh_as_covert', 'veh_bonus_rig',
  'veh_bonus_hot', 'pilot', 'sensor', 'body', 'ballistic']

const vehiclePools = v => {
  const n = key => parseInt(v[key]) || 0
  const mode = v.veh_mode || 'manual'
  const hot = v.veh_interface === 'hot'
  const jumped = mode === 'jumped'
  const bonus = jumped ? n('veh_bonus_rig') + (hot ? n('veh_bonus_hot') : 0) : (mode === 'manual' && v.veh_ar === '1' ? 1 : 0)
  const command = n('veh_command'), pilot = n('pilot'), sensor = n('sensor'), response = n('veh_response')
  const reaction = n('veh_op_reaction'), agility = n('veh_op_agility'), intuition = n('veh_op_intuition')
  // main attribute of each mode (before skill)
  const drive = {manual: reaction, remote: command, jumped: response, autonomous: pilot}[mode]
  const skill = key => n(`veh_sk_${key}`)
  const pools = {
    maneuver: mode === 'autonomous' ? pilot + n('veh_as_maneuver') : drive + skill('piloting'),
    gunnery: {manual: agility, remote: command, jumped: sensor, autonomous: pilot}[mode] + (mode === 'autonomous' ? n('veh_as_targeting') : skill('gunnery')),
    defense_ranged: drive,
    defense_melee: drive + (mode === 'autonomous' ? n('veh_as_defense') : skill('melee')),
    full_defense: drive + (mode === 'autonomous' ? n('veh_as_defense') : skill('dodge')),
    perception: mode === 'autonomous' ? sensor + n('veh_as_clearsight')
      : mode === 'manual' ? intuition + skill('perception')
      : mode === 'jumped' ? sensor + Math.min(skill('perception'), intuition)
      : sensor + skill('perception'),
    infiltration: {manual: agility, remote: command, jumped: response, autonomous: pilot}[mode] + (mode === 'autonomous' ? n('veh_as_covert') : skill('infiltration')),
    resist: n('body') + n('ballistic')
  }
  Object.keys(pools).forEach(key => {
    // resistance tests do not use the control bonus
    pools[key] = Math.max(0, pools[key] + (key.startsWith('resist') ? 0 : bonus))
  })

  let init, ip
  if (mode === 'autonomous') { init = pilot + response; ip = 3 }
  else if (mode === 'jumped') { init = response + intuition; ip = hot ? 3 : 2 }
  else if (mode === 'remote') { init = n('veh_op_init'); ip = v.veh_interface === 'ar' ? n('veh_op_ip') : (hot ? 3 : 2) }
  else { init = reaction + intuition; ip = n('veh_op_ip') }

  const note = (jumped || mode === 'autonomous' ? 'Threshold -1. ' : '') + (jumped ? `Control: +${bonus} dice.` : (bonus ? `AR: +${bonus} die.` : ''))
  return {pools, init, ip: Math.max(1, ip), note: note.trim()}
}

// Un véhicule n'a qu'un seul type de blindage : impact = balistique
const updateVehicleArmor = () => {
  getAttrs(['sheet_type', 'ballistic', 'impact'], v => {
    if (v.sheet_type !== 'vehicle') return
    const armor = parseInt(v.ballistic) || 0
    if ((parseInt(v.impact) || 0) !== armor) setAttrs({impact: armor})
  })
}

const updateVehicleControl = () => {
  getAttrs(VEHICLE_FIELDS, v => {
    if (v.sheet_type !== 'vehicle') return
    const result = vehiclePools(v)
    const update = {veh_init: result.init, veh_ip: result.ip, initiative_passes_base: result.ip, veh_note: result.note}
    Object.keys(result.pools).forEach(key => update[`veh_pool_${key}`] = result.pools[key])
    setAttrs(update)
  })
}
