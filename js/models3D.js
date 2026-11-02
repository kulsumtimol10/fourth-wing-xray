// ============================================================================
// FOURTH WING: THE EMPYREAN ARCHIVE — 3D Interactive Reliquary Artifacts
// High-detail PBR & Emissive 3D Artifacts for the 360° Reliquary Viewer:
// 1. The Black-Iron Wardstone Cauldron & Seven Dragon-Flame Pillars
// 2. The Dual-Bond Relic Astrolabe & Magma Heart Core
// 3. Captured Wyvern Dark-Magic Rune Stone
// ============================================================================

import * as THREE from 'three';

export function buildArtifact3D(artifactId = 'wardstone') {
  const root = new THREE.Group();

  const blackIronMat = new THREE.MeshStandardMaterial({
    color: '#141822',
    metalness: 0.88,
    roughness: 0.28
  });

  const burnishedGoldMat = new THREE.MeshStandardMaterial({
    color: '#e5b85c',
    emissive: '#8a5a10',
    emissiveIntensity: 0.45,
    metalness: 0.92,
    roughness: 0.18
  });

  const glowingGoldMat = new THREE.MeshBasicMaterial({
    color: '#ffe08a'
  });

  const cyanLightningMat = new THREE.MeshBasicMaterial({
    color: '#5ecbff'
  });

  const crimsonVeninMat = new THREE.MeshBasicMaterial({
    color: '#ff2e55'
  });

  if (artifactId === 'wardstone') {
    // --- 01. THE BLACK-IRON WARDSTONE CAULDRON & SEVEN BREED PILLARS ---
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.75, 2.05, 0.28, 32),
      blackIronMat
    );
    pedestal.position.y = -1.15;
    root.add(pedestal);

    // Glowing Geodesic Rune Rings on Pedestal Floor
    [1.25, 1.65, 1.95].forEach((r, idx) => {
      const floorRing = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.016, 10, 64),
        idx === 1 ? cyanLightningMat : glowingGoldMat
      );
      floorRing.rotation.x = Math.PI / 2;
      floorRing.position.y = -1.0;
      root.add(floorRing);
    });

    // Sculpted Black-Iron Cauldron Bowl
    const cauldronGroup = new THREE.Group();
    cauldronGroup.position.y = -0.35;
    root.add(cauldronGroup);

    const bowl = new THREE.Mesh(
      new THREE.SphereGeometry(0.82, 32, 24, 0, Math.PI * 2, Math.PI * 0.28, Math.PI * 0.72),
      blackIronMat
    );
    cauldronGroup.add(bowl);

    const lipRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.74, 0.065, 16, 48),
      burnishedGoldMat
    );
    lipRing.rotation.x = Math.PI / 2;
    lipRing.position.y = 0.36;
    cauldronGroup.add(lipRing);

    // Molten Golden Dragonfire Core inside the Cauldron
    const moltenCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.68, 0.5, 0.18, 32),
      glowingGoldMat
    );
    moltenCore.position.y = 0.28;
    cauldronGroup.add(moltenCore);

    // Engraved Runic Equatorial Band around Cauldron
    const runeBand = new THREE.Mesh(
      new THREE.TorusGeometry(0.83, 0.022, 10, 48),
      glowingGoldMat
    );
    runeBand.rotation.x = Math.PI / 2;
    cauldronGroup.add(runeBand);

    // 7 Orbiting Dragon-Breed Flame Crystals (6 Gold + 1 Iridescent Seventh Breed!)
    const pillarsGroup = new THREE.Group();
    root.add(pillarsGroup);

    for (let i = 0; i < 7; i++) {
      const ang = (i / 7) * Math.PI * 2;
      const px = Math.cos(ang) * 1.48;
      const pz = Math.sin(ang) * 1.48;
      const isSeventh = i === 0;

      const obelisk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.14, 1.15, 6),
        blackIronMat
      );
      obelisk.position.set(px, -0.45, pz);
      pillarsGroup.add(obelisk);

      // Floating Flame Crystal above each pillar
      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.18, 1),
        isSeventh ? cyanLightningMat : glowingGoldMat
      );
      crystal.scale.set(0.75, 1.65, 0.75);
      crystal.position.set(px, 0.45, pz);
      crystal.userData.baseY = 0.45;
      crystal.userData.phase = i * 0.9;
      pillarsGroup.add(crystal);
    }

    // Shimmering Geodesic Ward Dome Arching Over the Cauldron
    const domeWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.15, 2),
      new THREE.MeshBasicMaterial({
        color: '#e5b85c',
        wireframe: true,
        transparent: true,
        opacity: 0.18
      })
    );
    domeWire.position.y = 0.1;
    root.add(domeWire);

    root.userData.updateAnimation = (t) => {
      pillarsGroup.rotation.y = t * 0.25;
      domeWire.rotation.y = -t * 0.12;
      pillarsGroup.children.forEach((child) => {
        if (child.userData.baseY !== undefined) {
          child.position.y = child.userData.baseY + Math.sin(t * 2.8 + child.userData.phase) * 0.12;
          child.rotation.y = t * 1.8;
        }
      });
    };
  } else if (artifactId === 'relic-core') {
    // --- 02. THE DUAL-BOND RELIC ASTROLABE & MAGMA HEART CORE ---
    const heartCore = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.58, 3),
      glowingGoldMat
    );
    heartCore.scale.set(1.0, 1.25, 0.95);
    root.add(heartCore);

    const innerCage = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.72, 1),
      new THREE.MeshBasicMaterial({
        color: '#5ecbff',
        wireframe: true,
        transparent: true,
        opacity: 0.65
      })
    );
    root.add(innerCage);

    // 4 Concentric Gyroscopic Astrolabe Rings (Tairn, Andarna, Violet, Xaden)
    const rings = [];
    const radii = [1.05, 1.32, 1.58, 1.84];
    radii.forEach((r, idx) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.032, 16, 64),
        idx % 2 === 0 ? burnishedGoldMat : cyanLightningMat
      );
      root.add(ring);
      rings.push(ring);
    });

    root.userData.updateAnimation = (t) => {
      const beat = 1.0 + Math.pow(Math.sin(t * 3.4), 6.0) * 0.18;
      heartCore.scale.set(beat, beat * 1.22, beat * 0.95);
      innerCage.rotation.y = t * 0.8;
      innerCage.rotation.x = t * 0.5;
      rings.forEach((r, idx) => {
        r.rotation.x = t * (0.4 + idx * 0.18) * (idx % 2 === 0 ? 1 : -1);
        r.rotation.y = t * (0.55 - idx * 0.1);
      });
    };
  } else {
    // --- 03. CAPTURED WYVERN DARK-MAGIC RUNE STONE ---
    const boulder = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.95, 1),
      blackIronMat
    );
    boulder.scale.set(0.9, 1.25, 0.85);
    root.add(boulder);

    // Glowing Crimson Venin Rune Matrix Cage around the Stone
    const runeCage = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.99, 1),
      new THREE.MeshBasicMaterial({
        color: '#ff2e55',
        wireframe: true
      })
    );
    runeCage.scale.set(0.9, 1.25, 0.85);
    root.add(runeCage);

    const darkRings = [];
    [1.35, 1.65].forEach((r, idx) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.024, 12, 48),
        crimsonVeninMat
      );
      root.add(ring);
      darkRings.push(ring);
    });

    root.userData.updateAnimation = (t) => {
      boulder.rotation.y = t * 0.45;
      runeCage.rotation.y = t * 0.45;
      boulder.position.y = Math.sin(t * 2.2) * 0.1;
      runeCage.position.y = boulder.position.y;
      darkRings[0].rotation.x = t * 0.7;
      darkRings[0].rotation.y = t * 0.4;
      darkRings[1].rotation.z = -t * 0.6;
      darkRings[1].rotation.x = t * 0.3;
    };
  }

  return root;
}
