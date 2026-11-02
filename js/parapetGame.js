// ============================================================================
// FOURTH WING: CODEX OCULUS — Real-Time 3D Canyon Flight & X-Ray Wyvern Strike
// Smooth 60fps mouse/keyboard flight control. Steer Tairn through the storm,
// expose Wyvern Rune Stones in X-Ray Vision, and click/Space to fire Lightning!
// ============================================================================

import * as THREE from 'three';
import {
  createExteriorMaterial,
  createBoneMaterial,
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

    // Player Dragon (Tairn) state
    this.playerDragon = null;
    this.leftWing = null;
    this.rightWing = null;
    this.playerPos = new THREE.Vector2(0, 0);     // Current X, Y
    this.targetPos = new THREE.Vector2(0, 0);     // Mouse/Key target X, Y
    this.keys = { left: false, right: false, up: false, down: false };

    // Gameplay state
    this.score = 0;
    this.wyvernsKilled = 0;
    this.targetKills = 10;
    this.shield = 100;
    this.gameStatus = 'idle'; // 'playing' | 'won' | 'lost'
    this.xrayPulseTimer = 999; // Keep X-ray vision active on targets!

    // Entities
    this.wyverns = [];
    this.bolts = [];
    this.orbs = [];
    this.pillars = [];
    this.explosions = [];
    this.canyonSegments = [];

    this.spawnTimer = 0;
    this.orbTimer = 0;
    this.pillarTimer = 0;

    this._bindEvents();
  }

  _bindEvents() {
    window.addEventListener('pointermove', (e) => {
      if (!this.isActive || this.gameStatus !== 'playing') return;
      // Map screen cursor smoothly to canyon flight bounds X: [-3.2, 3.2], Y: [-1.6, 2.0]
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      this.targetPos.x = THREE.MathUtils.clamp(nx * 3.4, -3.2, 3.2);
      this.targetPos.y = THREE.MathUtils.clamp(ny * 1.9, -1.4, 2.0);
    });

    window.addEventListener('pointerdown', (e) => {
      if (!this.isActive || this.gameStatus !== 'playing') return;
      // Ignore clicks on top/bottom UI buttons
      if (e.target.closest('button')) return;
      this.fireLightningBolt();
    });

    window.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      const k = e.key.toLowerCase();
      if (k === 'a' || e.key === 'ArrowLeft') this.keys.left = true;
      if (k === 'd' || e.key === 'ArrowRight') this.keys.right = true;
      if (k === 'w' || e.key === 'ArrowUp') this.keys.up = true;
      if (k === 's' || e.key === 'ArrowDown') this.keys.down = true;
      if (k === ' ' && this.gameStatus === 'playing') {
        e.preventDefault();
        this.fireLightningBolt();
      }
    });

    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'a' || e.key === 'ArrowLeft') this.keys.left = false;
      if (k === 'd' || e.key === 'ArrowRight') this.keys.right = false;
      if (k === 'w' || e.key === 'ArrowUp') this.keys.up = false;
      if (k === 's' || e.key === 'ArrowDown') this.keys.down = false;
    });
  }

  start() {
    this.isActive = true;
    this.gameStatus = 'playing';
    this.score = 0;
    this.wyvernsKilled = 0;
    this.shield = 100;
    this.playerPos.set(0, 0.2);
    this.targetPos.set(0, 0.2);
    this.wyverns = [];
    this.bolts = [];
    this.orbs = [];
    this.pillars = [];
    this.explosions = [];
    this.canyonSegments = [];
    this.spawnTimer = 0.5;
    this.orbTimer = 1.8;
    this.pillarTimer = 1.2;

    this._buildArena();
    this.scene.add(this.group);
    this.controls.enabled = false;

    this.camera.position.set(0, 1.35, 4.8);
    this.camera.lookAt(0, 0.3, -10);
    this.camera.rotation.z = 0;

    this._updateHUD('STEER WITH MOUSE OR WASD • CLICK OR PRESS SPACE TO FIRE LIGHTNING AT WYVERN RUNE STONES!');
  }

  stop() {
    this.isActive = false;
    this.gameStatus = 'idle';
    if (this.group.parent) {
      this.scene.remove(this.group);
    }
    this.controls.enabled = true;
  }

  _buildArena() {
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }

    // 1. Build Player Dragon (Tairn with Violet's glowing lightning bond on his back!)
    this.playerDragon = new THREE.Group();
    const hideMat = createExteriorMaterial({
      baseColor: '#090d16',
      specularColor: '#38b6ff',
      scalePattern: 1.0
    });
    const conduitMat = createConduitMaterial({
      color: '#38b6ff',
      secondary: '#f4c55c',
      pulseSpeed: 9.0,
      alwaysFaintlyVisible: true
    });

    // Sleek dragon body & neck
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.85, 10), hideMat);
    body.rotation.x = -Math.PI / 2;
    this.playerDragon.add(body);

    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 1), conduitMat);
    core.position.set(0, 0.08, -0.1);
    this.playerDragon.add(core);

    // Flapping Wings
    this.leftWing = new THREE.Group();
    this.rightWing = new THREE.Group();
    const wingGeo = new THREE.ConeGeometry(0.45, 1.65, 4);
    wingGeo.rotateZ(-Math.PI / 2);
    wingGeo.scale(1.0, 0.12, 1.3);

    const lwMesh = new THREE.Mesh(wingGeo, hideMat);
    lwMesh.position.set(0.78, 0, -0.1);
    this.leftWing.add(lwMesh);
    const lwVein = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.03, 0.05), conduitMat);
    lwVein.position.set(0.7, 0.02, -0.25);
    this.leftWing.add(lwVein);

    const rwMesh = new THREE.Mesh(wingGeo.clone().scale(-1, 1, 1), hideMat);
    rwMesh.position.set(-0.78, 0, -0.1);
    this.rightWing.add(rwMesh);
    const rwVein = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.03, 0.05), conduitMat);
    rwVein.position.set(-0.7, 0.02, -0.25);
    this.rightWing.add(rwVein);

    this.playerDragon.add(this.leftWing);
    this.playerDragon.add(this.rightWing);
    this.playerDragon.position.set(0, 0.2, 1.2);
    this.group.add(this.playerDragon);

    // 2. Repeating Canyon Walls rushing past to give a thrilling sense of speed
    const wallMat = new THREE.MeshStandardMaterial({
      color: '#0d1320',
      roughness: 0.85,
      metalness: 0.2
    });
    for (let i = 0; i < 14; i++) {
      const seg = new THREE.Group();
      seg.position.z = -i * 4.0;

      [-1, 1].forEach((side) => {
        const cliff = new THREE.Mesh(new THREE.ConeGeometry(2.2, 7.5, 6), wallMat);
        cliff.position.set(side * 6.2, 0.5, 0);
        seg.add(cliff);
      });
      this.group.add(seg);
      this.canyonSegments.push(seg);
    }
  }

  _spawnWyvern() {
    const wyvernGroup = new THREE.Group();
    const spawnX = (Math.random() - 0.5) * 5.6;
    const spawnY = -0.8 + Math.random() * 2.5;
    wyvernGroup.position.set(spawnX, spawnY, -36);

    // Semi-transparent X-Ray Wyvern body + skeleton + blazing Red Rune Stone inside chest!
    const boneMat = createBoneMaterial({ boneTint: '#d8c2c8' });
    const runeMat = createConduitMaterial({
      color: '#ff1e42',
      secondary: '#ff9e44',
      pulseSpeed: 12.0,
      alwaysFaintlyVisible: true
    });

    const torso = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.9, 8), boneMat);
    torso.rotation.x = Math.PI / 2;
    wyvernGroup.add(torso);

    // The Glowing Red Rune Stone Core (The Target!)
    const runeStone = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 1), runeMat);
    wyvernGroup.add(runeStone);

    const targetRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.46, 0.025, 8, 28),
      runeMat
    );
    wyvernGroup.add(targetRing);

    // Wyvern Wings
    const wWingGeo = new THREE.BoxGeometry(2.6, 0.06, 0.55);
    const wWings = new THREE.Mesh(wWingGeo, boneMat);
    wyvernGroup.add(wWings);

    this.group.add(wyvernGroup);
    this.wyverns.push({
      mesh: wyvernGroup,
      wings: wWings,
      runeStone,
      speed: 10.5 + Math.random() * 3.5,
      swayOffset: Math.random() * Math.PI * 2
    });
  }

  _spawnWardOrb() {
    const orbMat = createConduitMaterial({
      color: '#f4c55c',
      secondary: '#7ce8ff',
      pulseSpeed: 8.0,
      alwaysFaintlyVisible: true
    });
    const orbMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.26, 2), orbMat);
    orbMesh.position.set((Math.random() - 0.5) * 5.0, -0.6 + Math.random() * 2.2, -34);
    this.group.add(orbMesh);
    this.orbs.push({ mesh: orbMesh, speed: 11.0 });
  }

  _spawnPillar() {
    const pillarMat = createExteriorMaterial({
      baseColor: '#141c2c',
      specularColor: '#ff2a4b',
      scalePattern: 0.0
    });
    const x = (Math.random() - 0.5) * 5.2;
    const pillar = new THREE.Mesh(new THREE.ConeGeometry(0.58, 5.2, 7), pillarMat);
    pillar.position.set(x, -1.1, -38);
    this.group.add(pillar);
    this.pillars.push({ mesh: pillar, speed: 12.0 });
  }

  fireLightningBolt() {
    if (this.gameStatus !== 'playing') return;
    this.audio.playPulseChime(1.45);

    const boltMat = new THREE.MeshBasicMaterial({ color: '#8ce7ff' });
    const boltGroup = new THREE.Group();
    boltGroup.position.copy(this.playerDragon.position).add(new THREE.Vector3(0, 0.1, -0.6));

    // Jagged lightning spear
    const spear = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 6), boltMat);
    spear.rotation.x = Math.PI / 2;
    boltGroup.add(spear);

    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.025, 6, 18), boltMat);
    boltGroup.add(halo);

    // Auto-assist aim slightly toward nearest Wyvern in front of player so combat feels amazing!
    const vel = new THREE.Vector3(0, 0, -42);
    let nearestWyvern = null;
    let bestDist = 2.6; // Generous lock-on cone radius
    this.wyverns.forEach((w) => {
      if (w.mesh.position.z < boltGroup.position.z) {
        const dXY = Math.hypot(
          w.mesh.position.x - boltGroup.position.x,
          w.mesh.position.y - boltGroup.position.y
        );
        if (dXY < bestDist) {
          bestDist = dXY;
          nearestWyvern = w;
        }
      }
    });

    if (nearestWyvern) {
      const dir = nearestWyvern.mesh.position.clone().sub(boltGroup.position).normalize();
      vel.copy(dir.multiplyScalar(44));
    }

    this.group.add(boltGroup);
    this.bolts.push({ mesh: boltGroup, vel });
  }

  _spawnExplosion(pos, colorHex = '#ff2a4b') {
    const count = 12;
    const expGroup = new THREE.Group();
    expGroup.position.copy(pos);
    const mat = new THREE.MeshBasicMaterial({ color: colorHex });
    const parts = [];
    for (let i = 0; i < count; i++) {
      const p = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), mat);
      const v = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );
      expGroup.add(p);
      parts.push({ mesh: p, vel: v });
    }
    this.group.add(expGroup);
    this.explosions.push({ group: expGroup, parts, life: 0.45 });
  }

  update(dt, elapsed) {
    if (!this.isActive) return;

    if (this.gameStatus === 'playing') {
      // Keyboard steering support
      const keySpeed = 4.2 * dt;
      if (this.keys.left) this.targetPos.x = Math.max(-3.2, this.targetPos.x - keySpeed);
      if (this.keys.right) this.targetPos.x = Math.min(3.2, this.targetPos.x + keySpeed);
      if (this.keys.up) this.targetPos.y = Math.min(2.0, this.targetPos.y + keySpeed);
      if (this.keys.down) this.targetPos.y = Math.max(-1.4, this.targetPos.y - keySpeed);

      // Smoothly move Tairn toward target position
      const prevX = this.playerPos.x;
      this.playerPos.lerp(this.targetPos, 0.16);
      this.playerDragon.position.x = this.playerPos.x;
      this.playerDragon.position.y = this.playerPos.y;

      // Dynamic banking roll & wing flap
      const roll = THREE.MathUtils.clamp((prevX - this.playerPos.x) * 3.5, -0.55, 0.55);
      this.playerDragon.rotation.z = THREE.MathUtils.lerp(this.playerDragon.rotation.z, roll, 0.2);
      const flap = Math.sin(elapsed * 11.0) * 0.38;
      this.leftWing.rotation.z = flap;
      this.rightWing.rotation.z = -flap;

      // Subtle camera follow
      this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, this.playerPos.x * 0.35, 0.1);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, 1.35 + this.playerPos.y * 0.25, 0.1);

      // Scroll Canyon Segments
      this.canyonSegments.forEach((seg) => {
        seg.position.z += 16 * dt;
        if (seg.position.z > 6) seg.position.z -= 14 * 4.0;
      });

      // Spawn timers
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this._spawnWyvern();
        this.spawnTimer = 1.35;
      }

      this.orbTimer -= dt;
      if (this.orbTimer <= 0) {
        this._spawnWardOrb();
        this.orbTimer = 2.6;
      }

      this.pillarTimer -= dt;
      if (this.pillarTimer <= 0) {
        this._spawnPillar();
        this.pillarTimer = 2.4;
      }

      // Update Lightning Bolts & Check Hits on Wyverns
      for (let b = this.bolts.length - 1; b >= 0; b--) {
        const bolt = this.bolts[b];
        bolt.mesh.position.addScaledVector(bolt.vel, dt);

        let hit = false;
        for (let w = this.wyverns.length - 1; w >= 0; w--) {
          const wyv = this.wyverns[w];
          if (bolt.mesh.position.distanceTo(wyv.mesh.position) < 1.15) {
            // Direct hit on Wyvern Rune Stone!
            hit = true;
            this._spawnExplosion(wyv.mesh.position, '#ff2a4b');
            this.group.remove(wyv.mesh);
            this.wyverns.splice(w, 1);

            this.score += 250;
            this.wyvernsKilled += 1;
            this.audio.playThunderAndLightning();
            this._updateHUD(`DIRECT HIT! Shattered Wyvern Rune Stone! (${this.wyvernsKilled}/${this.targetKills})`);

            if (this.wyvernsKilled >= this.targetKills) {
              this.gameStatus = 'won';
              this._updateHUD('🏆 VICTORY! You shattered 10 Wyvern Rune Stones and defended Basgiath Skies!');
            }
            break;
          }
        }

        if (hit || bolt.mesh.position.z < -42) {
          this.group.remove(bolt.mesh);
          this.bolts.splice(b, 1);
        }
      }

      // Update Wyverns
      for (let w = this.wyverns.length - 1; w >= 0; w--) {
        const wyv = this.wyverns[w];
        wyv.mesh.position.z += wyv.speed * dt;
        wyv.mesh.position.x += Math.sin(elapsed * 2.5 + wyv.swayOffset) * dt * 1.1;
        wyv.wings.rotation.z = Math.sin(elapsed * 9.0 + wyv.swayOffset) * 0.28;
        wyv.runeStone.rotation.y += dt * 4.0;

        if (wyv.mesh.position.distanceTo(this.playerDragon.position) < 0.95) {
          this._spawnExplosion(wyv.mesh.position, '#ff2a4b');
          this.group.remove(wyv.mesh);
          this.wyverns.splice(w, 1);
          this.shield = Math.max(0, this.shield - 25);
          this.audio.playThunderAndLightning();
          this._updateHUD('⚠ WYVERN COLLISION! Click or press SPACE to shoot them before they reach Tairn!');
          if (this.shield <= 0) {
            this.gameStatus = 'lost';
            this._updateHUD('SHIELD DEPLETED! Click "↻ PLAY AGAIN" to launch back into the storm.');
          }
        } else if (wyv.mesh.position.z > 4.5) {
          this.group.remove(wyv.mesh);
          this.wyverns.splice(w, 1);
        }
      }

      // Update Golden Ward Orbs
      for (let o = this.orbs.length - 1; o >= 0; o--) {
        const orb = this.orbs[o];
        orb.mesh.position.z += orb.speed * dt;
        orb.mesh.rotation.y += dt * 3.0;

        if (orb.mesh.position.distanceTo(this.playerDragon.position) < 0.95) {
          this._spawnExplosion(orb.mesh.position, '#f4c55c');
          this.group.remove(orb.mesh);
          this.orbs.splice(o, 1);
          this.score += 100;
          this.shield = Math.min(100, this.shield + 20);
          this.audio.playPulseChime(1.65);
          this._updateHUD('✦ COLLECTED GOLDEN FEATHERTAIL ORB! (+100 PTS & +20% Shield)');
        } else if (orb.mesh.position.z > 4.5) {
          this.group.remove(orb.mesh);
          this.orbs.splice(o, 1);
        }
      }

      // Update Canyon Pillars
      for (let p = this.pillars.length - 1; p >= 0; p--) {
        const pil = this.pillars[p];
        pil.mesh.position.z += pil.speed * dt;
        if (
          Math.abs(pil.mesh.position.z - this.playerDragon.position.z) < 0.65 &&
          Math.abs(pil.mesh.position.x - this.playerDragon.position.x) < 0.68 &&
          this.playerDragon.position.y < 1.1
        ) {
          this._spawnExplosion(this.playerDragon.position, '#ff851b');
          this.group.remove(pil.mesh);
          this.pillars.splice(p, 1);
          this.shield = Math.max(0, this.shield - 20);
          this.audio.playThunderAndLightning();
          this._updateHUD('⚠ CLIPPED A CANYON SPIRE! Steer left/right or fly higher to evade!');
          if (this.shield <= 0) {
            this.gameStatus = 'lost';
            this._updateHUD('SHIELD DEPLETED! Click "↻ PLAY AGAIN" to launch back into the storm.');
          }
        } else if (pil.mesh.position.z > 4.5) {
          this.group.remove(pil.mesh);
          this.pillars.splice(p, 1);
        }
      }
    }

    // Animate 3D particle explosions
    for (let e = this.explosions.length - 1; e >= 0; e--) {
      const exp = this.explosions[e];
      exp.life -= dt;
      exp.parts.forEach((pt) => {
        pt.mesh.position.addScaledVector(pt.vel, dt);
        pt.mesh.scale.multiplyScalar(0.92);
      });
      if (exp.life <= 0) {
        this.group.remove(exp.group);
        this.explosions.splice(e, 1);
      }
    }

    this._updateHUD();
  }

  _updateHUD(statusMessage = null) {
    const progEl = document.getElementById('parapet-progress-fill');
    const progText = document.getElementById('parapet-progress-text');
    const shieldFill = document.getElementById('parapet-shield-fill');
    const windLabel = document.getElementById('parapet-wind-readout');
    const msgEl = document.getElementById('parapet-status-msg');

    const killPct = Math.min(100, Math.round((this.wyvernsKilled / this.targetKills) * 100));
    if (progEl) progEl.style.width = `${killPct}%`;
    if (progText) progText.textContent = `${this.wyvernsKilled} / ${this.targetKills} Wyverns (${this.score} PTS)`;
    if (shieldFill) shieldFill.style.width = `${this.shield}%`;
    if (windLabel) windLabel.textContent = `${this.shield}% INTEGRITY`;
    if (statusMessage && msgEl) {
      msgEl.textContent = statusMessage;
    }
  }
}
