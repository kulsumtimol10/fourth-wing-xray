// ============================================================================
// FOURTH WING: THE EMPYREAN ARCHIVE — Main Experience Controller (v3)
// Orchestrates the Hero Second-Sight Sanctum, 3D WebGL Artifact Reliquary,
// Atmospheric Embers/Rain/Lightning FX, Wielder of the Storm Game, & Quiz.
// ============================================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import { REALMS, ARTIFACTS_3D, QUIZ_QUESTIONS, DRAGON_RESULTS } from './loreData.js';
import { ArcaneAudioEngine } from './audioEngine.js';
import { buildArtifact3D } from './models3D.js';
import { StormDefenseGame } from './parapetGame.js';

class EmpyreanArchiveApp {
  constructor() {
    this.audio = new ArcaneAudioEngine();

    // Hero Second-Sight Stage state
    this.currentRealmId = 'dragon';
    this.visionMode = 'lens'; // 'lens' | 'real' | 'xray'
    this.lensRadiusPx = 145;
    this.isLensPinned = false;

    this.targetLensPct = { x: 53.5, y: 47.0 };
    this.currentLensPct = { x: 53.5, y: 47.0 };

    this.stageFrame = document.getElementById('stage-frame');
    this.parallaxInner = document.getElementById('parallax-scene-inner');
    this.imgReal = document.getElementById('scene-img-real');
    this.imgXray = document.getElementById('scene-img-xray');
    this.lensRing = document.getElementById('arcane-lens-ring');
    this.hotspotsLayer = document.getElementById('stage-hotspots');
    this.fxCanvas = document.getElementById('stage-fx-canvas');
    this.fxCtx = this.fxCanvas.getContext('2d');

    // Stage FX (Embers, Rain, Lightning Flash)
    this.embers = [];
    this.rainDrops = [];
    this.lightningFlashAlpha = 0;
    this.lightningBolts = [];

    // 3D Reliquary state
    this.currentArtifactId = 'wardstone';
    this.artifactModel = null;

    // Quiz state
    this.quizStep = 0;
    this.quizScores = { tairn: 0, andarna: 0, blue: 0, green: 0, red: 0 };

    this.clock = new THREE.Clock();

    this._initStageFX();
    this._loadRealm('dragon');
    this._init3DReliquary();
    this._initStormGame();
    this._initQuiz();
    this._bindEvents();
    this._animate();
  }

  // ==========================================================================
  // 1. HERO SECOND-SIGHT SANCTUM & ATMOSPHERIC FX
  // ==========================================================================
  _initStageFX() {
    const resizeFX = () => {
      if (!this.stageFrame) return;
      const r = this.stageFrame.getBoundingClientRect();
      this.fxCanvas.width = Math.max(400, r.width);
      this.fxCanvas.height = Math.max(250, r.height);
    };
    resizeFX();
    window.addEventListener('resize', resizeFX);

    for (let i = 0; i < 48; i++) {
      this.embers.push({
        x: Math.random() * 1200,
        y: Math.random() * 700,
        vx: (Math.random() - 0.5) * 18,
        vy: -18 - Math.random() * 32,
        size: 1.2 + Math.random() * 2.4,
        alpha: 0.35 + Math.random() * 0.6,
        color: Math.random() < 0.7 ? '#ffe08a' : '#5ecbff'
      });
    }

    for (let i = 0; i < 65; i++) {
      this.rainDrops.push({
        x: Math.random() * 1200,
        y: Math.random() * 700,
        len: 12 + Math.random() * 16,
        speed: 380 + Math.random() * 220
      });
    }
  }

  triggerLightningStrike(playAudio = true) {
    this.lightningFlashAlpha = 0.55;
    if (playAudio) {
      this.audio.playThunderAndLightning();
    }

    const W = this.fxCanvas.width;
    const H = this.fxCanvas.height;
    let cx = W * (0.2 + Math.random() * 0.6);
    let cy = 0;
    const segs = [];
    for (let i = 0; i < 10; i++) {
      const nx = cx + (Math.random() - 0.5) * 55;
      const ny = cy + H / 10;
      segs.push({ x1: cx, y1: cy, x2: nx, y2: ny });
      cx = nx;
      cy = ny;
    }
    this.lightningBolts.push({ segs, alpha: 1.0 });
  }

  _loadRealm(realmId) {
    this.currentRealmId = realmId;
    const realm = REALMS[realmId];

    document.getElementById('realm-kicker').textContent = realm.chapterKicker;
    document.getElementById('realm-headline').textContent = realm.headline;
    document.getElementById('realm-sublead').textContent = realm.sublead;

    this.imgReal.src = realm.realImage;
    this.imgXray.src = realm.xrayImage;

    // Update realm tab buttons
    document.querySelectorAll('.realm-tab').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.realm === realmId);
    });

    // Build numbered hotspot pins on the stage & quick-chips in the sidebar
    this.hotspotsLayer.innerHTML = '';
    const chipsContainer = document.getElementById('hotspot-chips');
    chipsContainer.innerHTML = '';

    realm.hotspots.forEach((h, idx) => {
      // Pin on the 16:9 Stage
      const pin = document.createElement('button');
      pin.className = `stage-pin ${idx === 0 ? 'active' : ''}`;
      pin.style.left = `${h.x}%`;
      pin.style.top = `${h.y}%`;
      pin.dataset.id = h.id;
      pin.innerHTML = `
        <span>${h.num}</span>
        <span class="pin-tooltip">${h.title}</span>
      `;
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audio.playPulseChime(1.25);
        this._selectHotspot(h);
      });
      this.hotspotsLayer.appendChild(pin);

      // Chip in the Right Sidebar
      const chip = document.createElement('button');
      chip.className = `hotspot-chip ${idx === 0 ? 'active' : ''}`;
      chip.dataset.id = h.id;
      chip.textContent = `${h.num} • ${h.title.split(' ')[0]} ${h.title.split(' ')[1] || ''}`;
      chip.addEventListener('click', () => {
        this.audio.playPulseChime(1.25);
        this._selectHotspot(h);
      });
      chipsContainer.appendChild(chip);
    });

    if (realm.hotspots.length > 0) {
      this._selectHotspot(realm.hotspots[0], false);
    }
  }

  _selectHotspot(h, moveLens = true) {
    document.querySelectorAll('.stage-pin').forEach((p) => {
      p.classList.toggle('active', p.dataset.id === h.id);
    });
    document.querySelectorAll('.hotspot-chip').forEach((c) => {
      c.classList.toggle('active', c.dataset.id === h.id);
    });

    document.getElementById('codex-tag').textContent = `${h.num} • ${h.tag}`;
    document.getElementById('codex-title').textContent = h.title;
    document.getElementById('codex-telemetry').textContent = h.telemetry;
    document.getElementById('codex-desc').textContent = h.description;
    document.getElementById('codex-secret').textContent = h.secret;

    if (moveLens) {
      this.targetLensPct.x = h.x;
      this.targetLensPct.y = h.y;
      if (this.visionMode === 'real') {
        this._setVisionMode('lens');
      }
    }
  }

  _setVisionMode(mode) {
    this.visionMode = mode;
    document.querySelectorAll('.vision-pill').forEach((p) => {
      p.classList.toggle('active', p.dataset.vision === mode);
    });

    if (mode === 'real') {
      this.imgXray.style.clipPath = 'circle(0px at 50% 50%)';
      this.lensRing.style.opacity = '0';
    } else if (mode === 'xray') {
      this.imgXray.style.clipPath = 'circle(150% at 50% 50%)';
      this.lensRing.style.opacity = '0';
    } else {
      this.lensRing.style.opacity = '1';
      this._updateLensDOM();
    }
  }

  _updateLensDOM() {
    if (this.visionMode !== 'lens') return;
    const xPct = this.currentLensPct.x;
    const yPct = this.currentLensPct.y;

    this.imgXray.style.clipPath = `circle(${this.lensRadiusPx}px at ${xPct}% ${yPct}%)`;
    this.lensRing.style.left = `${xPct}%`;
    this.lensRing.style.top = `${yPct}%`;
    const d = this.lensRadiusPx * 2;
    this.lensRing.style.width = `${d}px`;
    this.lensRing.style.height = `${d}px`;
    this.lensRing.style.marginLeft = `${-this.lensRadiusPx}px`;
    this.lensRing.style.marginTop = `${-this.lensRadiusPx}px`;
  }

  // ==========================================================================
  // 2. SECTION II: 3D WEBGL ARTIFACT RELIQUARY
  // ==========================================================================
  _init3DReliquary() {
    this.reliquaryBox = document.getElementById('artifact-3d-container');
    const rect = this.reliquaryBox.getBoundingClientRect();
    const w = Math.max(360, rect.width);
    const h = Math.max(320, rect.height);

    this.scene3D = new THREE.Scene();
    this.camera3D = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    this.camera3D.position.set(0, 1.35, 4.8);

    this.renderer3D = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer3D.setSize(w, h);
    this.renderer3D.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer3D.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer3D.toneMappingExposure = 1.2;
    this.reliquaryBox.appendChild(this.renderer3D.domElement);

    this.composer3D = new EffectComposer(this.renderer3D);
    this.composer3D.addPass(new RenderPass(this.scene3D, this.camera3D));
    this.composer3D.addPass(
      new UnrealBloomPass(new THREE.Vector2(w, h), 0.75, 0.4, 0.22)
    );

    this.controls3D = new OrbitControls(this.camera3D, this.renderer3D.domElement);
    this.controls3D.enableDamping = true;
    this.controls3D.autoRotate = true;
    this.controls3D.autoRotateSpeed = 1.4;
    this.controls3D.maxDistance = 8;
    this.controls3D.minDistance = 2.4;

    this.scene3D.add(new THREE.AmbientLight('#263554', 1.8));
    const key = new THREE.DirectionalLight('#ffe08a', 3.2);
    key.position.set(4, 6, 5);
    this.scene3D.add(key);

    const rim = new THREE.DirectionalLight('#5ecbff', 2.4);
    rim.position.set(-5, -3, -4);
    this.scene3D.add(rim);

    this.artifactHolder = new THREE.Group();
    this.scene3D.add(this.artifactHolder);

    // Populate Artifact Selector Cards
    const stack = document.getElementById('artifact-cards-list');
    ARTIFACTS_3D.forEach((art, idx) => {
      const card = document.createElement('div');
      card.className = `artifact-selector-card ${idx === 0 ? 'active' : ''}`;
      card.dataset.id = art.id;
      card.innerHTML = `
        <div class="hero-kicker" style="margin-bottom:4px;">${art.subtitle}</div>
        <h3>${art.title}</h3>
        <p>${art.description}</p>
      `;
      card.addEventListener('click', () => {
        this.audio.playPulseChime(1.2);
        document.querySelectorAll('.artifact-selector-card').forEach((c) => {
          c.classList.toggle('active', c.dataset.id === art.id);
        });
        this._loadArtifact3D(art.id);
      });
      stack.appendChild(card);
    });

    this._loadArtifact3D('wardstone');

    window.addEventListener('resize', () => {
      const r = this.reliquaryBox.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        this.camera3D.aspect = r.width / r.height;
        this.camera3D.updateProjectionMatrix();
        this.renderer3D.setSize(r.width, r.height);
        this.composer3D.setSize(r.width, r.height);
      }
    });
  }

  _loadArtifact3D(artifactId) {
    while (this.artifactHolder.children.length > 0) {
      this.artifactHolder.remove(this.artifactHolder.children[0]);
    }
    this.artifactModel = buildArtifact3D(artifactId);
    this.artifactHolder.add(this.artifactModel);
  }

  // ==========================================================================
  // 3. SECTION III: WIELDER OF THE STORM GAME & THRESHING QUIZ
  // ==========================================================================
  _initStormGame() {
    const canvas = document.getElementById('storm-game-canvas');
    if (canvas) {
      this.stormGame = new StormDefenseGame(canvas, this.audio);
    }
    const resetBtn = document.getElementById('btn-reset-storm-game');
    if (resetBtn && this.stormGame) {
      resetBtn.addEventListener('click', () => {
        this.audio.playPulseChime(1.1);
        this.stormGame.reset();
      });
    }
  }

  _initQuiz() {
    this.quizStep = 0;
    this.quizScores = { tairn: 0, andarna: 0, blue: 0, green: 0, red: 0 };
    this._renderQuiz();
  }

  _renderQuiz() {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    if (this.quizStep < QUIZ_QUESTIONS.length) {
      const q = QUIZ_QUESTIONS[this.quizStep];
      container.innerHTML = `
        <div style="font-size:11px;color:var(--cyan-signet);margin-top:8px;letter-spacing:0.12em;">
          QUESTION ${this.quizStep + 1} OF ${QUIZ_QUESTIONS.length}
        </div>
        <div class="quiz-question-text">${q.question}</div>
        <div class="quiz-choices">
          ${q.options
            .map(
              (o, idx) => `
            <button class="quiz-choice-btn" data-idx="${idx}">
              <strong style="color:var(--gold-primary);margin-right:8px;">0${idx + 1}</strong> ${o.text}
            </button>
          `
            )
            .join('')}
        </div>
      `;
      container.querySelectorAll('.quiz-choice-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const opt = q.options[Number(btn.dataset.idx)];
          Object.entries(opt.weights).forEach(([k, w]) => {
            this.quizScores[k] = (this.quizScores[k] || 0) + w;
          });
          this.audio.playPulseChime(1.2 + this.quizStep * 0.12);
          this.quizStep++;
          this._renderQuiz();
        });
      });
    } else {
      let bestKey = 'tairn';
      let bestVal = -1;
      Object.keys(DRAGON_RESULTS).forEach((k) => {
        if ((this.quizScores[k] || 0) > bestVal) {
          bestVal = this.quizScores[k];
          bestKey = k;
        }
      });
      const res = DRAGON_RESULTS[bestKey];
      this.triggerLightningStrike(true);

      container.innerHTML = `
        <div style="margin-top:14px;padding:18px;border-radius:14px;background:rgba(229,184,92,0.08);border:1px solid ${res.colorHex};">
          <div style="font-size:10.5px;letter-spacing:0.16em;color:${res.colorHex};font-weight:700;">
            ${res.rarity}
          </div>
          <h4 style="font-family:var(--font-display);font-size:22px;color:#fff;margin:6px 0;">
            ${res.breed}
          </h4>
          <p style="font-family:var(--font-editorial);font-style:italic;font-size:18px;color:var(--gold-bright);margin-bottom:10px;">
            ${res.quote}
          </p>
          <p style="font-size:13.5px;line-height:1.55;color:var(--text-secondary);margin-bottom:12px;">
            ${res.description}
          </p>
          <div style="font-size:12.5px;color:var(--text-ivory);margin-bottom:16px;">
            <strong>Awakened Signet:</strong> <span style="color:${res.colorHex}">${res.signet}</span>
          </div>
          <button id="btn-retake-quiz" class="btn-gold">↻ Retake Threshing Trial</button>
        </div>
      `;
      document.getElementById('btn-retake-quiz').addEventListener('click', () => {
        this._initQuiz();
      });
    }
  }

  // ==========================================================================
  // 4. EVENT BINDINGS & MAIN ANIMATION LOOP
  // ==========================================================================
  _bindEvents() {
    // Realm Switcher Tabs
    document.querySelectorAll('.realm-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        this.audio.playPulseChime(1.1);
        this.triggerLightningStrike(false);
        this._loadRealm(tab.dataset.realm);
      });
    });

    // Vision Mode Pills
    document.querySelectorAll('.vision-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        this.audio.playPulseChime(1.2);
        this._setVisionMode(pill.dataset.vision);
      });
    });

    // Lens Radius Slider
    const radSlider = document.getElementById('lens-radius-slider');
    if (radSlider) {
      radSlider.addEventListener('input', (e) => {
        this.lensRadiusPx = Number(e.target.value);
        if (this.visionMode !== 'lens') {
          this._setVisionMode('lens');
        } else {
          this._updateLensDOM();
        }
      });
    }

    // Stage Cursor Tracking & 3D Parallax Tilt
    this.stageFrame.addEventListener('pointermove', (e) => {
      this.audio.resume();
      const rect = this.stageFrame.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;

      if (!this.isLensPinned) {
        this.targetLensPct.x = Math.max(0, Math.min(100, xPct));
        this.targetLensPct.y = Math.max(0, Math.min(100, yPct));
      }

      // Subtle 3D Parallax Shift on the Scene
      const shiftX = ((xPct - 50) / 50) * -10;
      const shiftY = ((yPct - 50) / 50) * -7;
      this.parallaxInner.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0)`;
    });

    // Double-Click Stage to Pin/Unpin Lens
    this.stageFrame.addEventListener('dblclick', () => {
      this.isLensPinned = !this.isLensPinned;
      this.audio.playPulseChime(this.isLensPinned ? 1.45 : 0.9);
      const lbl = document.getElementById('lens-status-label');
      if (lbl) {
        lbl.textContent = this.isLensPinned
          ? 'LENS PINNED • DBL-CLICK TO UNLOCK'
          : 'SECOND-SIGHT LENS • DBL-CLICK TO PIN';
      }
    });

    // Header Lightning & Audio Buttons
    document.getElementById('btn-trigger-lightning').addEventListener('click', () => {
      this.triggerLightningStrike(true);
    });

    const audioBtn = document.getElementById('btn-audio-toggle');
    audioBtn.addEventListener('click', () => {
      const muted = this.audio.toggleMute();
      audioBtn.textContent = muted ? '🔇 Storm Audio: OFF' : '🔊 Storm Audio: ON';
    });
  }

  _renderStageFX(dt) {
    const ctx = this.fxCtx;
    const W = this.fxCanvas.width;
    const H = this.fxCanvas.height;

    ctx.clearRect(0, 0, W, H);

    // 1. Storm Rain Streaks
    ctx.strokeStyle = 'rgba(185, 215, 255, 0.16)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    this.rainDrops.forEach((r) => {
      r.y += r.speed * dt;
      r.x -= r.speed * 0.15 * dt;
      if (r.y > H) {
        r.y = -20;
        r.x = Math.random() * W;
      }
      if (r.x < 0) r.x = W;
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(r.x - 3, r.y + r.len);
    });
    ctx.stroke();

    // 2. Floating Golden Embers & Signet Sparks
    this.embers.forEach((em) => {
      em.x += em.vx * dt;
      em.y += em.vy * dt;
      if (em.y < -10) {
        em.y = H + 10;
        em.x = Math.random() * W;
      }
      ctx.fillStyle = em.color;
      ctx.globalAlpha = em.alpha;
      ctx.beginPath();
      ctx.arc(em.x, em.y, em.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // 3. Lightning Flash & Bolts
    if (this.lightningFlashAlpha > 0.01) {
      ctx.fillStyle = `rgba(180, 230, 255, ${this.lightningFlashAlpha * 0.25})`;
      ctx.fillRect(0, 0, W, H);
      this.lightningFlashAlpha = Math.max(0, this.lightningFlashAlpha - dt * 1.8);
    }

    for (let i = this.lightningBolts.length - 1; i >= 0; i--) {
      const b = this.lightningBolts[i];
      b.alpha -= dt * 3.0;
      if (b.alpha <= 0) {
        this.lightningBolts.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.strokeStyle = `rgba(200, 242, 255, ${b.alpha})`;
      ctx.shadowColor = '#5ecbff';
      ctx.shadowBlur = 16;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      b.segs.forEach((s) => {
        ctx.moveTo(s.x1, s.y1);
        ctx.lineTo(s.x2, s.y2);
      });
      ctx.stroke();
      ctx.restore();
    }
  }

  _animate() {
    requestAnimationFrame(() => this._animate());

    const dt = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

    // Smoothly interpolate Second-Sight Lens position
    this.currentLensPct.x += (this.targetLensPct.x - this.currentLensPct.x) * 0.22;
    this.currentLensPct.y += (this.targetLensPct.y - this.currentLensPct.y) * 0.22;
    this._updateLensDOM();

    // Render Stage FX (Rain, Embers, Lightning)
    this._renderStageFX(dt);

    // Render 3D Artifact Reliquary
    if (this.artifactModel && this.artifactModel.userData.updateAnimation) {
      this.artifactModel.userData.updateAnimation(elapsed);
    }
    if (this.controls3D && this.composer3D) {
      this.controls3D.update();
      this.composer3D.render();
    }

    // Render Wielder of the Storm Mini-Game
    if (this.stormGame) {
      this.stormGame.updateAndRender(dt, elapsed);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.empyreanApp = new EmpyreanArchiveApp();
});
