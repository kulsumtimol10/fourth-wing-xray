// ============================================================================
// FOURTH WING: CODEX OCULUS — Main 3D Engine & UI Controller
// ============================================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import { SCAN_MODES, QUIZ_QUESTIONS, DRAGON_RESULTS } from './loreData.js';
import { ArcaneAudioEngine } from './audioEngine.js';
import { sharedUniforms } from './xrayShader.js';
import {
  buildDragonModel,
  buildRiderModel,
  buildBasgiathModel
} from './models3D.js';
import { ParapetMiniGame } from './parapetGame.js';

class FourthWingOculusApp {
  constructor() {
    this.canvasContainer = document.getElementById('viewport-container');
    this.reticleEl = document.getElementById('xray-reticle');
    this.hotspotsContainer = document.getElementById('hotspots-layer');

    this.audio = new ArcaneAudioEngine();

    this.currentModeId = 'dragon';
    this.currentSpecimenId = 'tairn';
    this.currentModel = null;
    this.customQuizColors = null;

    // Smooth mouse tracking for Oculus X-Ray Lens
    this.targetLensUV = new THREE.Vector2(0.5, 0.5);
    this.currentLensUV = new THREE.Vector2(0.5, 0.5);
    this.mousePx = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
    this.isLensPinned = false;

    // Camera fly-through animation state
    this.isFlythroughActive = false;
    this.flythroughTime = 0;
    this.cameraLerpTargetPos = null;
    this.cameraLerpLookAt = null;

    // Quiz state
    this.quizStep = 0;
    this.quizScores = { tairn: 0, andarna: 0, blue: 0, green: 0, red: 0, brown: 0, orange: 0 };

    this.clock = new THREE.Clock();
    this._initThree();
    this._initAtmosphere();
    this.parapetGame = new ParapetMiniGame(
      this.scene,
      this.camera,
      this.controls,
      this.audio,
      () => this.exitParapetGame()
    );

    this._loadSpecimen('dragon', 'tairn');
    this._bindUIEvents();
    this._animate();
  }

  _initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#05070c');
    this.scene.fog = new THREE.FogExp2('#060911', 0.068);

    this.camera = new THREE.PerspectiveCamera(
      46,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );
    this.camera.position.set(2.8, 1.6, 5.4);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.canvasContainer.appendChild(this.renderer.domElement);

    // Post-processing UnrealBloom for glowing X-ray bones, signet conduits & embers
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.78, // strength
      0.45, // radius
      0.22  // threshold
    );
    this.composer.addPass(this.bloomPass);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxDistance = 14;
    this.controls.minDistance = 1.6;
    this.controls.target.set(0, 0.35, 0);

    // Dramatic dark cinematic lighting
    const ambient = new THREE.AmbientLight('#192338', 1.4);
    this.scene.add(ambient);

    this.keyLight = new THREE.DirectionalLight('#7ce8ff', 2.6);
    this.keyLight.position.set(5, 8, 6);
    this.scene.add(this.keyLight);

    this.rimLight = new THREE.DirectionalLight('#f4c55c', 1.8);
    this.rimLight.position.set(-6, -3, -5);
    this.scene.add(this.rimLight);

    this.modelContainer = new THREE.Group();
    this.scene.add(this.modelContainer);
  }

  _initAtmosphere() {
    // 1. Floating Ember & Storm Ash Particle System
    const count = 650;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    this.particleSpeeds = new Float32Array(count);

    const cGold = new THREE.Color('#f4c55c');
    const cCyan = new THREE.Color('#38b6ff');
    const cCrimson = new THREE.Color('#ff3b5c');

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
      this.particleSpeeds[i] = 0.25 + Math.random() * 0.75;

      const pick = Math.random();
      const col = pick < 0.55 ? cGold : pick < 0.9 ? cCyan : cCrimson;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.emberParticles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.emberParticles);

    // 2. Subtle Arcane Astrolabe Floor Grid under the Specimen
    const gridHelper = new THREE.PolarGridHelper(4.8, 16, 8, 64, '#1b2b44', '#101929');
    gridHelper.position.y = -1.65;
    this.scene.add(gridHelper);
    this.floorGrid = gridHelper;

    // 3. Procedural 3D Storm Lightning Bolt Mesh
    this.lightningGroup = new THREE.Group();
    this.scene.add(this.lightningGroup);
  }

  triggerStormLightning(playSound = true) {
    sharedUniforms.uLightningFlash.value = 1.35;
    if (playSound) {
      this.audio.playThunderAndLightning();
    }

    // Build a jagged 3D lightning bolt across the background sky
    while (this.lightningGroup.children.length > 0) {
      this.lightningGroup.remove(this.lightningGroup.children[0]);
    }

    const boltPts = [];
    let curr = new THREE.Vector3((Math.random() - 0.5) * 8, 6.5, -4 - Math.random() * 4);
    boltPts.push(curr.clone());
    for (let i = 0; i < 10; i++) {
      curr = curr.clone().add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 1.4,
          -1.05,
          (Math.random() - 0.5) * 0.8
        )
      );
      boltPts.push(curr);
    }
    const curve = new THREE.CatmullRomCurve3(boltPts);
    const geo = new THREE.TubeGeometry(curve, 24, 0.045, 6, false);
    const mat = new THREE.MeshBasicMaterial({
      color: '#c4f5ff',
      transparent: true,
      opacity: 0.95
    });
    const boltMesh = new THREE.Mesh(geo, mat);
    this.lightningGroup.add(boltMesh);
  }

  _loadSpecimen(modeId, specimenId = null, customQuizColors = null) {
    this.currentModeId = modeId;
    const modeData = SCAN_MODES[modeId];
    const specList = modeData.specimens;
    const chosenSpec = specimenId
      ? specList.find((s) => s.id === specimenId) || specList[0]
      : specList[0];

    this.currentSpecimenId = chosenSpec.id;
    this.customQuizColors = customQuizColors;

    // Update shader theme colors
    sharedUniforms.uThemeColor.value.set(customQuizColors?.colorHex || chosenSpec.themeColor);
    sharedUniforms.uSecondaryColor.value.set(customQuizColors?.secondaryHex || chosenSpec.secondaryColor);

    // Clear previous 3D model
    while (this.modelContainer.children.length > 0) {
      this.modelContainer.remove(this.modelContainer.children[0]);
    }

    // Build new 3D model
    if (modeId === 'dragon') {
      this.currentModel = buildDragonModel(chosenSpec.id, customQuizColors);
      this.cameraLerpTargetPos = new THREE.Vector3(2.8, 1.5, 5.3);
      this.cameraLerpLookAt = new THREE.Vector3(0.2, 0.45, 0);
    } else if (modeId === 'rider') {
      this.currentModel = buildRiderModel(chosenSpec.id);
      this.cameraLerpTargetPos = new THREE.Vector3(0.0, 0.85, 4.2);
      this.cameraLerpLookAt = new THREE.Vector3(0.0, 0.45, 0);
    } else if (modeId === 'basgiath') {
      this.currentModel = buildBasgiathModel();
      this.cameraLerpTargetPos = new THREE.Vector3(0.0, 1.9, 6.2);
      this.cameraLerpLookAt = new THREE.Vector3(0.0, -0.2, 0);
    }

    this.modelContainer.add(this.currentModel);

    // Populate UI header, specimen tabs, telemetry readout & 3D hotspots
    this._renderSpecimenUI(modeData, chosenSpec);
    this._buildHotspots(chosenSpec);
  }

  _renderSpecimenUI(modeData, spec) {
    document.getElementById('hud-mode-title').textContent = modeData.title;
    document.getElementById('hud-mode-subtitle').textContent = modeData.subtitle;
    document.getElementById('specimen-name').textContent = spec.name;
    document.getElementById('specimen-class').textContent = spec.classification;
    document.getElementById('specimen-summary').textContent = spec.summary;

    // Telemetry grid
    const statsGrid = document.getElementById('telemetry-stats');
    if (this.currentModeId === 'rider') {
      statsGrid.innerHTML = `
        <div class="stat-box"><span class="stat-label">AWAKENED SIGNET</span><span class="stat-val">${spec.signet}</span></div>
        <div class="stat-box"><span class="stat-label">CARDIAC OUTPUT</span><span class="stat-val">${spec.heartRate}</span></div>
        <div class="stat-box"><span class="stat-label">CONDUIT POTENTIAL</span><span class="stat-val">${spec.conduitVoltage}</span></div>
      `;
    } else {
      statsGrid.innerHTML = `
        <div class="stat-box"><span class="stat-label">SPAN / SCALE</span><span class="stat-val">${spec.wingspan}</span></div>
        <div class="stat-box"><span class="stat-label">FORCE / RADIUS</span><span class="stat-val">${spec.biteForce}</span></div>
        <div class="stat-box"><span class="stat-label">CORE THERMAL</span><span class="stat-val">${spec.coreTemp}</span></div>
        <div class="stat-box"><span class="stat-label">ARCANE OUTPUT</span><span class="stat-val">${spec.signetOutput}</span></div>
      `;
    }

    // Specimen selector pills
    const subTabs = document.getElementById('specimen-tabs');
    subTabs.innerHTML = '';
    modeData.specimens.forEach((s) => {
      const btn = document.createElement('button');
      btn.className = `specimen-pill ${s.id === spec.id ? 'active' : ''}`;
      btn.textContent = s.name;
      btn.addEventListener('click', () => {
        this.audio.playPulseChime(1.2);
        this._loadSpecimen(this.currentModeId, s.id);
      });
      subTabs.appendChild(btn);
    });

    // Select first hotspot card by default
    if (spec.hotspots && spec.hotspots.length > 0) {
      this._showHotspotCard(spec.hotspots[0], false);
    }
  }

  _buildHotspots(spec) {
    this.hotspotsContainer.innerHTML = '';
    this.activeHotspots = [];

    (spec.hotspots || []).forEach((h, idx) => {
      const pin = document.createElement('button');
      pin.className = 'hotspot-pin';
      pin.innerHTML = `
        <span class="hotspot-index">0${idx + 1}</span>
        <span class="hotspot-label">${h.title}</span>
      `;
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audio.playPulseChime(1.35);
        this._focusOnHotspot(h, pin);
      });
      this.hotspotsContainer.appendChild(pin);
      this.activeHotspots.push({
        data: h,
        el: pin,
        worldPos: new THREE.Vector3(...h.coords)
      });
    });
  }

  _focusOnHotspot(hotspot, pinEl) {
    document.querySelectorAll('.hotspot-pin').forEach((p) => p.classList.remove('selected'));
    if (pinEl) pinEl.classList.add('selected');

    const target = new THREE.Vector3(...hotspot.coords);
    this.cameraLerpLookAt = target.clone();
    const offset = new THREE.Vector3(0.8, 0.55, 2.75);
    this.cameraLerpTargetPos = target.clone().add(offset);

    // Ensure X-Ray depth is deep enough to inspect the hotspot
    if (sharedUniforms.uXrayDepth.value < 0.65) {
      sharedUniforms.uXrayDepth.value = 0.88;
      const slider = document.getElementById('xray-depth-slider');
      if (slider) slider.value = 88;
      document.getElementById('xray-depth-val').textContent = '88% (DEEP SKELETAL)';
    }

    this._showHotspotCard(hotspot, true);
  }

  _showHotspotCard(hotspot, animatePulse = false) {
    const card = document.getElementById('lore-codex-card');
    document.getElementById('codex-layer-tag').textContent = hotspot.layer;
    document.getElementById('codex-title').textContent = hotspot.title;
    document.getElementById('codex-telemetry').textContent = hotspot.telemetry;
    document.getElementById('codex-desc').textContent = hotspot.description;
    document.getElementById('codex-xray-insight').textContent = hotspot.xrayInsight;

    if (animatePulse) {
      card.classList.remove('pulse-highlight');
      void card.offsetWidth;
      card.classList.add('pulse-highlight');
    }
  }

  startCinematicFlythrough() {
    this.audio.resume();
    this.triggerStormLightning(true);
    this.isFlythroughActive = !this.isFlythroughActive;
    this.flythroughTime = 0;

    const btn = document.getElementById('btn-flythrough');
    btn.classList.toggle('active', this.isFlythroughActive);
    btn.textContent = this.isFlythroughActive ? '⏹ STOP FLY-THROUGH' : '🎬 CINEMATIC FLY-THROUGH';
  }

  // --- FIND YOUR DRAGON (THRESHING QUIZ) ---
  openDragonQuiz() {
    this.audio.playPulseChime(1.1);
    this.quizStep = 0;
    this.quizScores = { tairn: 0, andarna: 0, blue: 0, green: 0, red: 0, brown: 0, orange: 0 };
    document.getElementById('quiz-modal').classList.remove('hidden');
    this._renderQuizStep();
  }

  _renderQuizStep() {
    const body = document.getElementById('quiz-body');
    if (this.quizStep < QUIZ_QUESTIONS.length) {
      const q = QUIZ_QUESTIONS[this.quizStep];
      body.innerHTML = `
        <div class="quiz-progress">THRESHING RESONANCE SCAN • QUESTION ${this.quizStep + 1} OF ${QUIZ_QUESTIONS.length}</div>
        <h3 class="quiz-question">${q.question}</h3>
        <div class="quiz-options">
          ${q.options
            .map(
              (opt, idx) => `
            <button class="quiz-option-btn" data-idx="${idx}">
              <span class="opt-bullet">◆</span>
              <span>${opt.text}</span>
            </button>
          `
            )
            .join('')}
        </div>
      `;
      body.querySelectorAll('.quiz-option-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const opt = q.options[Number(btn.dataset.idx)];
          Object.entries(opt.weights).forEach(([k, w]) => {
            this.quizScores[k] = (this.quizScores[k] || 0) + w;
          });
          this.audio.playPulseChime(1.25 + this.quizStep * 0.1);
          this.quizStep++;
          this._renderQuizStep();
        });
      });
    } else {
      // Compute winning dragon lineage
      const validKeys = Object.keys(DRAGON_RESULTS);
      let bestKey = 'tairn';
      let bestScore = -1;
      validKeys.forEach((k) => {
        if ((this.quizScores[k] || 0) > bestScore) {
          bestScore = this.quizScores[k];
          bestKey = k;
        }
      });

      const res = DRAGON_RESULTS[bestKey];
      this.triggerStormLightning(true);

      body.innerHTML = `
        <div class="quiz-progress" style="color:${res.colorHex}">BOND TETHER LOCKED • THRESHING COMPLETE</div>
        <h2 class="quiz-result-title" style="color:${res.colorHex}">${res.breed}</h2>
        <div class="quiz-rarity">${res.rarity}</div>
        <blockquote class="quiz-quote">${res.quote}</blockquote>
        <p class="quiz-desc">${res.description}</p>
        <div class="quiz-signet-box">
          <span>MANIFESTED SIGNET CONDUIT:</span>
          <strong style="color:${res.secondaryHex}">${res.signet}</strong>
        </div>
        <div class="quiz-actions">
          <button id="btn-apply-quiz-dragon" class="cta-primary">INSPECT YOUR DRAGON IN 3D X-RAY</button>
          <button id="btn-retry-quiz" class="cta-secondary">RETAKE THRESHING TRIAL</button>
        </div>
      `;

      document.getElementById('btn-apply-quiz-dragon').addEventListener('click', () => {
        document.getElementById('quiz-modal').classList.add('hidden');
        this._setModeTabUI('dragon');
        this._loadSpecimen('dragon', res.specimenId, {
          colorHex: res.colorHex,
          secondaryHex: res.secondaryHex
        });
      });
      document.getElementById('btn-retry-quiz').addEventListener('click', () => {
        this.openDragonQuiz();
      });
    }
  }

  // --- PARAPET TRIAL MINI-GAME LAUNCH & EXIT ---
  launchParapetGame() {
    this.audio.resume();
    this.triggerStormLightning(true);
    this.isFlythroughActive = false;
    this.modelContainer.visible = false;
    this.hotspotsContainer.classList.add('hidden');
    document.getElementById('main-inspector-ui').classList.add('hidden');
    document.getElementById('parapet-game-ui').classList.remove('hidden');
    this.parapetGame.start();
  }

  exitParapetGame() {
    this.parapetGame.stop();
    this.modelContainer.visible = true;
    this.hotspotsContainer.classList.remove('hidden');
    document.getElementById('parapet-game-ui').classList.add('hidden');
    document.getElementById('main-inspector-ui').classList.remove('hidden');
    this._loadSpecimen(this.currentModeId, this.currentSpecimenId, this.customQuizColors);
  }

  _setModeTabUI(modeId) {
    document.querySelectorAll('.mode-tab').forEach((t) => {
      t.classList.toggle('active', t.dataset.mode === modeId);
    });
  }

  _bindUIEvents() {
    // Intro gate button
    const enterBtn = document.getElementById('btn-enter-archive');
    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        this.audio.init();
        this.audio.playThunderAndLightning();
        document.getElementById('intro-overlay').classList.add('fade-out');
        setTimeout(() => {
          document.getElementById('intro-overlay').classList.add('hidden');
        }, 700);
        this.triggerStormLightning(false);
      });
    }

    // Mode tabs (Dragon / Rider / Basgiath)
    document.querySelectorAll('.mode-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const mode = tab.dataset.mode;
        if (this.parapetGame.isActive) {
          this.exitParapetGame();
        }
        this.audio.playPulseChime(1.0);
        this._setModeTabUI(mode);
        this._loadSpecimen(mode);
      });
    });

    // Pointer tracking for the 3D X-Ray Oculus Lens
    window.addEventListener('pointermove', (e) => {
      if (this.isLensPinned) return;
      const prevX = this.mousePx.x;
      const prevY = this.mousePx.y;
      this.mousePx.x = e.clientX;
      this.mousePx.y = e.clientY;

      this.targetLensUV.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight
      );

      // Update floating Oculus reticle DOM element
      if (this.reticleEl) {
        this.reticleEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      const speed = Math.hypot(e.clientX - prevX, e.clientY - prevY) / 45.0;
      const isCenterArea =
        e.clientX > window.innerWidth * 0.2 &&
        e.clientX < window.innerWidth * 0.8 &&
        e.clientY > window.innerHeight * 0.15 &&
        e.clientY < window.innerHeight * 0.85;
      this.audio.updateScannerHum(
        Math.min(1.0, speed),
        sharedUniforms.uXrayDepth.value,
        isCenterArea
      );
    });

    // Double-click canvas to pin/unpin the X-Ray Oculus lens in place
    this.renderer.domElement.addEventListener('dblclick', (e) => {
      this.isLensPinned = !this.isLensPinned;
      this.reticleEl.classList.toggle('pinned', this.isLensPinned);
      this.audio.playPulseChime(this.isLensPinned ? 1.4 : 0.85);
      const pinStatus = document.getElementById('reticle-status-text');
      if (pinStatus) {
        pinStatus.textContent = this.isLensPinned ? 'LOCKED SCAN' : 'LIVE OCULUS';
      }
    });

    // X-Ray Depth Layer Slider
    const depthSlider = document.getElementById('xray-depth-slider');
    depthSlider.addEventListener('input', (e) => {
      const val = Number(e.target.value) / 100;
      sharedUniforms.uXrayDepth.value = val;
      const labelEl = document.getElementById('xray-depth-val');
      if (val < 0.2) labelEl.textContent = `${Math.round(val * 100)}% (SURFACE SCALES)`;
      else if (val < 0.6) labelEl.textContent = `${Math.round(val * 100)}% (VASCULAR & SIGNET)`;
      else labelEl.textContent = `${Math.round(val * 100)}% (DEEP SKELETAL CORE)`;
    });

    // Lens Aperture Radius Slider
    const radiusSlider = document.getElementById('xray-radius-slider');
    radiusSlider.addEventListener('input', (e) => {
      const val = Number(e.target.value) / 100;
      sharedUniforms.uLensRadius.value = val;
      const pxDiameter = Math.round(val * window.innerHeight * 2);
      this.reticleEl.style.width = `${pxDiameter}px`;
      this.reticleEl.style.height = `${pxDiameter}px`;
      document.getElementById('xray-radius-val').textContent = `${Math.round(val * 100)}%`;
    });

    // Full-Body X-Ray Override Toggle
    const btnFullXray = document.getElementById('btn-full-xray');
    btnFullXray.addEventListener('click', () => {
      const next = sharedUniforms.uFullXray.value > 0.5 ? 0.0 : 1.0;
      sharedUniforms.uFullXray.value = next;
      btnFullXray.classList.toggle('active', next > 0.5);
      btnFullXray.textContent = next > 0.5 ? '◉ FULL TOMOGRAPHY: ON' : '◎ FULL TOMOGRAPHY: OFF';
      this.reticleEl.classList.toggle('hidden', next > 0.5);
      this.audio.playPulseChime(1.3);
    });

    // Channel Signet Surge (Lightning Strike Button)
    document.getElementById('btn-lightning-surge').addEventListener('click', () => {
      this.triggerStormLightning(true);
    });

    // Cinematic Fly-Through Button
    document.getElementById('btn-flythrough').addEventListener('click', () => {
      this.startCinematicFlythrough();
    });

    // Find Your Dragon Quiz Button
    document.getElementById('btn-open-quiz').addEventListener('click', () => {
      this.openDragonQuiz();
    });
    document.getElementById('btn-close-quiz').addEventListener('click', () => {
      document.getElementById('quiz-modal').classList.add('hidden');
    });

    // Author & Lore Dedication Modal
    document.getElementById('btn-open-dedication').addEventListener('click', () => {
      this.audio.playPulseChime(1.15);
      document.getElementById('dedication-modal').classList.remove('hidden');
    });
    document.getElementById('btn-close-dedication').addEventListener('click', () => {
      document.getElementById('dedication-modal').classList.add('hidden');
    });

    // Parapet Trial Mini-Game Buttons
    document.getElementById('btn-launch-parapet').addEventListener('click', () => {
      this.launchParapetGame();
    });
    document.getElementById('btn-parapet-exit').addEventListener('click', () => {
      this.exitParapetGame();
    });
    document.getElementById('btn-parapet-restart').addEventListener('click', () => {
      this.parapetGame.start();
    });
    document.getElementById('btn-parapet-left').addEventListener('click', () => {
      this.parapetGame.nudgeBalance(-0.26);
    });
    document.getElementById('btn-parapet-right').addEventListener('click', () => {
      this.parapetGame.nudgeBalance(0.26);
    });
    document.getElementById('btn-parapet-step').addEventListener('click', () => {
      this.parapetGame.advanceStep(false);
    });
    document.getElementById('btn-parapet-leap').addEventListener('click', () => {
      this.parapetGame.advanceStep(true);
    });
    document.getElementById('btn-parapet-xray').addEventListener('click', () => {
      this.parapetGame.triggerXrayPulse();
    });

    // Audio Mute Toggle
    const btnAudio = document.getElementById('btn-audio-toggle');
    btnAudio.addEventListener('click', () => {
      const muted = this.audio.toggleMute();
      btnAudio.textContent = muted ? '🔇 AUDIO: MUTED' : '🔊 STORM AUDIO: ON';
    });

    // Cancel camera lerp when user manually drags OrbitControls
    this.controls.addEventListener('start', () => {
      this.cameraLerpTargetPos = null;
      this.cameraLerpLookAt = null;
      if (this.isFlythroughActive) {
        this.isFlythroughActive = false;
        const btn = document.getElementById('btn-flythrough');
        btn.classList.remove('active');
        btn.textContent = '🎬 CINEMATIC FLY-THROUGH';
      }
    });

    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      this.composer.setSize(w, h);
      sharedUniforms.uAspect.value = w / h;
    });
  }

  _updateHotspotScreenPositions() {
    if (!this.activeHotspots || this.parapetGame.isActive) return;
    const halfW = window.innerWidth * 0.5;
    const halfH = window.innerHeight * 0.5;

    this.activeHotspots.forEach((h) => {
      const projected = h.worldPos.clone();
      projected.project(this.camera);

      // Hide if behind camera
      if (projected.z > 1.0) {
        h.el.style.opacity = '0';
        h.el.style.pointerEvents = 'none';
        return;
      }

      const x = projected.x * halfW + halfW;
      const y = -(projected.y * halfH) + halfH;
      h.el.style.opacity = '1';
      h.el.style.pointerEvents = 'auto';
      h.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  }

  _animate() {
    requestAnimationFrame(() => this._animate());

    const dt = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

    sharedUniforms.uTime.value = elapsed;

    // Smoothly interpolate Oculus X-Ray Lens position
    this.currentLensUV.lerp(this.targetLensUV, 0.18);
    sharedUniforms.uLensPos.value.copy(this.currentLensUV);

    // Decay storm lightning flash
    if (sharedUniforms.uLightningFlash.value > 0.001) {
      sharedUniforms.uLightningFlash.value = Math.max(
        0.0,
        sharedUniforms.uLightningFlash.value - dt * 2.4
      );
      this.keyLight.intensity = 2.6 + sharedUniforms.uLightningFlash.value * 4.5;
      if (sharedUniforms.uLightningFlash.value < 0.05 && this.lightningGroup.children.length > 0) {
        while (this.lightningGroup.children.length > 0) {
          this.lightningGroup.remove(this.lightningGroup.children[0]);
        }
      }
    }

    // Occasional ambient storm flash in the background
    if (Math.random() < 0.0025) {
      this.triggerStormLightning(false);
    }

    // Animate drifting embers & storm ash
    if (this.emberParticles) {
      const posAttr = this.emberParticles.geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        let y = posAttr.getY(i) + this.particleSpeeds[i] * dt;
        let x = posAttr.getX(i) + Math.sin(elapsed * 0.8 + i) * 0.005;
        if (y > 7.0) y = -7.0;
        posAttr.setXY(i, x, y);
      }
      posAttr.needsUpdate = true;
    }

    // Parapet mini-game vs Main Inspector mode
    if (this.parapetGame.isActive) {
      // During X-Ray Second-Sight pulse in the Parapet game, turn on full X-ray shader!
      sharedUniforms.uFullXray.value = this.parapetGame.xrayPulseTimer > 0 ? 1.0 : 0.0;
      this.parapetGame.update(dt, elapsed);
    } else {
      // Animate current 3D anatomical / architectural specimen
      if (this.currentModel && this.currentModel.userData.updateAnimation) {
        this.currentModel.userData.updateAnimation(elapsed);
      }

      // Cinematic Camera Fly-Through orbit
      if (this.isFlythroughActive) {
        this.flythroughTime += dt * 0.42;
        const radius = 4.6 + Math.sin(this.flythroughTime * 1.3) * 1.1;
        this.camera.position.x = Math.cos(this.flythroughTime) * radius;
        this.camera.position.z = Math.sin(this.flythroughTime) * radius;
        this.camera.position.y = 1.15 + Math.sin(this.flythroughTime * 0.85) * 0.95;
        this.controls.target.set(
          Math.sin(this.flythroughTime * 0.5) * 0.4,
          0.35,
          0
        );
        // Sweep the X-Ray lens automatically across the specimen during fly-through
        if (!this.isLensPinned) {
          this.targetLensUV.set(
            0.5 + Math.cos(this.flythroughTime * 2.1) * 0.14,
            0.5 + Math.sin(this.flythroughTime * 1.7) * 0.12
          );
        }
      } else if (this.cameraLerpTargetPos && this.cameraLerpLookAt) {
        this.camera.position.lerp(this.cameraLerpTargetPos, 0.08);
        this.controls.target.lerp(this.cameraLerpLookAt, 0.08);
        if (this.camera.position.distanceTo(this.cameraLerpTargetPos) < 0.04) {
          this.cameraLerpTargetPos = null;
          this.cameraLerpLookAt = null;
        }
      }

      this.controls.update();
      this._updateHotspotScreenPositions();
    }

    this.composer.render();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.fourthWingApp = new FourthWingOculusApp();
});
