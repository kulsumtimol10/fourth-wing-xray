// ============================================================================
// FOURTH WING: THE EMPYREAN ARCHIVE — Calibrated Realm & Lore Data (v3)
// Coordinates are exact [x%, y%] positions mapped onto the 16:9 artworks.
// ============================================================================

export const REALMS = {
  dragon: {
    id: 'dragon',
    tabLabel: 'I • Dragons of the Vale',
    chapterKicker: 'CHAPTER I • DRACONIC OSTEOLOGY & THE VALE',
    headline: 'Tairneanach & Andarnaurram',
    sublead: 'Move your cursor across the storm-swept cliff to part Tairn’s battle-scarred obsidian scales—revealing his four-chambered magma heart, hollow wing struts, and the golden-azure telepathic bond tether.',
    realImage: './assets/dragon_real.jpg',
    xrayImage: './assets/dragon_xray.jpg',
    hotspots: [
      {
        id: 'tairn-heart',
        num: '01',
        x: 53.5,
        y: 47.0,
        tag: 'CARDIAC & ARCANE CORE',
        title: 'Four-Chambered Magma Heart & Bond Dynamo',
        telemetry: 'Output: 4.8 Gigawatts Arcane Flux • Bond: Quaternary Mated Circuit',
        description: 'Caged within a reinforced sternal keel, Tairn’s heart pumps superheated blood while functioning as a living arcane generator. Under Second-Sight tomography, the golden-azure Bond Tether anchors directly into the aortic plexus—explaining why a dragon’s death instantaneously severs its rider’s life force.',
        secret: 'Notice how the heart’s golden filaments branch downward toward Andarna and outward toward Sgaeyl—binding Tairn, Sgaeyl, Violet, and Xaden into a single shared life circuit.'
      },
      {
        id: 'tairn-skull',
        num: '02',
        x: 62.5,
        y: 26.5,
        tag: 'NEURO-ARCANE CORTEX',
        title: 'Horned Cranium & Telepathic Bond Web',
        telemetry: 'Bandwidth: Multi-Mile Mental Projection • Shielding: Obsidian Grade',
        description: 'Behind Tairn’s swept-back occipital horns lies an enlarged pineal-arcane ganglion. Second-Sight reveals a shimmering web of golden-blue harmonic threads spanning between his skull and wings—the physical manifestation of the mental bond through which he speaks directly into Violet’s mind.',
        secret: 'Before breathing fire, dual hypergolic compounds mix at the back of the palate—lined with silicate bone plates so a dragon never burns its own throat.'
      },
      {
        id: 'tairn-wings',
        num: '03',
        x: 31.0,
        y: 30.0,
        tag: 'AERODYNAMIC OSTEOLOGY',
        title: '5-Ray Metacarpal Wing Bones & Lightning Veins',
        telemetry: 'Bone Structure: Vanadium-Dense Honeycomb • Max Load: 14 G',
        description: 'Despite being one of the largest dragons on the Continent, Tairn executes high-G combat dives thanks to hollow trabecular wing phalanges. Electric-blue signet arteries branch across the leathery membrane, discharging static into the surrounding storm clouds.',
        secret: 'Unlike two-legged wyvern whose forelimbs are fused into wings, true dragons of the Vale possess four independent legs plus two separate wing limbs.'
      },
      {
        id: 'andarna-core',
        num: '04',
        x: 59.0,
        y: 62.5,
        tag: 'THE SEVENTH BREED',
        title: 'Andarnaurram: Iridescent Feathertail Core',
        telemetry: 'Lineage: The Missing Seventh Breed • Gift: Temporal Resonance',
        description: 'Waited six hundred years inside her shell for the mind of a scribe and the heart of a rider. Beneath her shimmering golden feather-scales pulses a unique seventh harmonic core—carrying the exact missing flame frequency required to ignite the Basgiath Wardstone.',
        secret: 'Her juvenile feathertail gift of stopping local time reabsorbs into her skeletal marrow during the Dreamless Sleep to fuel rapid adolescent growth.'
      },
      {
        id: 'tairn-tail',
        num: '05',
        x: 21.5,
        y: 70.0,
        tag: 'LETHAL OSTEOLOGY',
        title: 'Morningstartail Spiked Ossicone Mace',
        telemetry: 'Impact Force: 920 kN • Spikes: Detachable Calcified Ossicones',
        description: 'The rarest and most devastating tail weapon among dragonkind. The terminal caudal vertebrae fuse into a heavy osseous club studded with runic-glowing bone spikes capable of shattering granite battlements or crushing a wyvern’s chest stone in a single sweep.',
        secret: 'A dedicated dorsal tendon cable runs from the pelvis to the tail tip, allowing whip-fast kinetic strikes in mid-air.'
      }
    ]
  },

  rider: {
    id: 'rider',
    tabLabel: 'II • The Bonded Riders',
    chapterKicker: 'CHAPTER II • RIDER BIOMECHANICS, RELICS & SIGNET CONDUITS',
    headline: 'Violet Sorrengail & Xaden Riorson',
    sublead: 'Sweep the lens over the storm-lashed battlements to reveal how Violet’s dragon-scale armor braces her hypermobile joints while channeling pure lightning—alongside Xaden’s 107 rebellion relic and mated bond bridge.',
    realImage: './assets/rider_real.jpg',
    xrayImage: './assets/rider_xray.jpg',
    hotspots: [
      {
        id: 'violet-relic-heart',
        num: '01',
        x: 41.0,
        y: 48.0,
        tag: 'DUAL-BOND TRANSFORMER',
        title: 'Twin-Dragon Relic Core & Cardiac Conduit',
        telemetry: 'Relics: Black Morningstartail + Golden Feathertail • Core Temp: 40.8 °C',
        description: 'Under Second-Sight, Violet’s chest and upper spine blaze with two interlocking dragon silhouettes—one golden, one electric blue. These dermal relics interface directly with her spinal ganglia, acting as a biological transformer that allows a human body to channel Tairn’s gigawatt lightning without incinerating.',
        secret: 'Prolonged high-voltage channeling permanently bleaches the pigment from the ends of her hair, turning her crown braid silver at the tips.'
      },
      {
        id: 'violet-eds-joints',
        num: '02',
        x: 35.5,
        y: 39.5,
        tag: 'EDS BIOMECHANICS & ARMOR',
        title: 'Hypermobile Joints & Dragon-Scale Corset Bracing',
        telemetry: 'Condition: Hypermobile Collagen (EDS Profile) • Armor: Teine’s Green Scales',
        description: 'X-ray tomography highlights luminous stabilization rings around Violet’s shoulder (glenohumeral), rib, and elbow joints—where fragile connective collagen makes her prone to subluxations and dislocations. Externally, Mira’s masterwork corset woven from Teine’s dragon scales acts as a flexible exoskeleton.',
        secret: 'Dragon magic never "erases" her chronic condition—instead, her custom saddle, scale armor, and tactical intellect prove that adaptation belongs at the apex of the Riders Quadrant.'
      },
      {
        id: 'violet-lightning-hands',
        num: '03',
        x: 29.0,
        y: 68.5,
        tag: 'OFFENSIVE SIGNET',
        title: 'Lichtenberg Neural-Vascular Lightning Arcs',
        telemetry: 'Peak Potential: 1.2 Billion Volts • Inductance: Alloy-Core Daggers',
        description: 'Raw atmospheric power surges from Tairn down Violet’s brachial nerves and radial arteries into her fists, forming branching fractal Lichtenberg figures. The charge couples inductively into the talladium-alloy daggers strapped across her ribs and thighs.',
        secret: 'While raw power is her primary manifestation from Tairn, her second signet channeled through Andarna resonates on a deeper, subtler plane.'
      },
      {
        id: 'mated-bond-bridge',
        num: '04',
        x: 52.0,
        y: 20.5,
        tag: 'QUATERNARY MATED TETHER',
        title: 'Intertwined Mind-to-Mind & Heart-to-Heart Tether',
        telemetry: 'Nodes: Violet ⇄ Xaden ⇄ Tairn ⇄ Sgaeyl • Encryption: Obsidian Shields',
        description: 'Spanning the storm between Violet’s and Xaden’s temples and hearts is a braided helix of gold and violet light—the telepathic bridge forged by Tairn and Sgaeyl’s mating bond. Through this conduit, they share thoughts, sensory grounding, and life-or-death awareness across battlefields.',
        secret: 'Notice Xaden’s secondary violet halo in the prefrontal cortex: his classified second signet as an Intinnsic capable of reading immediate intentions.'
      },
      {
        id: 'xaden-rebellion-relic',
        num: '05',
        x: 64.5,
        y: 42.0,
        tag: 'RUNIC PROTECTION MATRIX',
        title: 'The 107 Rebellion Relic & Umbral Shadow Conduit',
        telemetry: 'Marks: 107 Separatist Children • Shielding: Col. Mairi’s River-Stone Rune',
        description: 'Spiraling up Xaden’s left arm and neck is the rebellion relic breathed by Codagh—carrying 107 tiny scar nodes for every Tyrrish child whose life Xaden vouched for. Coiling around his ribcage and forearms are tangible tendrils of compressed abyssal shadow.',
        secret: 'Because each marked child clenched a complex runed stone crafted by Liam’s mother at the moment of Codagh’s fire, General Melgren’s battle-foresight signet is completely blinded whenever three or more Marked Ones gather!'
      }
    ]
  },

  basgiath: {
    id: 'basgiath',
    tabLabel: 'III • Basgiath & The Wards',
    chapterKicker: 'CHAPTER III • ARCHITECTURAL CUTAWAY & SUBTERRANEAN LEY-LINES',
    headline: 'Basgiath War College & The Wardstone',
    sublead: 'Pierce through the rain-lashed granite peaks of Basgiath to uncover the subterranean Black-Iron Wardstone Cauldron, the Seven Pillars of Dragon Fire, secret Archive vaults, and creeping Venin corruption.',
    realImage: './assets/basgiath_real.jpg',
    xrayImage: './assets/basgiath_xray.jpg',
    hotspots: [
      {
        id: 'basgiath-wardstone',
        num: '01',
        x: 54.5,
        y: 86.0,
        tag: 'DEEP BEDROCK VAULT (-850 FT)',
        title: 'The Black-Iron Wardstone Cauldron & Fire Pillars',
        telemetry: 'Material: Runed Black Iron • Ignition Requirement: Seven Dragon Breeds',
        description: 'Carved deep beneath the chasm of Basgiath sits the ancient iron Wardstone cauldron, encircled by towering pillars of dragonfire. Golden ley-lines surge upward from this chamber through the mountain bedrock to project Navarre’s protective barrier.',
        secret: 'For centuries, Navarre believed the First Six journals said "six and the one"—until Violet translated Lyra’s original passage proving it required SEVEN dragon breeds and one Wardstone!'
      },
      {
        id: 'basgiath-parapet',
        num: '02',
        x: 41.0,
        y: 73.5,
        tag: 'RIDERS QUADRANT ENTRANCE',
        title: 'The Parapet (200-Foot Abyssal Span)',
        telemetry: 'Width: 18 Inches • Length: 220 Feet • Mortality Rate: ~15–20%',
        description: 'A narrow, unrailed stone bridge slick with torrential rain and buffeted by canyon vortex winds. Every conscript must cross this span on Conscription Day to enter the Riders Quadrant. Under Ward-Sight, golden structural ley-threads trace the keystone arch.',
        secret: 'High-friction flat-soled rider boots—like the pair Rhiannon traded with Violet on Conscription Day—are the difference between grip and a 200-foot fall.'
      },
      {
        id: 'basgiath-ward-dome',
        num: '03',
        x: 50.0,
        y: 16.0,
        tag: 'GEODESIC ARCANE SHIELD',
        title: 'The Great Ward Dome Lattice',
        telemetry: 'Coverage: Navarre Interior • Effect: Nullifies Non-Dragon Magic',
        description: 'Arching high above the twin peaks and soaring dragons is the shimmering golden geodesic lattice of the Wards. Within this dome, neither venin dark-wielders nor gryphon fliers can channel magic—making Basgiath the ultimate sanctuary and strategic prize.',
        secret: 'When outposts along the border fail, the outer threads of this lattice fray—allowing wyvern and venin to push deeper inland.'
      },
      {
        id: 'basgiath-archives',
        num: '04',
        x: 76.5,
        y: 84.5,
        tag: 'CLASSIFIED SUB-LEVELS',
        title: 'Hidden Archive Sub-Vaults & Pre-Unification Tomes',
        telemetry: 'Access: Royal / Scribe Clearance • Contents: Warrick & Lyra’s Journals',
        description: 'Beneath the grand candlelit rotunda of the Archives lie secret subterranean vaults cut into the eastern and western cliffs. Here, forbidden pre-Unification histories, feathertail research hidden by Papa Sorrengail, and Marked Ones’ smuggling caches are concealed from command.',
        secret: 'Another hidden chamber on the western cliff (x: 30%, y: 70%) connects to the tunnels used to smuggle talladium-alloy daggers out to the border.'
      },
      {
        id: 'basgiath-venin',
        num: '05',
        x: 91.0,
        y: 66.0,
        tag: 'GEOMAGICAL CORRUPTION',
        title: 'Creeping Venin Desiccation Veins',
        telemetry: 'Threat Level: CRITICAL • Source: Direct Ground-Magic Draining',
        description: 'Along the eastern cliff just outside the golden edge of the Ward Dome, jagged crimson veins crawl up the stone. This is the unmistakable signature of venin—dark wielders who bypass dragons to drain raw magic directly from the earth, leaving desiccated gray stone and soul-corrupted husks in their wake.',
        secret: 'The crimson threads are actively probing for hairline fractures in the Wardstone’s foundation.'
      }
    ]
  }
};

export const ARTIFACTS_3D = [
  {
    id: 'wardstone',
    title: '01 • The Subterranean Wardstone Cauldron',
    subtitle: 'Black Runed Iron • Seven-Breed Harmonic Projector',
    description: 'Drag to rotate 360°. Deep beneath Basgiath sits the ancient black-iron cauldron inscribed with Unification runes. Six golden flame pillars represent the six known dragon breeds of the Vale, while the seventh cyan-gold crystal represents Andarna’s missing seventh breed frequency.'
  },
  {
    id: 'relic-core',
    title: '02 • The Dual-Bond Relic & Magma Heart Core',
    subtitle: 'Quaternary Tether Astrolabe • Tairn, Andarna, Violet & Xaden',
    description: 'Drag to rotate 360°. An arcane visualization of Tairn’s beating four-chambered magma heart suspended inside interlocking golden and storm-blue gyroscopic rings—demonstrating how the dragon relic regulates gigawatts of lightning without burning out human nerves.'
  },
  {
    id: 'wyvern-stone',
    title: '03 • Captured Wyvern Dark-Magic Rune Stone',
    subtitle: 'Corrupted Granite Core • Tyrrish-Derived Animation Matrix',
    description: 'Drag to rotate 360°. Extracted from the ribcage of a slain wyvern. Unlike true dragons who possess living hearts, wyvern are animated by heavy boulders etched with complex interlocking crimson runes—instantly collapsing if shattered by lightning.'
  }
];

export const QUIZ_QUESTIONS = [
  {
    question: 'As you step onto the rain-slicked stone of the Parapet with a 200-foot drop below, what governs your first stride?',
    options: [
      { text: 'Calculated physics—I test the friction of my boots, lower my center of gravity, and time the wind gusts.', weights: { tairn: 3, andarna: 3, green: 2 } },
      { text: 'Unrelenting defiance—the storm and the cadets behind me are just obstacles to conquer.', weights: { tairn: 3, blue: 4, red: 2 } },
      { text: 'Quiet observation—I watch where the stone shifts ahead of me and adapt every step.', weights: { andarna: 4, green: 3 } },
      { text: 'Pure momentum—I move fast and fearless before hesitation can take root.', weights: { red: 4, blue: 2 } }
    ]
  },
  {
    question: 'In the Archives at midnight, you uncover a pre-Unification journal proving Navarre has hidden the truth about the borders. What do you do?',
    options: [
      { text: 'Translate every rune in secret, decode the Wardstone schematics, and use the truth to protect everyone.', weights: { tairn: 3, andarna: 4 } },
      { text: 'Lead covert midnight supply runs to smuggle talladium daggers to the front lines immediately.', weights: { blue: 4, tairn: 2 } },
      { text: 'Brief my squad and map out tactical contingencies before making a single move.', weights: { green: 4, andarna: 2 } },
      { text: 'Confront the lie head-on and test the full destructive limit of my signet.', weights: { red: 4, tairn: 2 } }
    ]
  },
  {
    question: 'During Threshing in the canyon clearing, three armed cadets corner a smaller golden feathertail. How do you intervene?',
    options: [
      { text: 'Stand directly between their blades and the dragon—using terrain, daggers, and unbreakable willpower.', weights: { tairn: 4, andarna: 4 } },
      { text: 'Strike from the shadows before they realize they are being hunted, neutralizing their leader first.', weights: { blue: 4 } },
      { text: 'Outmaneuver them with precision biomechanics and force them to yield.', weights: { green: 4 } },
      { text: 'Unleash overwhelming offensive force until the clearing belongs to me.', weights: { red: 4, tairn: 2 } }
    ]
  },
  {
    question: 'When the dragon’s golden eyes lock onto yours and its mind presses against your shields, what truth does it find inside you?',
    options: [
      { text: 'That physical fragility never meant weakness—my mind and loyalty are unbreakable iron.', weights: { tairn: 4, andarna: 3 } },
      { text: 'That I will carry a hundred scars on my own back to protect the people I swore to defend.', weights: { blue: 4 } },
      { text: 'That I question every order, guard ancient knowledge, and refuse to let history be erased.', weights: { andarna: 4, green: 3 } },
      { text: 'That I burn with an untamed storm that bows to no wingleader or king.', weights: { red: 4, tairn: 2 } }
    ]
  }
];

export const DRAGON_RESULTS = {
  tairn: {
    breed: 'Black Morningstartail (Lineage of Tairneanach)',
    rarity: 'ULTRA-RARE • APEX COMBAT MOUNT',
    signet: 'Pure Atmospheric Lightning Wielder',
    colorHex: '#5ecbff',
    quote: '“I know exactly who and what you are.”',
    description: 'Black dragons are the rarest, largest, and most lethal on the Continent—combining the cunning intellect of a scribe with ferocious battlefield supremacy.'
  },
  andarna: {
    breed: 'Iridescent Seventh Breed (Lineage of Andarnaurram)',
    rarity: 'MYTHIC SINGULARITY • THE SEVENTH FLAME',
    signet: 'Chrono-Spatial Resonance & Ward Ignition',
    colorHex: '#ffe08a',
    quote: '“I waited six centuries to hatch for someone who values truth over comfort.”',
    description: 'Your mind bridges ancient lore and fearless compassion. Your bond carries the seven-spectrum harmonic needed to restore the ancient wards.'
  },
  blue: {
    breed: 'Blue Daggertail (Lineage of Sgaeyl)',
    rarity: 'RARE • RUTHLESS & UNCOMPROMISING',
    signet: 'Abyssal Shadow Wielder & Intent Perception',
    colorHex: '#8a7aff',
    quote: '“Blues do not care about rules—only relentless capability and loyalty to the chosen few.”',
    description: 'Calculating, fierce, and fiercely protective beneath obsidian mental shields. Your signet commands tangible darkness and reads unguarded intentions.'
  },
  green: {
    breed: 'Green Swordtail (Lineage of Teine)',
    rarity: 'TACTICAL APEX • KEEN INTELLECT',
    signet: 'Ward Extension & Protective Barrier Weaving',
    colorHex: '#3ce699',
    quote: '“Sharp-minded, observant, and impossible to outmaneuver in a storm.”',
    description: 'Greens prize riders who think three moves ahead in the chaos of war, projecting impenetrable ward shields around their squad.'
  },
  red: {
    breed: 'Red Scorpiontail (Lineage of Thoirt)',
    rarity: 'FEROCIOUS • DEVASTATING OFFENSE',
    signet: 'Pyro-Kinetic Thermal Surge',
    colorHex: '#ff4766',
    quote: '“Never insult a Red—and never stand in front of its rider.”',
    description: 'Passionate, fearless, and first into the breach with overwhelming close-quarters aerial dominance.'
  }
};
