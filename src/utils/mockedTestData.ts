import { User } from 'firebase/auth';

export const mockedUserData = {
  uname: 'Foo',
  email: 'foo@foo.com',
  create_date: new Date('October 3, 2024 5:21:10 PM UTC-4'),
  uid: '12312312',
};

export const mockedUser = {
  uid: '3134451',
  email: 'bar@foo.com',
  displayName: 'Bar',
} as User;

export const mockedRaceData = [
  {
    race_name: 'elf',
    subraces: ['high', 'wood'],
  },
  { race_name: 'foo', subraces: ['bar', 'baz'] },
];

export const mockedClassData = [
  {
    class_name: 'fooman',
    subclass_format: '<subclass_title> of the <subclass>',
    subclass_title: 'bar',
    subclasses: ['yabba', 'dabba'],
  },
  {
    class_name: 'ninja',
    subclass_format: '<subclass_title> of the <subclass>',
    subclass_title: 'clan',
    subclass: ['myterious', 'shadows'],
  },
];

export const mockedCharacterSummaries = [
  {
    charId: 'adsfasdf',
    class: mockedClassData[1],
    alignment: 'Lawful Good',
    background: 'just a guy',
    subclass: 'shadows',
    subrace: 'bar',
    race: 'foo',
    name: 'Alsondrio',
  },
  {
    charId: 'fdasfads',
    class: mockedClassData[0],
    race: 'elf',
    name: 'doofensmirtz',
  },
];

export const mockedCharacterData = {
  charId: '77zg0SMUQcgD1AggYI1V',
  name: 'Grogt Trugah',
  hp: 11,
  userDoc: 'eje',
  speed: 30,
  alignment: 'Chaotic Evil',
  equipment: {
    pp: null,
    ep: null,
    gear: [
      'light crossbow (20)',
      'dagger (2)',
      'mace',
      'arcane focus - a bat skull fused to a lizard body encased in crystal',
      "dungeoneer's pack",
      'leather armor',
      'common clothes',
      'book of prayers to demogorgon',
    ],
    sp: null,
    cp: null,
    gp: 15,
  },
  attacks: [
    {
      attackBonus: 3,
      type: 'b',
      damage: '1d6+1',
      normalRange: null,
      longRange: null,
      name: 'mace',
    },
    {
      type: ' ',
      name: 'light crossbow',
      longRange: '320',
      attackBonus: '3',
      normalRange: '80',
      damage: '1d8+1p',
    },
    {
      type: ' ',
      longRange: '60',
      attackBonus: null,
      name: 'dagger',
      damage: '1d4+1p',
      normalRange: '20',
    },
  ],
  xp: 0,
  additionalFeatures: [''],
  description: {
    eyes: 'green',
    age: '20',
    hair: 'black',
    height: "6'",
    weight: '187#',
    skin: 'gray',
    appearance: null,
  },
  skills: {
    religion: true,
    stealth: false,
    investigation: false,
    medicine: false,
    survival: false,
    persuasion: false,
    intimidation: true,
    athletics: false,
    performance: false,
    animalHandling: false,
    deception: false,
    insight: true,
    history: false,
    arcana: true,
    slightOfHand: false,
    perception: false,
    nature: true,
    acrobatics: false,
  },
  inspiration: 0,
  proficienciesAndLanguages: [
    'Common, Oricish',
    'light armor',
    'simple weapons',
  ],
  subrace: null,
  featuresAndTraits: [
    "Darkvision 60'",
    'Relentless Endurance (drop to 1 instead of 0 hp if not killed)',
    'Savage Attacks (1 extra damage die on critical hit)',
    'Otherworldly Patron: Demogorgon',
  ],
  initiative: null,
  ac: 11,
  spells: {
    spellSlots: {
      '3rd': 0,
      '9th': 0,
      '6th': 0,
      '4th': 0,
      '5th': 0,
      '1st': 0,
      '2nd': 0,
      '8th': 0,
      '7th': 0,
    },
    spellAttackBonus: 5,
    spellSaveDC: 13,
    spellsKnown: [
      {
        range: "120'",
        duration: {
          concentration: false,
          time: 'instant',
        },
        prepared: true,
        name: 'Eldritch Blast',
        ritual: false,
        components: {
          somatic: true,
          verbal: true,
          material: false,
          items: null,
        },
        castingTime: null,
        school: 'evocation',
        effect:
          'A beam o f crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1dlO force damage.\nThe spell creates more than one beam when you reach higher levels: two beams at 5th level, three beams at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.',
        save: null,
        level: null,
      },
      {
        castingTime: null,
        save: 'Con',
        effect:
          'You extend your hand toward a creature you can see within range and project a puff of noxious gas from your palm. The creature must succeed on a Constitution saving throw or take 1d12 poison damage.\nThis spell�s damage increases by 1d12 when you reach 5th level (2d12), 11th level (3d12), and 17th level (4d12).',
        ritual: false,
        components: {
          somatic: true,
          items: null,
          verbal: true,
          material: false,
        },
        range: "10'",
        level: null,
        prepared: true,
        school: 'conjuration',
        name: 'Poison Spray',
        duration: {
          time: 'instant',
          concentration: false,
        },
      },
      {
        duration: {
          time: 'instant',
          concentration: false,
        },
        prepared: true,
        name: 'Hellish Rebuke',
        level: null,
        ritual: false,
        save: 'Dex',
        school: 'evocation',
        castingTime: null,
        range: "60'",
        components: {
          verbal: true,
          somatic: true,
          material: false,
          items: null,
        },
        effect:
          'You point your finger, and the creature that damaged you is momentarily surrounded by hellish flames. The creature must make a Dexterity saving throw. It takes 2d10 fire damage on a failed save, or half as much damage on a successful one.\nAt Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.',
      },
      {
        range: "90'",
        duration: {
          time: '1 hour',
          concentration: true,
        },
        prepared: true,
        name: 'Hex',
        ritual: false,
        school: 'enchantment',
        castingTime: null,
        effect:
          'You place a curse on a creature that you can see within range. Until the spell ends, you deal an extra 1d6 necrotic damage to the target whenever you hit it with an attack. Also, choose one ability when you cast the spell. The target has disadvantage on ability checks made with the chosen ability.\nIf the target drops to 0 hit points before this spell ends, you can use a bonus action on a subsequent turn of yours to curse a new creature.\nA remove curse cast on the target ends this spell early.\nAt Higher Levels. When you cast this spell using a spell slot of 3rd or 4th level, you can maintain your concentration on the spell for up to 8 hours. When you use a spell slot of 5th level or higher, you can maintain your concentration on the spell for up to 24 hours.',
        save: null,
        level: null,
        components: {
          material: true,
          verbal: true,
          somatic: true,
          items: 'petrified eye of newt',
        },
      },
    ],
    spellsPrepared: null,
    componentsPouch: null,
    cantripsKnown: 2,
  },
  class: [
    {
      name: 'Warlock',
      level: 1,
    },
  ],
  persona: {
    backstory:
      "Grogt was not weak, but he wasn't among the strongest. He found that the only way to avoid losing what you wanted and to get everything you wanted to was to have power over others. \n\nSo he sought that power, and got it from Demogorgon. How he seeks to constantly expand his control and rule over everything.",
    personalityTraits: [
      'I idolize a famous warlock of Demogorgon and constantly speak of her',
      'I see omens in everything -- Demogorgon is always speaking to me.',
    ],
    bonds: ['I will enslave and destroy the tribe that banished me'],
    ideals: ['Ambition - I wish to exert my power to rule'],
    flaws: [
      'I am suspicious of strangers and anyone who appears to have ambition',
    ],
  },
  hitDice: [
    {
      die: '1d8',
      qty: '1',
    },
  ],
  race: 'Half-Orc',
  background: 'Acolyte',
  attributes: {
    str: 12,
    dex: 12,
    int: 10,
    wis: 12,
    cha: 16,
    con: 16,
  },
  treasure: [''],
  alliesAndAssociations: [''],
  savingThrows: {
    cha: true,
    str: false,
    wis: true,
    dex: false,
    con: false,
    int: false,
  },
};
