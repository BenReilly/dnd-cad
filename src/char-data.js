import PDF_DATA from './dndcadjson';
const formattedChars = [];

PDF_DATA.forEach((c) => {
  // class
  const classLevelSplit = c.ClassLevel.split(' ');
  const level = parseInt(classLevelSplit[classLevelSplit.length - 1])
    ? parseInt(classLevelSplit[classLevelSplit.length - 1])
    : null;
  if (level !== null) {
    classLevelSplit.pop();
  }
  const charClass = classLevelSplit.join(' ');

  // race
  const getRace = (raceString) => {
    const splitRace = raceString.split(' ');
    const hasSubrace = splitRace.length > 1;
    const isDragonborn = splitRace[0].includes('Dragonborn');
    const race = !hasSubrace
      ? raceString
      : isDragonborn
        ? 'Dragonborn'
        : splitRace[1];
    const subrace = !hasSubrace
      ? null
      : isDragonborn
        ? splitRace[1].substring(
            splitRace[1].indexOf('(') + 1,
            splitRace[1].indexOf(')') - splitRace[1].indexOf('('),
          )
        : splitRace[0];
    return { race, subrace };
  };
  const { race, subrace } = getRace(c.Race[0]);

  // attacks
  const attacks = [];
  if (c['Wpn Name'].length > 0) {
    const rangeIndex = c['Wpn1 Damage'].indexOf('[');
    const hasRange = rangeIndex > -1;
    const rangeArray = hasRange
      ? c['Wpn1 Damage']
          .substring(rangeIndex + 1, c['Wpn1 Damage'].length - 1)
          .split('/')
      : null;
    const dmgType = hasRange
      ? c['Wpn1 Damage'].charAt(rangeIndex - 1)
      : c['Wpn1 Damage'].charAt(c['Wpn1 Damage'].length - 1);
    const damage = c['Wpn1 Damage'].substring(
      0,
      c['Wpn1 Damage'].indexOf(dmgType),
    );
    attacks.push({
      name: c['Wpn Name'],
      attackBonus: Number(c['Wpn1 AtkBonus']) || null,
      damage: damage,
      type: dmgType,
      normalRange: !hasRange ? null : rangeArray[0],
      longRange: !hasRange ? null : rangeArray[1],
    });
  }
  let i = 2;
  while (c[`Wpn Name ${i}`].length > 0) {
    const rangeIndex = c[`Wpn${i} Damage`].indexOf('[');
    const hasRange = rangeIndex > -1;
    const rangeArray = hasRange
      ? c[`Wpn${i} Damage`]
          .substring(rangeIndex + 1, c[`Wpn${i} Damage`].length - 1)
          .split('/')
      : null;
    const dmgType = hasRange
      ? c[`Wpn${i} Damage`].charAt(rangeIndex - 1)
      : c[`Wpn${i} Damage`].charAt(c[`Wpn${i} Damage`].length - 1);
    const damage = c[`Wpn${i} Damage`].substring(
      0,
      c[`Wpn${i} Damage`].indexOf(dmgType),
    );
    attacks.push({
      name: c[`Wpn Name ${i}`],
      attackBonus: c[`Wpn${i} AtkBonus`].toString().substring(1) || null,
      damage: damage,
      type: dmgType,
      normalRange: !hasRange ? null : rangeArray[0],
      longRange: !hasRange ? null : rangeArray[1],
    });
    i++;
  }

  // spells
  const spellSlots = {
    '1st': 0,
    '2nd': 0,
    '3rd': 0,
    '4th': 0,
    '5th': 0,
    '6th': 0,
    '7th': 0,
    '8th': 0,
    '9th': 0,
  };
  Object.keys(spellSlots).forEach((spellLvl) => {
    for (let i = 1; i < 5; i++) {
      if (c[`SpellSheet1_Spell Slot ${spellLvl} ${i}`] === 'On') {
        spellSlots[spellLvl]++;
      }
    }
  });

  const spellsKnown = [];
  for (let i = 1; i < 13; i++) {
    const j = i < 10 ? `0${i}` : i;

    if (c[`SpellSheet1_Spell Name ${j}`] !== '') {
      spellsKnown.push({
        name: c[`SpellSheet1_Spell Name ${j}`] || null,
        level: c[`SpellSheet1_Spells Level ${j}`] || null,
        school: c[`SpellSheet1_Spell School ${j}`] || null,
        range: c[`SpellSheet1_Range ${j}`] || null,
        castingTime: c[`SpellSheet1_Casting Time ${j}}`] || null,
        ritual: c[`SpellSheet1_Ritual ${j}`] === 'Yes',
        save: c[`SpellSheet1_Save ${j}`] || null,
        duration: {
          time: c[`SpellSheet1_Duration ${j}`] || null,
          concentration: c[`SpellSheet1_Concentration ${j}`] === 'Yes',
        },
        components: {
          material: c[`SpellSheet1_Material ${j}`] === 'Yes',
          somatic: c[`SpellSheet1_Somatic ${j}`] === 'Yes',
          verbal: c[`SpellSheet1_Verbal ${j}`] === 'Yes',
          items: c[`SpellSheet1_Components ${j}`] || null,
        },
        prepared: c[`SpellSheet1_Prepared ${j}`] === 'Yes',
        effect: c[`SpellSheet1_Spell Effect ${j}`] || null,
      });
    }
  }

  const formatted = {
    userDoc: c.PlayerName,
    name: c.CharacterName,
    class: [
      {
        name: charClass,
        level: level,
      },
    ],
    background: c.Background || null,
    race,
    subrace,
    alignment: c.Alignment || null,
    xp: c.XP || 0,
    attributes: {
      str: c.STR || null,
      dex: c.DEX || null,
      con: c.CON || null,
      int: c.INT || null,
      wis: c.WIS || null,
      cha: c.CHA || null,
    },
    inspiration: c.Inspiration || 0,
    savingThrows: {
      str: c['ST Str cb'] === 'Yes',
      dex: c['ST Dex cb'] === 'Yes',
      con: c['ST Con cb'] === 'Yes',
      int: c['ST Int cb'] === 'Yes',
      wis: c['ST Wis cb'] === 'Yes',
      cha: c['ST Cha cb'] === 'Yes',
    },
    skills: {
      acrobatics: c['Acro cb'] === 'Yes',
      animalHandling: c['Animal cb'] === 'Yes',
      arcana: c['Arcana cb'] === 'Yes',
      athletics: c['Athletic cb'] === 'Yes',
      deception: c['Deception cb'] === 'Yes',
      history: c['History cb'] === 'Yes',
      insight: c['Insight cb'] === 'Yes',
      intimidation: c['Intimidation cb'] === 'Yes',
      investigation: c['Investigation cb'] === 'Yes',
      medicine: c['Medicine cb'] === 'Yes',
      nature: c['Nature cb'] === 'Yes',
      perception: c['Perception cb'] === 'Yes',
      performance: c['Performance cb'] === 'Yes',
      persuasion: c['Persuasion cb'] === 'Yes',
      religion: c['Religion cb'] === 'Yes',
      slightOfHand: c['Sleight cb'] === 'Yes',
      stealth: c['Stealth cb'] === 'Yes',
      survival: c['Survival cb'] === 'Yes',
    },
    ac: c.AC || null,
    initiative: c.Initiative || null,
    speed: c.Speed || null,
    hp: c.HPMax || null,
    hitDice:
      c.HD.length > 1
        ? [
            {
              qty: c.HD.substring(0, 1),
              die: c.HD.substring(c.HD[0].indexOf('d') + 1),
            },
          ]
        : null,
    persona: {
      personalityTraits: c.PersonalityTraits.split('\n'),
      ideals: c.Ideals.split('\n'),
      bonds: c.Bonds.split('\n'),
      flaws: c.Flaws.split('\n'),
      backstory: c.Backstory,
    },
    attacks: attacks || null,
    featuresAndTraits: c['Features and Traits'].split('\n') || null,
    proficienciesAndLanguages: c.ProficienciesLang.split('\n') || null,
    equipment: {
      cp: c.CP || null,
      sp: c.SP || null,
      ep: c.EP || null,
      gp: c.GP || null,
      pp: c.PP || null,
      gear: c.Equipment.split('\n') || null,
    },
    description: {
      age: c.Age || null,
      height: c.Height || null,
      weight: c.Weight || null,
      eyes: c.Eyes || null,
      skin: c.Skin || null,
      hair: c.Hair || null,
      appearance: c['Character Appearance'] || null,
    },
    alliesAndAssociations: c.Allies.split('\n') || null,
    additionalFeatures: c['Feat+Traits'].split('\n') || null,
    treasure: c.Treasure.split('\n') || null,
    spells: {
      spellAttackBonus: c['SpellSheet 1_Spell Atk'] || null,
      spellSaveDC: c['SpellSheet 1_Spell DC'] || null,
      cantripsKnown: c['SpellSheet 1_Cantrips Known'] || null,
      spellsPrepared: c['SpellSheet 1_Spells Known'] || null,
      componentsPouch: c['SpellSheet1_Component Pouch'] || null,
      spellSlots,
      spellsKnown,
    },
  };

  formattedChars.push(formatted);
});

export default formattedChars;
