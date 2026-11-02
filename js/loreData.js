// ============================================================================
// FOURTH WING: CODEX OCULUS — Original Anatomical, Arcane & Structural Data
// All summaries and telemetry are original analytical descriptions inspired by
// the world of Fourth Wing by Rebecca Yarros.
// ============================================================================

export const SCAN_MODES = {
  dragon: {
    id: 'dragon',
    title: 'DRACONIC ANATOMY & SIGNET CORE',
    subtitle: 'Sub-Dermal Osteology, Pyro-Glands & Bond Tethers',
    specimens: [
      {
        id: 'tairn',
        name: 'Tairneanach (Tairn)',
        classification: 'Black Morningstartail • Elder Combat Mount',
        wingspan: '148 ft (45.1 m)',
        biteForce: '48,000 PSI',
        coreTemp: '1,420 °C (Thoracic Chamber)',
        signetOutput: 'Pure Atmospheric Lightning (Gigawatt Class)',
        themeColor: '#38b6ff',
        secondaryColor: '#f4c55c',
        summary: 'One of the largest and fiercest dragons on the Continent. Beneath his impenetrable matte-black scales lies a vanadium-dense hollow skeletal lattice engineered for high-G aerial combat, a four-chambered magma-hot heart, and a dual-channel neural nexus tethered to both his rider Violet Sorrengail and his mate Sgaeyl.',
        hotspots: [
          {
            id: 'tairn-heart',
            title: 'Four-Chambered Magma Heart & Bond Core',
            layer: 'Vascular / Arcane Core',
            coords: [0.2, 0.35, 0.0],
            telemetry: 'BPM: 28 (Resting) / 140 (Combat) • Output: 4.8 GW Arcane Flux',
            description: 'Positioned deep within a reinforced sternal keel, Tairn’s heart pumps oxygen-dense, hyper-thermophilic blood while simultaneously acting as an arcane dynamo. X-ray tomography reveals the golden-azure Bond Tether anchored directly into the aortic plexus—explaining why the death of a dragon instantaneously severs a rider’s life force.',
            xrayInsight: 'Notice the interwoven secondary gold filament: the mated bond to Sgaeyl, creating a four-way life-dependency circuit between Tairn, Sgaeyl, Violet, and Xaden.'
          },
          {
            id: 'tairn-pyro',
            title: 'Bifurcated Pyro-Chemical Ignition Sacs',
            layer: 'Internal Organs (Mid-X-Ray)',
            coords: [1.85, 0.65, 0.0],
            telemetry: 'Ignition Temp: 1,850 °C • Compound: Binary Hypergolic Mist',
            description: 'Dragons do not store open flame inside their chests. Instead, dual thoracic reservoirs secrete two separate volatile compounds along armored tracheal ducts. When expelled through specialized sub-lingual nozzles at the back of the jaw, the two streams collide with atmospheric oxygen and ignite into stone-melting dragonfire.',
            xrayInsight: 'The interior of the cervical vertebrae and palate are lined with calcified silicate plates that reflect radiant heat away from the brain.'
          },
          {
            id: 'tairn-wings',
            title: '5-Ray Metacarpal Wing Struts',
            layer: 'Deep Skeletal Lattice',
            coords: [-0.2, 1.45, 2.6],
            telemetry: 'Bone Density: Trabecular Honeycomb • Max Load: 14 G',
            description: 'Despite his colossal mass, Tairn achieves supersonic dive recoveries through an ultra-lightweight trabecular bone architecture. Five elongated metacarpal "fingers" radiate from the carpal joint, tensioned by high-tensile elastin membranes laced with thermoregulatory blood vessels.',
            xrayInsight: 'Micro-stress remodeling along the left third phalanx reveals healed battle trauma from past border engagements.'
          },
          {
            id: 'tairn-tail',
            title: 'Morningstartail Calcified Mace',
            layer: 'Osteology & Dermal Armor',
            coords: [-3.7, 0.25, 0.0],
            telemetry: 'Terminal Impact Force: 920 kN • Spikes: 18 Detachable Ossicones',
            description: 'The rarest and deadliest tail configuration among the six known breeds. The final seven caudal vertebrae fuse into a dense osseous club studded with razor-edged keratin-sheathed bone spikes, capable of shattering granite ramparts or crushing a wyvern’s ribcage in a single sweep.',
            xrayInsight: 'A dedicated dorsal tendon cable runs from the pelvis to the tail tip, allowing whip-fast kinetic snaps without sacrificing flight trim.'
          },
          {
            id: 'tairn-cranial',
            title: 'Cranial Bond Nexus & Telepathic Cortex',
            layer: 'Neuro-Arcane System',
            coords: [2.95, 1.35, 0.0],
            telemetry: 'Bandwidth: Dual-Rider / Mate Multiplex • Shielding: Obsidian Grade',
            description: 'Behind the swept-back occipital horns sits an enlarged pineal-arcaneganglion. Through this structure, Tairn projects mental speech, sensory imagery, and raw signet power across miles into Violet’s mind—while also anchoring Andarna’s golden adolescent tether.',
            xrayInsight: 'High-frequency azure arcs visible in X-ray mode show active atmospheric charge accumulation prior to a lightning strike.'
          }
        ]
      },
      {
        id: 'andarna',
        name: 'Andarnaurram (Andarna)',
        classification: 'Iridescent Feathertail • The Seventh Breed',
        wingspan: '46 ft (Juvenile) → 92 ft (Adolescent)',
        biteForce: '19,500 PSI',
        coreTemp: '1,180 °C (Chromatic Core)',
        signetOutput: 'Temporal Dilation (Feathertail Gift) & Seventh Flame',
        themeColor: '#f4c55c',
        secondaryColor: '#ff9e44',
        summary: 'Waited six hundred years inside her shell for the mind of a scribe and the heart of a rider. What initially appeared to be a delicate golden feathertail is revealed under X-ray tomography to be the long-lost Seventh Breed—possessing adaptive chromatic prism scales and the missing resonant frequency required to ignite the Basgiath Wardstone.',
        hotspots: [
          {
            id: 'andarna-pineal',
            title: 'Chrono-Resonant Feathertail Gland',
            layer: 'Neuro-Arcane Core',
            coords: [2.3, 1.1, 0.0],
            telemetry: 'Temporal Drift: Δt = 0.00 (Suspended) • Status: Absorbed during Dreamless Sleep',
            description: 'Juvenile feathertails possess an ephemeral arcane organ at the base of the cranium that grants temporary gifts directly to their bonded human—in Andarna’s case, the ability to halt local time. During the transformative Dreamless Sleep, this gland reabsorbs into the skeletal marrow to fuel rapid adult growth.',
            xrayInsight: 'Residual golden harmonic rings still echo around the cranial vault, explaining why feathertails are fiercely hidden from exploitation by the Empyrean.'
          },
          {
            id: 'andarna-scales',
            title: 'Chromatic Prism Dermal Matrix',
            layer: 'Surface / Sub-Dermal',
            coords: [0.1, 0.7, 0.85],
            telemetry: 'Refractive Index: Variable (1.33–2.42) • Spectrum: Full Iridescent / Obsidian',
            description: 'Unlike the fixed pigment of the six common breeds, Andarna’s scales contain microscopic crystalline guanine platelets coupled to her nervous system. By altering platelet spacing, her hide shifts from shimmering gold to deep violet-black, blending seamlessly into shadows or stone.',
            xrayInsight: 'Sub-dermal X-ray reveals seven distinct harmonic nodes along her spine—the anatomical signature of the Seventh Breed.'
          },
          {
            id: 'andarna-wings',
            title: 'Developing Wing Joint & Harness Anchor',
            layer: 'Skeletal & Biomechanical',
            coords: [-0.15, 1.15, 1.9],
            telemetry: 'Ossification: 78% Complete • Stabilization: Custom Saddle Assist',
            description: 'Rapid growth during the Dreamless Sleep elongated Andarna’s wing phalanges faster than her pectoral tendons could fully calcify. X-ray analysis highlights the delicate scapular socket that inspired Violet to engineer a specialized prosthetic flight harness.',
            xrayInsight: 'A mirror-parallel to Violet’s own hypermobile joints—two partners adapting biomechanics through intellect rather than brute conformity.'
          },
          {
            id: 'andarna-tail',
            title: 'Feathertail Plume Ossicles',
            layer: 'Osteology',
            coords: [-2.9, 0.2, 0.0],
            telemetry: 'Aerodynamic Rudder Efficiency: 99.4% • Metamorphosis: Scorpion-Grade',
            description: 'Flexible fan-like cartilaginous vanes at the tail tip provide unmatched aerial agility before hardening into a lethal adult weapon after maturation.',
            xrayInsight: 'Calcification fronts are visible migrating down the caudal vertebrae.'
          }
        ]
      },
      {
        id: 'wyvern',
        name: 'Corrupted Wyvern Specimen',
        classification: 'Venin Construct • Two-Legged Dark-Magic Chimera',
        wingspan: '112 ft (34.1 m)',
        biteForce: '34,000 PSI',
        coreTemp: 'Ambient / Necrotic Runic Heat',
        signetOutput: 'Blue/Green Desiccation Flame (Channeled from Earth)',
        themeColor: '#ff2a4b',
        secondaryColor: '#9e0b22',
        summary: 'Officially dismissed as folklore by Navarrian command for centuries. X-ray tomography exposes the terrifying anatomical distinction between a true dragon of the Vale and a wyvern: only two hind legs (forelimbs fused into wings), zero organic bond nexus, and a carved granite Rune Stone suspended inside its ribcage in place of a living arcane heart.',
        hotspots: [
          {
            id: 'wyvern-runestone',
            title: 'Embedded Dark-Magic Rune Stone (The Core)',
            layer: 'Deep Thoracic X-Ray',
            coords: [0.25, 0.35, 0.0],
            telemetry: 'Origin: Tyrrish-Derived Complex Runes • Power Source: Venin Tether',
            description: 'Where a true dragon houses a four-chambered beating heart, the wyvern’s sternum cages a heavy granite boulder etched with interlocking tempering and animation runes. If a rider’s lightning or dragon’s jaws shatter this stone—or if the creating venin is slain—the entire creature collapses instantaneously.',
            xrayInsight: 'CRITICAL DISCOVERY: The runes are layered in multi-tier matrices once thought lost after the Great War.'
          },
          {
            id: 'wyvern-biped',
            title: 'Bipedal Forelimb-Wing Fusion (No Front Legs)',
            layer: 'Skeletal Comparison',
            coords: [0.5, -0.35, 0.65],
            telemetry: 'Limb Count: 2 Hind Legs + 2 Wing-Arms (Wyvern Classification)',
            description: 'The definitive anatomical proof separating dragons (four legs plus two independent wings) from wyvern (two hind legs with forelimbs elongated into wings). Their pectoral girdle lacks the anterior leg sockets found in Tairn and Andarna.',
            xrayInsight: 'Crimson necrotic filaments replace normal blood vessels, feeding stolen ground-magic directly from the rune stone to the wing muscles.'
          },
          {
            id: 'wyvern-throat',
            title: 'Corrupted Azure/Cobalt Flame Conduit',
            layer: 'Internal Conduit',
            coords: [2.1, 0.85, 0.0],
            telemetry: 'Flame Spectrum: Cobalt / Emerald • Toxicity: High',
            description: 'Instead of biological hypergolic glands, a hollow runic siphon channels raw magic directly from the chest stone up the esophagus, venting unnatural blue or green fire.',
            xrayInsight: 'The bone around the jaw shows brittle necrotic fracturing from unshielded dark magic.'
          }
        ]
      }
    ]
  },

  rider: {
    id: 'rider',
    title: 'THE RIDER’S CONDUIT & RELIC BIOMECHANICS',
    subtitle: 'Neural Signet Pathways, Relic Inscriptions & Skeletal Adaptation',
    specimens: [
      {
        id: 'violet',
        name: 'Violet Sorrengail',
        classification: 'Dual-Bonded Rider • Second Wing, Fourth Squad, Flame Section',
        signet: 'Pure Power / Lightning Wielder (Tairn) + Second Signet Resonator (Andarna)',
        heartRate: '118 BPM (Channeling)',
        conduitVoltage: '1.2 Billion Volts (Peak Discharge)',
        themeColor: '#7ce8ff',
        secondaryColor: '#f4c55c',
        summary: 'Trained for the Scribe Quadrant, forged in the Riders Quadrant. Under X-ray vision, Violet’s anatomy tells a remarkable story of resilience: hypermobile joints and fragile connective collagen braced externally by custom dragon-scale armor, while internally her nervous system serves as a living superconductor for the most destructive lightning signet seen in centuries.',
        hotspots: [
          {
            id: 'violet-eds',
            title: 'Hypermobile Joint Matrix & Dragon-Scale Armor Bracing',
            layer: 'Skeletal & Connective Biomechanics',
            coords: [-0.42, 0.72, 0.15],
            telemetry: 'Collagen Elasticity: Hypermobile (EDS Profile) • Armor: Green Dragon-Scale Weave',
            description: 'X-ray osteology highlights laxity in the glenohumeral (shoulder), costochondral (rib), and patellar articulations—causing frequent subluxations under heavy physical torque. Surrounding her torso is Mira’s masterwork: overlapping scale plates harvested from Teine that act as an external exoskeleton without restricting pulmonary expansion or throwing mobility.',
            xrayInsight: 'Rather than "curing" her anatomy, magic flows alongside her adaptations—proving that accommodation, intellect, and custom engineering belong at the apex of dragon riding.'
          },
          {
            id: 'violet-relic',
            title: 'Dorsal Twin-Dragon Relic Transformer',
            layer: 'Dermal & Sub-Dermal Arcane Layer',
            coords: [0.0, 0.68, -0.26],
            telemetry: 'Inscriptions: Black Morningstartail + Golden Feathertail • Flux: Dual-Channel',
            description: 'Etched between her shoulder blades during Threshing, the metallic pigment of her dragon relics extends three millimeters into the dermis, interfacing directly with the dorsal root ganglia of her spinal cord. In X-ray view, the two relics form a biological step-up transformer that regulates Tairn’s massive power and Andarna’s golden resonance.',
            xrayInsight: 'Without the relic’s dermal distribution lattice, channeling Tairn’s full wattage would instantly carbonize human tissue.'
          },
          {
            id: 'violet-lightning',
            title: 'Lichtenberg Neural-Vascular Signet Conduit',
            layer: 'Arcane Nervous System',
            coords: [0.58, 0.35, 0.22],
            telemetry: 'Core Temp while Wielding: 40.8 °C • Insulation: Myelin-Arcane Sheath',
            description: 'When Violet opens the mental gate to Tairn, raw power surges from the occipital bond anchor down the vagus and brachial nerves into her palms. Under X-ray, her arteries and nerves blaze with branching fractal lightning (Lichtenberg patterns), pushing her core body temperature to the brink of thermal burnout.',
            xrayInsight: 'Notice how the discharge concentrates at the fingertips and couples inductively into the alloy-core daggers strapped to her ribs and thighs.'
          },
          {
            id: 'violet-cranial',
            title: 'The Archives Grounding Vault & Mental Shields',
            layer: 'Cranial Cortex',
            coords: [0.0, 1.52, 0.05],
            telemetry: 'Shield Architecture: Stone Archives Vault • Tethers: 3 Active (Tairn, Andarna, Xaden)',
            description: 'At the base of the skull, three distinct luminous pathways converge: Tairn’s roaring storm-blue channel, Andarna’s iridescent gold thread, and the smoky obsidian bridge linking her mind directly to Xaden Riorson.',
            xrayInsight: 'When grounded, excess electrical potential vents harmlessly through her silver-tipped braid due to chronic high-energy exposure.'
          }
        ]
      },
      {
        id: 'xaden',
        name: 'Xaden Riorson',
        classification: 'Wingleader (Fourth Wing) • Bonded to Sgaeyl (Blue Daggertail)',
        signet: 'Shadow Wielder + Classified Intinnsic (Intent Reader)',
        heartRate: '64 BPM (Combat Calm)',
        conduitVoltage: 'Abyssal Umbral Field / Dual-Signet Resonance',
        themeColor: '#8a64ff',
        secondaryColor: '#38b6ff',
        summary: 'Son of Fen Riorson and bearer of 107 rebellion obligations etched into his flesh. X-ray tomography reveals how his rebellion relic—originally intended by Codagh’s fire to mark the children of treason—was secretly fortified by protective Tyrrish blood-runes, alongside the dual neural signature of a Shadow Wielder and a second, lethal Intinnsic signet.',
        hotspots: [
          {
            id: 'xaden-relic',
            title: 'The 107 Rebellion Relic & Protective Rune Matrix',
            layer: 'Dermal & Osteo-Runic Layer',
            coords: [-0.52, 0.45, 0.18],
            telemetry: 'Inscribed Marks: 107 • Origin: Codagh’s Fire + Col. Mairi’s Protection Stone',
            description: 'Swirling from his left wrist up his bicep and across his collarbone to his jaw, the rebellion relic carries 107 subtle crystalline nodes—one for every child of the separatist leaders whose loyalty Xaden vouched for with his own skin. Deep X-ray reveals micro-harmonic runic shielding woven into the scar tissue by Liam’s mother’s river-stone rune.',
            xrayInsight: 'Because each marked child held a runed stone at the moment of Codagh’s breath, Melgren’s battle-foresight signet is completely blinded whenever three or more Marked Ones gather!'
          },
          {
            id: 'xaden-shadows',
            title: 'Brachial Umbral Conduit (Shadow Manipulation)',
            layer: 'Arcane Vascular System',
            coords: [0.55, 0.28, 0.2],
            telemetry: 'Matter State: Tangible Compressed Darkness • Range: Battlefield-Wide',
            description: 'Unlike illusionists, Xaden’s shadows possess physical mass and tensile strength. X-ray imaging shows dark-matter filaments coiling around his radius and ulna bones, drawing ambient absence-of-light into kinetic blades, barriers, and sensory extensions that can hear and feel across rooms.',
            xrayInsight: 'The shadows instinctively angle toward Violet’s position even when Xaden is at rest.'
          },
          {
            id: 'xaden-intinnsic',
            title: 'Classified Prefrontal Node: The Second Signet',
            layer: 'Deep Cranial X-Ray (Restricted)',
            coords: [0.0, 1.56, 0.08],
            telemetry: 'Classification: CAPITAL OFFENSE (Intinnsic — Intent Perception)',
            description: 'Because Sgaeyl previously bonded Xaden’s grandfather (recorded as an uncle in forged rolls), the direct familial bond manifested a second signet. Deep cranial X-ray exposes a secondary violet halo in the prefrontal cortex that reads the immediate *intentions* of anyone whose mental shields are unguarded.',
            xrayInsight: 'Triple-layered obsidian mental shields obscure this node from every mind-reader in Navarre.'
          }
        ]
      }
    ]
  },

  basgiath: {
    id: 'basgiath',
    title: 'BASGIATH WAR COLLEGE & THE WARDSTONE',
    subtitle: 'Architectural Cutaway, Subterranean Ley-Lines & Venin Corruption',
    specimens: [
      {
        id: 'citadel',
        name: 'Basgiath Citadel & The Subterranean Wardstone',
        classification: 'Fortress Astride the Rift • Navarre’s Central Arcane Anchor',
        wingspan: 'Span: 1.4 Miles Across the Canyon',
        biteForce: 'Ward Radius: ~400 Miles (Failing at Borders)',
        coreTemp: 'Wardstone Core: Dormant / Active',
        signetOutput: 'Seven-Breed Geodesic Ward Lattice',
        themeColor: '#f4c55c',
        secondaryColor: '#ff2a4b',
        summary: 'Carved directly into two jagged mountain peaks straddling a wind-scoured abyss. On the surface, Basgiath appears to be an impregnable granite military academy divided into four quadrants. Under X-ray stratigraphy, the mountain reveals its buried truths: the ancient iron Wardstone Chamber deep inside the bedrock, secret weapons-smuggling tunnels, and crimson venin desiccation creeping toward the fractures.',
        hotspots: [
          {
            id: 'basgiath-wardstone',
            title: 'The Subterranean Wardstone Chamber',
            layer: 'Deep Bedrock X-Ray (-850 ft)',
            coords: [0.0, -1.15, 0.0],
            telemetry: 'Composition: Black Runed Iron • Required Ignition: 7 Dragon Breeds',
            description: 'Hidden hundreds of feet beneath the Riders Quadrant lies a cavernous vault housing the massive black-iron Wardstone. Etched with ancient Unification runes, it acts as the central projector for Navarre’s protective dome—blocking all non-dragon magic (including venin and gryphon flyers) within its perimeter.',
            xrayInsight: 'X-ray spectral analysis shows SIX active rune channels and ONE dormant seventh harmonic—proving the First Six journals mistranslated "six and the one" when it truly meant seven breeds!'
          },
          {
            id: 'basgiath-parapet',
            title: 'The Parapet (Riders Quadrant Entrance)',
            layer: 'Structural Engineering & Wind Shear',
            coords: [0.0, 0.55, 1.55],
            telemetry: 'Length: 220 ft • Width: 18 inches • Drop: 200+ ft into the Rift',
            description: 'A narrow, unrailed stone span bridging the chasm between the Turrets and the Riders Citadel. X-ray structural scan reveals internal hairline frost-fractures in the central keystone blocks and visualizes the lethal vortex crosswinds funneled upward by the canyon walls.',
            xrayInsight: 'Click "LAUNCH PARAPET TRIAL" in the top bar to experience crossing the Parapet in first-person 3D with X-ray Second-Sight!'
          },
          {
            id: 'basgiath-archives',
            title: 'The Archives & Classified Sub-Vaults',
            layer: 'Subterranean Levels 1–5',
            coords: [-1.85, 0.35, -0.6],
            telemetry: 'Security: Hermetic Stone Doors • Contents: Pre-Unification Journals',
            description: 'While the upper rotunda houses sanitized histories curated by Markham, X-ray penetration exposes five deeper sub-levels cut into the western peak—including the hidden vault containing Warrick’s and Lyra’s original journals and Papa Sorrengail’s hidden feather-tail notes.',
            xrayInsight: 'Notice the faint mage-light conduit lines trailing from the sub-vaults toward the Riders dormitories.'
          },
          {
            id: 'basgiath-tunnels',
            title: 'Marked Ones’ Clandestine Smuggling Tunnels',
            layer: 'Hidden Sub-Strata',
            coords: [1.35, -0.35, 0.85],
            telemetry: 'Cargo: Talladium-Alloy Daggers • Shielding: Unpowered Mage-Light Crates',
            description: 'Forgotten maintenance and drainage shafts threading from the forge underbelly out to the cliffside flight field. Used by Xaden, Garrick, Bodhi, and Violet to run weapons to the gryphon flyers fighting venin along the unshielded border.',
            xrayInsight: 'Alloy signatures glow bright cyan inside the mountain passage.'
          },
          {
            id: 'basgiath-venin',
            title: 'Venin Desiccation Veins (Beyond the Ward Line)',
            layer: 'Geomagical Corruption Scan',
            coords: [2.75, -0.85, -1.1],
            telemetry: 'Magic Depletion: 94% • Threat: Sage / Maven Infiltration',
            description: 'Where the golden Ward Ley-Lines terminate at the eastern ridge, crimson necrotic veins branch through the earth. Here, dark wielders draw raw power directly from the ground instead of through a dragon bond—draining the bedrock into brittle gray ash and corrupting the soul.',
            xrayInsight: 'A faint crimson thread is already probing beneath the outer foundation of the college.'
          }
        ]
      }
    ]
  }
};

export const QUIZ_QUESTIONS = [
  {
    question: 'As you step onto the rain-slicked stone of the Parapet with a 200-foot drop below, what governs your first stride?',
    options: [
      {
        text: 'Calculated physics—I test the friction of my boots, lower my center of gravity, and time the wind gusts.',
        weights: { tairn: 3, andarna: 3, blue: 1, green: 2 }
      },
      {
        text: 'Unrelenting defiance—the storm and the cadets behind me are just obstacles to conquer.',
        weights: { tairn: 3, blue: 3, red: 2 }
      },
      {
        text: 'Quiet observation—I watch where the stone crumbles under the boot ahead of me and adapt instantly.',
        weights: { andarna: 3, green: 3, brown: 2 }
      },
      {
        text: 'Unpredictable daring—I move fast before fear or hesitation can take root.',
        weights: { red: 3, orange: 3, blue: 1 }
      }
    ]
  },
  {
    question: 'In the Archives at midnight, you uncover a pre-Unification journal that contradicts everything Navarre teaches. What do you do?',
    options: [
      {
        text: 'Translate every rune in secret, cross-reference the ward schematics, and weaponize the truth to save people outside the borders.',
        weights: { tairn: 3, andarna: 4 }
      },
      {
        text: 'Build a covert network of trusted allies to smuggle weapons and intelligence to the front lines immediately.',
        weights: { blue: 4, tairn: 2 }
      },
      {
        text: 'Analyze the tactical vulnerabilities carefully so our squad survives when the wards inevitably falter.',
        weights: { green: 4, brown: 3 }
      },
      {
        text: 'Use the forbidden knowledge to test the limits of my own signet in the sparring ring.',
        weights: { red: 3, orange: 3 }
      }
    ]
  },
  {
    question: 'During Threshing in the canyon clearing, three armed cadets corner a smaller, golden juvenile dragon. How do you intervene?',
    options: [
      {
        text: 'Step directly between the blades and the dragon—even if I am outmatched in raw size, I have daggers, terrain, and willpower.',
        weights: { tairn: 4, andarna: 4 }
      },
      {
        text: 'Strike from the shadows before they realize they are being hunted, dismantling their leader first.',
        weights: { blue: 4, orange: 2 }
      },
      {
        text: 'Disarm them with precise biomechanics and force them to yield without wasting unnecessary blood.',
        weights: { green: 3, brown: 4 }
      },
      {
        text: 'Meet their aggression head-on with overwhelming offense until the clearing is mine.',
        weights: { red: 4, tairn: 2 }
      }
    ]
  },
  {
    question: 'When the dragon’s golden eyes lock onto yours and its mind presses against your shields, what truth does it find inside you?',
    options: [
      {
        text: 'That physical fragility never meant weakness—my mind and loyalty are unbreakable iron.',
        weights: { tairn: 4, andarna: 3 }
      },
      {
        text: 'That I will carry a hundred scars on my own back to protect the people I swore to defend.',
        weights: { blue: 4, brown: 2 }
      },
      {
        text: 'That I question every order, seek hidden history, and refuse to let innocent lives be erased.',
        weights: { andarna: 4, green: 3 }
      },
      {
        text: 'That I burn with an untamed storm that refuses to bow to any wingleader or king.',
        weights: { red: 4, orange: 3, tairn: 2 }
      }
    ]
  }
];

export const DRAGON_RESULTS = {
  tairn: {
    breed: 'Black Morningstartail (Lineage of Tairneanach)',
    rarity: 'ULTRA-RARE (Only 2 Alive on the Continent)',
    signet: 'Pure Atmospheric Lightning & High-Energy Conduit',
    colorHex: '#38b6ff',
    secondaryHex: '#c4f5ff',
    specimenId: 'tairn',
    quote: '“I know exactly who and what you are.”',
    description: 'Black dragons are the rarest, largest, and most lethal on the Continent—combining the cunning intellect of a scribe with ferocious battlefield supremacy. Your X-ray resonance reveals high-voltage neural pathways capable of channeling raw sky-fire.'
  },
  andarna: {
    breed: 'Iridescent Seventh Breed (Lineage of Andarnaurram)',
    rarity: 'MYTHIC SINGULARITY (The Missing Seventh Flame)',
    signet: 'Chrono-Spatial Resonance & Ward Ignition',
    colorHex: '#f4c55c',
    secondaryHex: '#ff9e44',
    specimenId: 'andarna',
    quote: '“I waited six centuries to hatch for someone who values truth over comfort.”',
    description: 'Your mind bridges ancient lore and compassionate courage. Under X-ray tomography, your bond tether shimmers with iridescent seven-spectrum harmonics—the exact frequency needed to restore the ancient wards.'
  },
  blue: {
    breed: 'Blue Daggertail (Lineage of Sgaeyl)',
    rarity: 'RARE (Ruthless & Uncompromising)',
    signet: 'Abyssal Shadow Manipulation & Intent Perception',
    colorHex: '#4b7bff',
    secondaryHex: '#9d65ff',
    specimenId: 'tairn',
    quote: '“Blues do not care about rules—only relentless capability and loyalty to the chosen few.”',
    description: 'Calculating, fierce, and fiercely protective beneath obsidian mental shields. Your X-ray scan reveals dense umbral filaments coiling along your forearms and a guarded dual-node cortex.'
  },
  green: {
    breed: 'Green Swordtail (Lineage of Teine)',
    rarity: 'TACTICAL APEX (Keen Intellect & Precision)',
    signet: 'Ward Extension & Atmospheric Barrier Weaving',
    colorHex: '#2ee68a',
    secondaryHex: '#a3ffcf',
    specimenId: 'tairn',
    quote: '“Sharp-minded, observant, and impossible to outmaneuver in a storm.”',
    description: 'Greens prize riders who think three moves ahead in the chaos of war. Your X-ray resonance highlights a balanced cardio-neural circuit capable of projecting protective ward domes around your entire squad.'
  },
  red: {
    breed: 'Red Scorpiontail (Lineage of Thoirt)',
    rarity: 'FEROCIOUS (Quick-Tempered & Devastating)',
    signet: 'Pyro-Kinetic Thermal Surge',
    colorHex: '#ff3b5c',
    secondaryHex: '#ff9e44',
    specimenId: 'tairn',
    quote: '“Never insult a Red—and never stand in front of its rider.”',
    description: 'Fierce, passionate, and first into the breach. Your X-ray scan shows superheated arterial conduits and a high-impulse reflex arc built for close-quarters aerial dominance.'
  }
};
