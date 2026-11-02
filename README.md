# FOURTH WING: CODEX OCULUS — 3D X-Ray Tomography Archive of Basgiath

An interactive, ultra-realistic dark cinematic 3D web experience inspired by *Fourth Wing* (The Empyrean Series) by Rebecca Yarros. Built with custom GLSL dual-layer X-Ray shaders, procedural 3D osteology & architecture, UnrealBloom post-processing, and a procedural Web Audio API storm & telemetry soundscape.

---

## ✨ Key Features

### 1. Real-Time 3D X-Ray Oculus Scanner (`js/xrayShader.js`)
- **Draggable / Cursor-Tracked 3D X-Ray Lens**: Sweep the arcane Oculus reticle over any 3D model to dissolve exterior scales, dragon-scale armor, or mountain granite in real time—with a blazing cyan/gold plasma dispersion rim.
- **3-Layer Tomography Depth Slider**:
  - `0% — Exterior Surface`: Battle-scarred obsidian scales, flight leathers, or chiseled granite.
  - `50% — Vascular & Arcane Signet Conduits`: Animated plasma waves pulsing through arteries, Lichtenberg lightning nerves, and underground smuggling tunnels.
  - `100% — Deep Osteology & Core`: High-contrast radiograph Fresnel bone rendering, articulated vertebrae, ribcages, metacarpal wing struts, and heart/Wardstone cores.
- **Double-Click Lens Lock & Full Tomography Override**: Pin the X-ray lens at any coordinate by double-clicking, or toggle full-specimen X-ray tomography.

### 2. Three Distinct 3D Scan Modes (`js/models3D.js`, `js/loreData.js`)
- **Mode 01 • Dragon Anatomy (`Tairn`, `Andarna`, `Corrupted Wyvern`)**:
  - **Tairneanach (Tairn)**: Articulated skull & horns, 36 vertebrae, 12 pairs of thoracic ribs, 5-ray hollow metacarpal wing bones, bifurcated pyro-chemical ignition sacs, four-chambered magma heart anchored to the quaternary mated bond tether, and his 18-spike **Morningstartail** club mace.
  - **Andarnaurram (Andarna)**: Juvenile/adolescent chrono-resonant pineal gland, iridescent 7th-breed dermal prism nodes, developing wing socket biomechanics, and golden **Feathertail** plume ossicles.
  - **Venin Wyvern Specimen**: Anatomical proof of the lore distinction—**two hind legs only** (forelimbs fused into wings), zero biological heart, and a carved **Dark-Magic Rune Stone** suspended inside its ribcage.
- **Mode 02 • The Rider's Conduit (`Violet Sorrengail`, `Xaden Riorson`)**:
  - **Violet Sorrengail**: Highlights her **EDS (Ehlers-Danlos Syndrome) hypermobile joints** braced externally by Mira's woven green dragon-scale corset, her dorsal twin-dragon relic transformer, her silver-tipped braid, and branching Lichtenberg lightning conduits surging from her cranial bond nexus to her palms.
  - **Xaden Riorson**: Reveals the **107 Rebellion Relic** spiraling up his left arm—fortified by Col. Mairi's protective river-stone runes that blind Melgren's foresight when 3+ Marked Ones gather—alongside coiling umbral shadow conduits and his classified prefrontal **Intinnsic** second signet node.
- **Mode 03 • Basgiath War College & The Wards**:
  - Cutaway scan of the twin peaks straddling the Rift, **The Parapet**, the **Archives & Sub-Vaults (Levels 1–5)**, the **Marked Ones' Smuggling Tunnels**, the subterranean **Black-Iron Wardstone Chamber** with 6 active breed pillars + the 7th breed harmonic, and creeping crimson **Venin Desiccation Veins** outside the eastern perimeter.

### 3. Interactive Experiences
- **🎬 Cinematic Camera Fly-Through**: Automated orbital camera choreography with synchronized storm lightning and X-ray sweeps.
- **🐉 Find Your Dragon (Threshing Resonance Quiz)**: A 4-stage tactical & psychological trial that determines your bonded dragon lineage and re-renders the live 3D X-Ray Dragon in your bond's spectrum.
- **⚔ The Parapet & Threshing Trial Mini-Game (`js/parapetGame.js`)**: First-person/over-the-shoulder 3D crossing of the rain-slicked 18-inch Parapet over a 200-foot chasm. Use **Second-Sight X-Ray Pulses (`SPACE`)** to spot internal red frost-fractures inside the stone blocks, leap over faulty stones (`E` / `SHIFT`), and counter canyon crosswinds (`A` / `D`).
- **🔊 Procedural Web Audio API Storm & Telemetry (`js/audioEngine.js`)**: Zero external audio files required—synthesizes dark cello storm drones, rolling thunderclaps, draconic sub-bass heartbeats, and pitch-reactive X-ray scanner hum in real time.

---

## 🚀 Quick Start

1. Double-click [`launch.bat`](./launch.bat) or run from a terminal inside this folder:
   ```powershell
   python -m http.server 8080
   ```
2. Open **http://localhost:8080** in your browser.
