// ============================================================================
// FOURTH WING: THE EMPYREAN ARCHIVE — "Wielder of the Storm" Interactive Game
// Move your X-Ray Sight over swooping Wyverns to reveal the glowing Red Rune
// Stone inside their ribcage, then Click to strike them down with Lightning!
// ============================================================================

export class StormDefenseGame {
  constructor(canvas, audio) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;

    this.width = 600;
    this.height = 310;
    this.mouseX = 300;
    this.mouseY = 155;
    this.lensRadius = 78;

    this.kills = 0;
    this.wardHealth = 100;
    this.wyverns = [];
    this.lightningBolts = [];
    this.particles = [];
    this.spawnTimer = 0;

    this._resize();
    window.addEventListener('resize', () => this._resize());
    this._bindEvents();
    this._spawnWyvern();
    this._spawnWyvern();
  }

  _resize() {
    if (!this.canvas.parentElement) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = Math.max(300, rect.width);
    this.height = Math.max(240, rect.height);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  _bindEvents() {
    this.canvas.addEventListener('pointermove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    this.canvas.addEventListener('pointerdown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      this.strikeLightning(this.mouseX, this.mouseY);
    });
  }

  reset() {
    this.kills = 0;
    this.wardHealth = 100;
    this.wyverns = [];
    this.lightningBolts = [];
    this.particles = [];
    this._spawnWyvern();
    this._spawnWyvern();
    this._updateReadout('Wave reset! Hover over a Wyvern and click to shatter its Rune Stone.');
  }

  _spawnWyvern() {
    if (this.wyverns.length >= 4) return;
    const fromLeft = Math.random() < 0.5;
    this.wyverns.push({
      x: fromLeft ? -40 : this.width + 40,
      y: 45 + Math.random() * (this.height - 125),
      vx: (fromLeft ? 1 : -1) * (48 + Math.random() * 42),
      vy: (Math.random() - 0.5) * 18,
      wingPhase: Math.random() * Math.PI * 2,
      scale: 0.85 + Math.random() * 0.35
    });
  }

  strikeLightning(tx, ty) {
    // Find nearest Wyvern within generous strike range (110px)
    let hitWyvernIdx = -1;
    let bestDist = 110;
    this.wyverns.forEach((w, idx) => {
      const d = Math.hypot(w.x - tx, w.y - ty);
      if (d < bestDist) {
        bestDist = d;
        hitWyvernIdx = idx;
      }
    });

    const targetX = hitWyvernIdx >= 0 ? this.wyverns[hitWyvernIdx].x : tx;
    const targetY = hitWyvernIdx >= 0 ? this.wyverns[hitWyvernIdx].y : ty;

    // Create jagged branching lightning bolt from bottom center to target
    const segments = [];
    let cx = this.width * 0.5;
    let cy = this.height;
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const nx = cx + (targetX - cx) * t + (i < steps ? (Math.random() - 0.5) * 32 : 0);
      const ny = cy + (targetY - cy) * t + (i < steps ? (Math.random() - 0.5) * 16 : 0);
      segments.push({ x1: cx, y1: cy, x2: nx, y2: ny });
      cx = nx;
      cy = ny;
    }
    this.lightningBolts.push({ segments, alpha: 1.0 });

    if (hitWyvernIdx >= 0) {
      const w = this.wyverns[hitWyvernIdx];
      this._spawnExplosion(w.x, w.y);
      this.wyverns.splice(hitWyvernIdx, 1);
      this.kills += 1;
      if (this.audio) this.audio.playThunderAndLightning();
      this._updateReadout(`⚡ DIRECT HIT! Shattered Wyvern Rune Stone! (${this.kills} Shattered)`);
      setTimeout(() => this._spawnWyvern(), 450);
    } else {
      if (this.audio) this.audio.playPulseChime(1.3);
      this._updateReadout('Aim your X-Ray Sight over a swooping Wyvern and click to strike!');
    }
  }

  _spawnExplosion(x, y) {
    for (let i = 0; i < 22; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 30 + Math.random() * 110;
      this.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 0.65,
        color: i % 2 === 0 ? '#ff3355' : '#ffe08a'
      });
    }
  }

  _updateReadout(statusMsg = null) {
    const scoreEl = document.getElementById('storm-score-readout');
    if (scoreEl) {
      scoreEl.textContent = `WYVERNS SHATTERED: ${this.kills} • WARD: ${this.wardHealth}%`;
    }
    if (statusMsg) {
      const st = document.getElementById('storm-status-text');
      if (st) st.textContent = statusMsg;
    }
  }

  updateAndRender(dt, elapsed) {
    const ctx = this.ctx;
    const W = this.width;
    const H = this.height;

    ctx.clearRect(0, 0, W, H);

    // Subtle Golden Ward Dome arch at bottom of canvas
    ctx.save();
    ctx.strokeStyle = 'rgba(229, 184, 92, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(W * 0.5, H + 110, 175, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.restore();

    // Spawn timer
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this._spawnWyvern();
      this.spawnTimer = 2.1;
    }

    // Update & Draw Wyverns
    for (let i = this.wyverns.length - 1; i >= 0; i--) {
      const w = this.wyverns[i];
      w.x += w.vx * dt;
      w.y += Math.sin(elapsed * 2.5 + w.wingPhase) * 18 * dt;
      w.wingPhase += dt * 7.5;

      // Wrap around if off screen
      if (w.vx > 0 && w.x > W + 50) w.x = -40;
      if (w.vx < 0 && w.x < -50) w.x = W + 40;

      const distToLens = Math.hypot(w.x - this.mouseX, w.y - this.mouseY);
      const inXray = distToLens < this.lensRadius + 24;

      ctx.save();
      ctx.translate(w.x, w.y);
      ctx.scale(w.scale, w.scale);

      const flapY = Math.sin(w.wingPhase) * 16;

      if (inXray) {
        // X-RAY SKELETAL VIEW + BLAZING RED RUNE STONE!
        ctx.strokeStyle = '#f6f1e7';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-36, -flapY);
        ctx.lineTo(-14, -6);
        ctx.lineTo(0, 0);
        ctx.lineTo(14, -6);
        ctx.lineTo(36, -flapY);
        ctx.stroke();

        // Ribcage bones
        for (let r = -6; r <= 6; r += 4) {
          ctx.beginPath();
          ctx.moveTo(-7, r);
          ctx.lineTo(7, r);
          ctx.stroke();
        }

        // Blazing Crimson Rune Stone Target in Chest
        ctx.fillStyle = '#ff2e55';
        ctx.shadowColor = '#ff2e55';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
        ctx.fill();

        // Target lock ring
        ctx.strokeStyle = '#ffe08a';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 0, 14 + Math.sin(elapsed * 10) * 2, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Dark Exterior Wyvern Silhouette
        ctx.fillStyle = '#182236';
        ctx.strokeStyle = 'rgba(94, 203, 255, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(14, -6);
        ctx.lineTo(38, -flapY);
        ctx.lineTo(16, 6);
        ctx.lineTo(0, 16);
        ctx.lineTo(-16, 6);
        ctx.lineTo(-38, -flapY);
        ctx.lineTo(-14, -6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw X-Ray Aiming Lens around Cursor
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 224, 138, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(this.mouseX, this.mouseY, this.lensRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(94, 203, 255, 0.06)';
    ctx.fill();
    ctx.restore();

    // Draw Active Lightning Bolts
    for (let b = this.lightningBolts.length - 1; b >= 0; b--) {
      const bolt = this.lightningBolts[b];
      bolt.alpha -= dt * 3.2;
      if (bolt.alpha <= 0) {
        this.lightningBolts.splice(b, 1);
        continue;
      }
      ctx.save();
      ctx.strokeStyle = `rgba(140, 235, 255, ${bolt.alpha})`;
      ctx.shadowColor = '#5ecbff';
      ctx.shadowBlur = 18;
      ctx.lineWidth = 3;
      ctx.beginPath();
      bolt.segments.forEach((s) => {
        ctx.moveTo(s.x1, s.y1);
        ctx.lineTo(s.x2, s.y2);
      });
      ctx.stroke();
      ctx.restore();
    }

    // Draw Explosion Particles
    for (let p = this.particles.length - 1; p >= 0; p--) {
      const pt = this.particles[p];
      pt.life -= dt;
      if (pt.life <= 0) {
        this.particles.splice(p, 1);
        continue;
      }
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
