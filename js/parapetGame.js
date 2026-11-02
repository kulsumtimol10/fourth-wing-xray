// ============================================================================
// FOURTH WING: CODEX OCULUS — 3D Parapet & Threshing Trial Mini-Game
// Cross the rain-slicked 18-inch Parapet over a 200-foot chasm using X-Ray
// Vision to spot internal stone fractures while countering lethal crosswinds.
// ============================================================================

import * as THREE from 'three';
import {
  createExteriorMaterial,
  createConduitMaterial
} from './xrayShader.js';

export class ParapetMiniGame {
  constructor(scene, camera, controls, audio, onExitCallback) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.audio = audio;
    this.onExitCallback = onExitCallback;

    this.isActive = false;
    this.group = new THREE.Group();
    this.blocks = [];
    this.currentStep = 0;
    this.totalSteps = 14;
    this.balance = 0.0; // -1.0 (fall left) to +1.0 (fall right)
    this.windForce = 0.0;
    this.windTarget = 0.0;
    this.xrayPulseTimer = 0.0;
    this.gameStatus = 'idle'; // 'playing' | 'won' | 'fell'

    this._bindKeys();
  }

  _bindKeys() {
    this.keyHandler = (e) => {
      if (!this.isActive || this.gameStatus !== 'playing') return;
      const k = e.key.toLowerCase();
      if (k === 'a' || e.key === 'ArrowLeft') {
        this.nudgeBalance(-0.26);
      } else if (k === 'd' || e.key === 'ArrowRight') {
        this.nudgeBalance(0.26);
      } else if (k === 'w' || e.key === 'ArrowUp') {
        this.advanceStep(false);
      } else if (k === 'e' || e.key === 'Shift') {
        this.advanceStep(true); // Leap over fractured stone
      } else if (k === ' ') {
        e.preventDefault();
        this.triggerXrayPulse();
      }
    };
    window.addEventListener('keydown', this.keyHandler);
  }

  start() {
    this.isActive = true;
    this.gameStatus = 'playing';
    this.currentStep = 0;
    this.balance = 0.0;
    this.windForce = 0.18;
    this.windTarget = 0.25;
    this.xrayPulseTimer = 3.5; // Start with an initial X-ray pulse so player sees the mechanic

    this._buildParapetCourse();
    this.scene.add(this.group);
    this.controls.enabled = false;
    this._updateCameraForStep();
    this._updateHUD();
  }

  stop() {
    this.isActive = false;
    this.gameStatus = 'idle';
    if (this.group.parent) {
      this.scene.remove(this.group);
    }
    this.controls.enabled = true;
  }

  _buildParapetCourse() {
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }
    this.blocks = [];

    const stoneMat = createExteriorMaterial({
      baseColor: '#151c28',
      specularColor: '#38b6ff',
      scalePattern: 0.0
    });
    const safeCoreMat = createConduitMaterial({
      color: '#2ee68a',
      secondary: '#f4c55c',
      pulseSpeed: 5.0,
      alwaysFaintlyVisible: false
    });
    const crackCoreMat = createConduitMaterial({
      color: '#ff1e42',
      secondary: '#ff851b',
      pulseSpeed: 12.0,
      alwaysFaintlyVisible: false
    });

    // Generate 15 stone blocks along -Z axis
    let prevCracked = false;
    for (let i = 0; i <= this.totalSteps; i++) {
      // Never put two cracked blocks in a row so leaping is always possible
      const isCracked = i > 1 && i < this.totalSteps - 1 && !prevCracked && Math.random() < 0.38;
      prevCracked = isCracked;

      const blockGroup = new THREE.Group();
      blockGroup.position.set(0, -0.35, -i * 1.15);

      // Exterior rain-slicked granite block
      const extMesh = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.28, 1.05), stoneMat);
      blockGroup.add(extMesh);

      // Internal X-Ray Core (Green/Gold = Solid Keystone, Red = Fractured Fault!)
      const coreGeo = isCracked
        ? new THREE.OctahedronGeometry(0.24, 1)
        : new THREE.BoxGeometry(0.48, 0.14, 0.82);
      const coreMesh = new THREE.Mesh(coreGeo, isCracked ? crackCoreMat : safeCoreMat);
      blockGroup.add(coreMesh);

      this.group.add(blockGroup);
      this.blocks.push({
        index: i,
        isCracked,
        group: blockGroup,
        extMesh,
        coreMesh
      });
    }

    // Far Citadel Tower Portal + Waiting Dragon Silhouette at the end of the Parapet
    const towerMat = createExteriorMaterial({
      baseColor: '#0e131d',
      specularColor: '#f4c55c',
      scalePattern: 0.0
    });
    const endTower = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 4.5, 10), towerMat);
    endTower.position.set(0, 1.1, -(this.totalSteps + 1.8) * 1.15);
    this.group.add(endTower);

    const portalArch = new THREE.Mesh(
      new THREE.TorusGeometry(0.65, 0.08, 10, 32),
      safeCoreMat
    );
    portalArch.position.set(0, 0.35, -(this.totalSteps + 0.6) * 1.15);
    this.group.add(portalArch);
  }

  nudgeBalance(delta) {
    if (this.gameStatus !== 'playing') return;
    this.balance = THREE.MathUtils.clamp(this.balance + delta, -1.2, 1.2);
    this.audio.playPulseChime(1.1);
    this._updateHUD();
  }

  triggerXrayPulse() {
    if (this.gameStatus !== 'playing') return;
    this.xrayPulseTimer = 4.0;
    this.audio.playPulseChime(1.5);
    this._updateHUD('X-RAY SECOND-SIGHT ACTIVE: Inspecting internal stone cores! Red = Fractured (Leap over!), Green/Gold = Solid.');
  }

  advanceStep(isLeap = false) {
    if (this.gameStatus !== 'playing') return;
    const stepSize = isLeap ? 2 : 1;
    const nextIdx = Math.min(this.totalSteps, this.currentStep + stepSize);
    const targetBlock = this.blocks[nextIdx];

    // Leaping adds a balance perturbation
    if (isLeap) {
      this.balance += (Math.random() - 0.5) * 0.28;
    }

    this.currentStep = nextIdx;
    this.audio.playPulseChime(isLeap ? 1.35 : 0.95);

    // Check if landed on a fractured stone!
    if (targetBlock && targetBlock.isCracked) {
      this.gameStatus = 'fell';
      targetBlock.group.position.y -= 1.5;
      targetBlock.group.rotation.z = 0.8;
      this.audio.playThunderAndLightning();
      this._updateHUD(
        'CRITICAL FAILURE: You stepped onto a frost-fractured keystone! Use X-Ray Vision and LEAP (2 Stones) over red fractured cores.'
      );
      return;
    }

    if (this.currentStep >= this.totalSteps) {
      this.gameStatus = 'won';
      this.audio.playThunderAndLightning();
      this._updateHUD(
        'QUADRANT CROSSED! You survived the Parapet and anchored your Threshing bond at the Citadel!'
      );
      return;
    }

    // Check what the NEXT block ahead looks like
    const upcoming = this.blocks[this.currentStep + 1];
    const hint = upcoming?.isCracked
      ? 'WARNING: The stone directly ahead has a FRACTURED CORE in X-Ray! Click "LEAP OVER FRACTURE"!'
      : 'Stone ahead appears structurally sound. Keep your balance centered and step forward.';
    this._updateHUD(hint);
  }

  _updateCameraForStep() {
    const targetZ = -this.currentStep * 1.15;
    this.camera.position.lerp(
      new THREE.Vector3(this.balance * 0.45, 0.52, targetZ + 1.45),
      0.12
    );
    const lookTarget = new THREE.Vector3(
      this.balance * 0.25,
      0.15,
      targetZ - 2.6
    );
    this.camera.lookAt(lookTarget);
    // Tilt camera horizon slightly with balance for visceral vertigo!
    this.camera.rotation.z = -this.balance * 0.22;
  }

  update(dt, elapsed) {
    if (!this.isActive) return;

    if (this.gameStatus === 'playing') {
      // Dynamic canyon crosswind shear
      if (Math.random() < 0.03) {
        this.windTarget = (Math.random() - 0.5) * 0.65;
      }
      this.windForce = THREE.MathUtils.lerp(this.windForce, this.windTarget, dt * 1.5);
      this.balance += this.windForce * dt;

      if (this.xrayPulseTimer > 0) {
        this.xrayPulseTimer = Math.max(0, this.xrayPulseTimer - dt);
      }

      if (Math.abs(this.balance) >= 1.0) {
        this.gameStatus = 'fell';
        this.audio.playThunderAndLightning();
        this._updateHUD(
          'SWEPT FROM THE PARAPET! Canyon crosswinds threw your center of gravity over the edge.'
        );
      }
    }

    this._updateCameraForStep();
    this._updateHUD();
  }

  _updateHUD(statusMessage = null) {
    const progressPct = Math.round((this.currentStep / this.totalSteps) * 100);
    const progEl = document.getElementById('parapet-progress-fill');
    const progText = document.getElementById('parapet-progress-text');
    const balMarker = document.getElementById('parapet-balance-marker');
    const windLabel = document.getElementById('parapet-wind-readout');
    const msgEl = document.getElementById('parapet-status-msg');

    if (progEl) progEl.style.width = `${progressPct}%`;
    if (progText) progText.textContent = `${this.currentStep} / ${this.totalSteps} Stones (${progressPct}%)`;
    if (balMarker) {
      const pct = THREE.MathUtils.clamp(50 + this.balance * 48, 2, 98);
      balMarker.style.left = `${pct}%`;
    }
    if (windLabel) {
      const dir = this.windForce > 0.03 ? 'EAST →' : this.windForce < -0.03 ? '← WEST' : 'CALM';
      windLabel.textContent = `${Math.abs(Math.round(this.windForce * 85))} KT ${dir}`;
    }
    if (statusMessage && msgEl) {
      msgEl.textContent = statusMessage;
    }
  }
}
