// ============================================================================
// FOURTH WING: CODEX OCULUS — Procedural 3D Anatomical & Architectural Models
// Builds multi-layered Exterior, Vascular/Signet, and Deep Skeletal meshes
// for Dragons (Tairn, Andarna, Wyvern), Riders (Violet, Xaden), and Basgiath.
// ============================================================================

import * as THREE from 'three';
import {
  createExteriorMaterial,
  createBoneMaterial,
  createConduitMaterial
} from './xrayShader.js';

// Helper to create a 3D tube along a list of Vector3 points
function createTubeFromPoints(points, radius, material, tubularSegments = 36, radialSegments = 8) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
  return new THREE.Mesh(geo, material);
}

// ============================================================================
// 1. DRAGON ANATOMY 3D BUILDER (Tairn, Andarna, Wyvern)
// ============================================================================
export function buildDragonModel(specimenId = 'tairn', customColors = null) {
  const root = new THREE.Group();
  root.name = `dragon-${specimenId}`;

  const isAndarna = specimenId === 'andarna';
  const isWyvern = specimenId === 'wyvern';

  const scaleFactor = isAndarna ? 0.78 : isWyvern ? 0.92 : 1.05;
  root.scale.setScalar(scaleFactor);

  const primaryHex = customColors?.colorHex || (isAndarna ? '#f4c55c' : isWyvern ? '#ff2a4b' : '#38b6ff');
  const secondaryHex = customColors?.secondaryHex || (isAndarna ? '#ff9e44' : isWyvern ? '#9e0b22' : '#f4c55c');
  const hideHex = customColors?.hideHex || (isAndarna ? '#3a2b10' : isWyvern ? '#1a151c' : '#080b11');

  const extMat = createExteriorMaterial({
    baseColor: hideHex,
    specularColor: primaryHex,
    scalePattern: 1.0
  });
  const wingMembraneMat = createExteriorMaterial({
    baseColor: isAndarna ? '#2c1f0b' : '#0b0e17',
    specularColor: secondaryHex,
    scalePattern: 1.0
  });
  const boneMat = createBoneMaterial({
    boneTint: isWyvern ? '#d6c5c8' : '#ebe5d5'
  });
  const conduitMat = createConduitMaterial({
    color: primaryHex,
    secondary: secondaryHex,
    pulseSpeed: isWyvern ? 4.0 : 7.0,
    alwaysFaintlyVisible: true
  });
  const pyroMat = createConduitMaterial({
    color: isWyvern ? '#00e5ff' : '#ff6b1a',
    secondary: isWyvern ? '#ff2a4b' : '#ffd966',
    pulseSpeed: 9.0,
    alwaysFaintlyVisible: false
  });

  // Groups for animation
  const leftWingGroup = new THREE.Group();
  const rightWingGroup = new THREE.Group();
  const heartGroup = new THREE.Group();
  const tailGroup = new THREE.Group();

  // Spine curve from tail [-3.8] through torso [0] up sinuous neck to head [3.1]
  const spinePts = [
    new THREE.Vector3(-3.9, 0.25, 0),
    new THREE.Vector3(-2.8, 0.12, 0),
    new THREE.Vector3(-1.6, 0.32, 0),
    new THREE.Vector3(-0.5, 0.55, 0),
    new THREE.Vector3(0.6, 0.62, 0),
    new THREE.Vector3(1.6, 0.85, 0),
    new THREE.Vector3(2.35, 1.35, 0),
    new THREE.Vector3(2.95, 1.38, 0)
  ];
  const spineCurve = new THREE.CatmullRomCurve3(spinePts);

  // --- A. EXTERIOR MUSCULATURE & SCALES ALONG SPINE ---
  const bodyRadii = [0.12, 0.22, 0.42, 0.68, 0.78, 0.52, 0.36, 0.28];
  const bodySegments = 44;
  for (let i = 0; i < bodySegments; i++) {
    const t = i / (bodySegments - 1);
    const pos = spineCurve.getPointAt(t);
    const tangent = spineCurve.getTangentAt(t);
    const idxFloat = t * (bodyRadii.length - 1);
    const idx0 = Math.floor(idxFloat);
    const idx1 = Math.min(bodyRadii.length - 1, idx0 + 1);
    const r = THREE.MathUtils.lerp(bodyRadii[idx0], bodyRadii[idx1], idxFloat - idx0);

    // Sculpted overlapping scale ring segment
    const segGeo = new THREE.SphereGeometry(r, 14, 12);
    segGeo.scale(1.35, 0.92, 0.88);
    const segMesh = new THREE.Mesh(segGeo, extMat);
    segMesh.position.copy(pos);
    segMesh.lookAt(pos.clone().add(tangent));
    root.add(segMesh);

    // Dorsal ridge armor plates
    if (i % 2 === 0 && t > 0.06 && t < 0.94) {
      const spikeH = 0.14 + Math.sin(t * Math.PI) * 0.22;
      const spikeGeo = new THREE.ConeGeometry(0.06, spikeH, 5);
      const spike = new THREE.Mesh(spikeGeo, extMat);
      spike.position.copy(pos).add(new THREE.Vector3(0, r * 0.88 + spikeH * 0.35, 0));
      spike.rotation.z = -0.38;
      root.add(spike);
    }
  }

  // --- B. SCULPTED DRACONIC HEAD, HORNS & JAWS (Exterior + Skull Inside) ---
  const headPos = new THREE.Vector3(3.05, 1.32, 0);
  const headGroup = new THREE.Group();
  headGroup.position.copy(headPos);
  root.add(headGroup);

  // Exterior Armored Cranium & Snout
  const snoutGeo = new THREE.ConeGeometry(0.36, 0.95, 8);
  snoutGeo.rotateZ(-Math.PI / 2);
  snoutGeo.scale(1.0, 0.68, 0.82);
  const snoutMesh = new THREE.Mesh(snoutGeo, extMat);
  snoutMesh.position.set(0.28, 0.02, 0);
  headGroup.add(snoutMesh);

  const jawGeo = new THREE.ConeGeometry(0.28, 0.82, 7);
  jawGeo.rotateZ(-Math.PI / 2);
  jawGeo.scale(1.0, 0.45, 0.72);
  const jawMesh = new THREE.Mesh(jawGeo, extMat);
  jawMesh.position.set(0.22, -0.14, 0);
  jawMesh.rotation.z = -0.12;
  headGroup.add(jawMesh);

  // Glowing Golden / Crimson Eyes
  const eyeMat = new THREE.MeshBasicMaterial({
    color: isWyvern ? '#ff1e42' : '#ffd54f'
  });
  [-1, 1].forEach((side) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 10), eyeMat);
    eye.position.set(0.18, 0.08, side * 0.22);
    headGroup.add(eye);

    // Swept-back Occipital Horns (Exterior + Bone core)
    const hornPts = [
      new THREE.Vector3(-0.05, 0.14, side * 0.16),
      new THREE.Vector3(-0.45, 0.38, side * 0.34),
      new THREE.Vector3(-0.95, 0.56, side * 0.46)
    ];
    headGroup.add(createTubeFromPoints(hornPts, 0.055, extMat, 16, 7));
    headGroup.add(createTubeFromPoints(hornPts, 0.038, boneMat, 16, 6));
  });

  // Deep Layer: Articulated Dragon Skull & Fangs inside Head
  const skullGeo = new THREE.ConeGeometry(0.29, 0.84, 8);
  skullGeo.rotateZ(-Math.PI / 2);
  skullGeo.scale(1.0, 0.62, 0.75);
  const skullMesh = new THREE.Mesh(skullGeo, boneMat);
  skullMesh.position.set(0.24, 0.02, 0);
  headGroup.add(skullMesh);

  const mandibleGeo = new THREE.ConeGeometry(0.23, 0.74, 7);
  mandibleGeo.rotateZ(-Math.PI / 2);
  mandibleGeo.scale(1.0, 0.38, 0.66);
  const mandibleMesh = new THREE.Mesh(mandibleGeo, boneMat);
  mandibleMesh.position.set(0.2, -0.13, 0);
  mandibleMesh.rotation.z = -0.14;
  headGroup.add(mandibleMesh);

  // Cranial Bond Nexus Core inside the skull
  const cranialCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.13, 2),
    conduitMat
  );
  cranialCore.position.set(-0.08, 0.05, 0);
  headGroup.add(cranialCore);

  // --- C. DEEP SKELETAL VERTEBRAE & RIBCAGE ---
  const numVertebrae = 36;
  for (let i = 0; i < numVertebrae; i++) {
    const t = i / (numVertebrae - 1);
    const pos = spineCurve.getPointAt(t);
    const tangent = spineCurve.getTangentAt(t);
    const vSize = 0.06 + Math.sin(t * Math.PI) * 0.075;

    const vertGeo = new THREE.CylinderGeometry(vSize, vSize * 0.85, 0.13, 8);
    vertGeo.rotateZ(Math.PI / 2);
    const vert = new THREE.Mesh(vertGeo, boneMat);
    vert.position.copy(pos);
    vert.lookAt(pos.clone().add(tangent));
    root.add(vert);

    // Spinous process (bone fin)
    const procGeo = new THREE.BoxGeometry(0.04, vSize * 2.2, 0.03);
    const proc = new THREE.Mesh(procGeo, boneMat);
    proc.position.copy(pos).add(new THREE.Vector3(0, vSize * 1.3, 0));
    proc.rotation.z = -0.3;
    root.add(proc);
  }

  // 12 Pairs of Curved Thoracic Ribs + Sternum Keel
  for (let rIdx = 0; rIdx < 12; rIdx++) {
    const t = 0.34 + (rIdx / 11) * 0.34;
    const spinePos = spineCurve.getPointAt(t);
    const ribArch = Math.sin((rIdx / 11) * Math.PI);
    const ribWidth = 0.32 + ribArch * 0.36;
    const ribDrop = 0.42 + ribArch * 0.38;

    [-1, 1].forEach((side) => {
      const ribPts = [
        spinePos.clone(),
        spinePos.clone().add(new THREE.Vector3(0.04, -ribDrop * 0.35, side * ribWidth)),
        spinePos.clone().add(new THREE.Vector3(-0.05, -ribDrop * 0.85, side * ribWidth * 0.65)),
        spinePos.clone().add(new THREE.Vector3(-0.1, -ribDrop, side * 0.06))
      ];
      root.add(createTubeFromPoints(ribPts, 0.026, boneMat, 14, 6));
    });
  }

  // Sternum Keel Bone
  const sternumPts = [
    new THREE.Vector3(-0.6, -0.18, 0),
    new THREE.Vector3(0.2, -0.25, 0),
    new THREE.Vector3(1.1, -0.05, 0)
  ];
  root.add(createTubeFromPoints(sternumPts, 0.055, boneMat, 16, 6));

  // --- D. INTERNAL ORGANS: HEART / WYVERN RUNE STONE & PYRO-GLANDS ---
  heartGroup.position.set(0.25, 0.32, 0);
  root.add(heartGroup);

  if (isWyvern) {
    // Wyvern Dark-Magic Carved Rune Stone inside the ribcage!
    const runeStoneGeo = new THREE.DodecahedronGeometry(0.32, 0);
    const runeStoneMat = createExteriorMaterial({
      baseColor: '#261a24',
      specularColor: '#ff2a4b',
      scalePattern: 0.0
    });
    const runeStone = new THREE.Mesh(runeStoneGeo, runeStoneMat);
    heartGroup.add(runeStone);

    // Glowing interlocking venin rune rings around the stone
    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.TorusGeometry(0.35 + r * 0.03, 0.018, 8, 32);
      const ring = new THREE.Mesh(ringGeo, conduitMat);
      ring.rotation.set(r * 1.1, r * 0.8, r * 0.5);
      heartGroup.add(ring);
    }
  } else {
    // True Dragon Four-Chambered Magma Heart & Bond Core
    const heartGeo = new THREE.SphereGeometry(0.28, 18, 18);
    heartGeo.scale(1.25, 0.95, 0.9);
    const heartMesh = new THREE.Mesh(heartGeo, conduitMat);
    heartGroup.add(heartMesh);

    // Golden-Azure Bond Tether Anchor Ring
    const bondHaloGeo = new THREE.TorusGeometry(0.38, 0.022, 10, 40);
    const bondHalo = new THREE.Mesh(bondHaloGeo, pyroMat);
    bondHalo.rotation.x = Math.PI / 3;
    heartGroup.add(bondHalo);
  }

  // Bifurcated Pyro-Chemical Ignition Sacs & Tracheal Flame Ducts
  [-1, 1].forEach((side) => {
    const sacGeo = new THREE.SphereGeometry(0.18, 14, 14);
    sacGeo.scale(1.8, 0.75, 0.7);
    const sac = new THREE.Mesh(sacGeo, pyroMat);
    sac.position.set(1.15, 0.42, side * 0.24);
    sac.rotation.z = 0.28;
    root.add(sac);

    // Tracheal Flame Duct from Sac to Jaw
    const ductPts = [
      new THREE.Vector3(1.25, 0.44, side * 0.22),
      new THREE.Vector3(1.85, 0.82, side * 0.14),
      new THREE.Vector3(2.45, 1.28, side * 0.09),
      new THREE.Vector3(3.15, 1.26, side * 0.05)
    ];
    root.add(createTubeFromPoints(ductPts, 0.024, pyroMat, 20, 6));
  });

  // Main Spinal & Vascular Signet Conduit
  root.add(createTubeFromPoints(spinePts, 0.036, conduitMat, 40, 8));

  // --- E. LIMBS (4 Legs for True Dragons, 2 Hind Legs Only for Wyvern!) ---
  const buildLeg = (hipPos, isFront, side) => {
    const kneePos = hipPos.clone().add(new THREE.Vector3(isFront ? -0.25 : 0.32, -0.58, side * 0.22));
    const anklePos = kneePos.clone().add(new THREE.Vector3(isFront ? 0.35 : -0.35, -0.52, side * 0.05));
    const footPos = anklePos.clone().add(new THREE.Vector3(0.28, -0.22, 0));

    const legPts = [hipPos, kneePos, anklePos, footPos];
    // Exterior muscular leg
    root.add(createTubeFromPoints(legPts, 0.14, extMat, 18, 10));
    // Deep femur / tibia / tarsal bones
    root.add(createTubeFromPoints(legPts, 0.055, boneMat, 18, 8));
    // Arterial signet conduit
    root.add(createTubeFromPoints(legPts, 0.022, conduitMat, 18, 6));

    // 3 Talons
    [-0.1, 0, 0.1].forEach((tOffset) => {
      const clawPts = [
        footPos.clone(),
        footPos.clone().add(new THREE.Vector3(0.24, -0.06, tOffset))
      ];
      root.add(createTubeFromPoints(clawPts, 0.028, boneMat, 8, 6));
    });
  };

  // Hind legs (present on both Dragons and Wyverns)
  [-1, 1].forEach((side) => {
    buildLeg(new THREE.Vector3(-0.75, 0.35, side * 0.42), false, side);
    if (!isWyvern) {
      // Front legs ONLY on true four-legged Dragons!
      buildLeg(new THREE.Vector3(0.95, 0.38, side * 0.46), true, side);
    }
  });

  // --- F. ARTICULATED 5-RAY METACARPAL WINGS ---
  const buildWing = (side) => {
    const wingContainer = side > 0 ? leftWingGroup : rightWingGroup;
    wingContainer.position.set(0.65, 0.72, side * 0.32);
    root.add(wingContainer);

    const shoulder = new THREE.Vector3(0, 0, 0);
    const elbow = new THREE.Vector3(-0.45, 0.48, side * 0.95);
    const wrist = new THREE.Vector3(0.35, 0.92, side * 2.15);
    const wingTip = new THREE.Vector3(-0.65, 1.15, side * 4.45);

    const mainSparPts = [shoulder, elbow, wrist, wingTip];
    // Exterior armored wing leading edge
    wingContainer.add(createTubeFromPoints(mainSparPts, 0.085, extMat, 24, 8));
    // Internal Humerus, Radius/Ulna & Metacarpal Lead Strut
    wingContainer.add(createTubeFromPoints(mainSparPts, 0.045, boneMat, 24, 8));
    // Wing Signet Artery
    wingContainer.add(createTubeFromPoints(mainSparPts, 0.022, conduitMat, 24, 6));

    // 4 Additional Elongated Phalanges (Wing Fingers) radiating from the carpal wrist
    const fingerTips = [
      wingTip,
      new THREE.Vector3(-1.15, 0.65, side * 3.85),
      new THREE.Vector3(-1.55, 0.22, side * 2.95),
      new THREE.Vector3(-1.65, -0.05, side * 1.95),
      new THREE.Vector3(-1.35, -0.18, side * 1.05)
    ];

    for (let f = 1; f < fingerTips.length; f++) {
      const phalanxPts = [
        wrist,
        wrist.clone().lerp(fingerTips[f], 0.5).add(new THREE.Vector3(-0.12, 0.08, 0)),
        fingerTips[f]
      ];
      wingContainer.add(createTubeFromPoints(phalanxPts, 0.038, extMat, 16, 7));
      wingContainer.add(createTubeFromPoints(phalanxPts, 0.024, boneMat, 16, 6));
      wingContainer.add(createTubeFromPoints(phalanxPts, 0.014, conduitMat, 16, 5));
    }

    // Wing Membranes stretched between the phalanges
    for (let m = 0; m < fingerTips.length - 1; m++) {
      const geom = new THREE.BufferGeometry();
      const v0 = wrist;
      const v1 = fingerTips[m];
      const v2 = fingerTips[m + 1];
      const vertices = new Float32Array([
        v0.x, v0.y, v0.z,
        v1.x, v1.y, v1.z,
        v2.x, v2.y, v2.z
      ]);
      geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geom.computeVertexNormals();
      const webMesh = new THREE.Mesh(geom, wingMembraneMat);
      wingContainer.add(webMesh);
    }

    // Inner propatagium membrane (wrist -> elbow -> shoulder/body)
    const innerGeom = new THREE.BufferGeometry();
    const bodyRear = new THREE.Vector3(-1.35, -0.18, side * 0.2);
    const innerVerts = new Float32Array([
      wrist.x, wrist.y, wrist.z,
      fingerTips[4].x, fingerTips[4].y, fingerTips[4].z,
      bodyRear.x, bodyRear.y, bodyRear.z,
      wrist.x, wrist.y, wrist.z,
      bodyRear.x, bodyRear.y, bodyRear.z,
      shoulder.x, shoulder.y, shoulder.z
    ]);
    innerGeom.setAttribute('position', new THREE.BufferAttribute(innerVerts, 3));
    innerGeom.computeVertexNormals();
    wingContainer.add(new THREE.Mesh(innerGeom, wingMembraneMat));
  };

  buildWing(1);
  buildWing(-1);

  // --- G. TAIL WEAPONRY (Morningstartail vs. Feathertail vs. Scorpiontail) ---
  tailGroup.position.set(-3.85, 0.25, 0);
  root.add(tailGroup);

  if (isAndarna) {
    // Feathertail Golden Plume Vanes + Ossicles
    for (let p = -3; p <= 3; p++) {
      const angle = p * 0.22;
      const vaneGeo = new THREE.ConeGeometry(0.08, 0.85, 6);
      vaneGeo.rotateZ(Math.PI / 2);
      vaneGeo.scale(1.0, 0.25, 1.8);
      const vane = new THREE.Mesh(vaneGeo, extMat);
      vane.position.set(-0.32, Math.sin(angle) * 0.08, Math.sin(angle) * 0.38);
      vane.rotation.y = angle;
      tailGroup.add(vane);

      const ossicle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.008, 0.72, 6), boneMat);
      ossicle.rotation.z = Math.PI / 2;
      ossicle.rotation.y = angle;
      ossicle.position.copy(vane.position);
      tailGroup.add(ossicle);
    }
  } else if (isWyvern) {
    // Scorpion / Daggertail Barbed Stinger
    const barbPts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.45, 0.28, 0),
      new THREE.Vector3(-0.25, 0.58, 0),
      new THREE.Vector3(0.05, 0.42, 0)
    ];
    tailGroup.add(createTubeFromPoints(barbPts, 0.09, extMat, 16, 8));
    tailGroup.add(createTubeFromPoints(barbPts, 0.045, boneMat, 16, 6));
  } else {
    // Tairn's Morningstartail Spiked Club Mace!
    const clubMesh = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), extMat);
    clubMesh.scale.set(1.45, 0.95, 0.95);
    tailGroup.add(clubMesh);

    const clubBone = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 14), boneMat);
    clubBone.scale.set(1.4, 0.9, 0.9);
    tailGroup.add(clubBone);

    // 18 Radial Detachable Ossicone Spikes
    for (let s = 0; s < 18; s++) {
      const phi = Math.acos(1 - (2 * (s + 0.5)) / 18);
      const theta = Math.PI * (1 + Math.sqrt(5)) * s;
      const dir = new THREE.Vector3(
        Math.cos(theta) * Math.sin(phi),
        Math.sin(theta) * Math.sin(phi),
        Math.cos(phi)
      ).normalize();

      const spikeOuter = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.42, 6), extMat);
      spikeOuter.position.copy(dir.clone().multiplyScalar(0.35));
      spikeOuter.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      tailGroup.add(spikeOuter);

      const spikeInner = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.36, 6), boneMat);
      spikeInner.position.copy(dir.clone().multiplyScalar(0.32));
      spikeInner.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      tailGroup.add(spikeInner);
    }
  }

  // Real-time anatomical animation hook
  root.userData.updateAnimation = (t) => {
    const flap = Math.sin(t * 1.65) * 0.22;
    leftWingGroup.rotation.x = flap;
    rightWingGroup.rotation.x = -flap;

    // Heartbeat / Rune-stone pulse
    const beat = 1.0 + Math.pow(Math.sin(t * 3.2), 6.0) * 0.16;
    heartGroup.scale.setScalar(beat);

    // Subtle tail sway
    tailGroup.rotation.y = Math.sin(t * 1.2) * 0.14;
    headGroup.rotation.y = Math.sin(t * 0.8) * 0.06;
  };

  return root;
}

// ============================================================================
// 2. RIDER'S CONDUIT 3D BUILDER (Violet Sorrengail & Xaden Riorson)
// ============================================================================
export function buildRiderModel(specimenId = 'violet') {
  const root = new THREE.Group();
  root.name = `rider-${specimenId}`;
  root.scale.setScalar(1.38);
  root.position.y = -0.35;

  const isViolet = specimenId === 'violet';
  const primaryHex = isViolet ? '#7ce8ff' : '#8a64ff';
  const secondaryHex = isViolet ? '#f4c55c' : '#38b6ff';

  const armorMat = createExteriorMaterial({
    baseColor: isViolet ? '#101820' : '#090b12',
    specularColor: primaryHex,
    scalePattern: isViolet ? 1.0 : 0.2 // Dragon-scale corset on Violet!
  });
  const boneMat = createBoneMaterial({
    boneTint: '#eee8da'
  });
  const conduitMat = createConduitMaterial({
    color: primaryHex,
    secondary: secondaryHex,
    pulseSpeed: 8.5,
    alwaysFaintlyVisible: true
  });
  const relicMat = createConduitMaterial({
    color: isViolet ? '#f4c55c' : '#38b6ff',
    secondary: isViolet ? '#7ce8ff' : '#b388ff',
    pulseSpeed: 5.0,
    alwaysFaintlyVisible: true
  });

  // --- A. EXTERIOR SCULPTED RIDER SILHOUETTE & SCALE ARMOR ---
  // Torso (Dragon-Scale Corset / Wingleader Armor)
  const torsoGeo = new THREE.CylinderGeometry(0.32, 0.24, 1.05, 18, 12);
  torsoGeo.scale(1.15, 1.0, 0.72);
  const torsoMesh = new THREE.Mesh(torsoGeo, armorMat);
  torsoMesh.position.set(0, 0.55, 0);
  root.add(torsoMesh);

  // Pelvis / Flight Leathers
  const pelvisGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.38, 16);
  pelvisGeo.scale(1.12, 1.0, 0.74);
  const pelvisMesh = new THREE.Mesh(pelvisGeo, armorMat);
  pelvisMesh.position.set(0, -0.1, 0);
  root.add(pelvisMesh);

  // Head & Neck Exterior
  const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.28, 14), armorMat);
  neckMesh.position.set(0, 1.18, 0);
  root.add(neckMesh);

  const headGeo = new THREE.SphereGeometry(0.22, 20, 20);
  headGeo.scale(0.88, 1.12, 0.95);
  const headMesh = new THREE.Mesh(headGeo, armorMat);
  headMesh.position.set(0, 1.48, 0.02);
  root.add(headMesh);

  // Violet's Iconic Silver-Tipped Braid sweeping over her right shoulder!
  if (isViolet) {
    const braidPts = [
      new THREE.Vector3(0, 1.65, -0.12),
      new THREE.Vector3(0.08, 1.45, -0.24),
      new THREE.Vector3(0.24, 1.15, -0.15),
      new THREE.Vector3(0.32, 0.82, 0.14),
      new THREE.Vector3(0.28, 0.48, 0.24)
    ];
    const braidMat = createConduitMaterial({
      color: '#d8e6f2',
      secondary: '#7ce8ff',
      pulseSpeed: 3.0,
      alwaysFaintlyVisible: true
    });
    root.add(createTubeFromPoints(braidPts, 0.042, braidMat, 24, 8));
  }

  // Strapped Alloy Throwing Daggers along ribs & thighs
  [-1, 1].forEach((side) => {
    for (let d = 0; d < 3; d++) {
      const dagger = new THREE.Mesh(
        new THREE.ConeGeometry(0.018, 0.22, 4),
        relicMat
      );
      dagger.position.set(side * 0.34, 0.38 + d * 0.12, 0.14);
      dagger.rotation.z = side * 0.45;
      root.add(dagger);
    }
  });

  // --- B. DEEP ARTICULATED HUMAN SKELETON ---
  // Cranium & Mandible inside Head
  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.175, 16, 16), boneMat);
  cranium.scale.set(0.86, 1.05, 0.94);
  cranium.position.set(0, 1.51, 0.02);
  root.add(cranium);

  const jawBone = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.12, 10), boneMat);
  jawBone.position.set(0, 1.36, 0.05);
  root.add(jawBone);

  // 24 Human Vertebrae (Cervical, Thoracic, Lumbar)
  for (let v = 0; v < 22; v++) {
    const y = -0.12 + (v / 21) * 1.42;
    const zCurve = Math.sin((v / 21) * Math.PI * 2.0) * 0.035;
    const vert = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.045, 10), boneMat);
    vert.position.set(0, y, -0.08 + zCurve);
    root.add(vert);
  }

  // 10 Pairs of Human Ribs + Sternum
  const sternum = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.48, 0.03), boneMat);
  sternum.position.set(0, 0.68, 0.16);
  root.add(sternum);

  for (let r = 0; r < 10; r++) {
    const y = 0.35 + (r / 9) * 0.56;
    const w = 0.22 + Math.sin((r / 9) * Math.PI) * 0.1;
    [-1, 1].forEach((side) => {
      const ribPts = [
        new THREE.Vector3(0, y, -0.08),
        new THREE.Vector3(side * w, y - 0.02, 0.02),
        new THREE.Vector3(side * (w * 0.65), y - 0.05, 0.15),
        new THREE.Vector3(side * 0.04, y - 0.04, 0.16)
      ];
      root.add(createTubeFromPoints(ribPts, 0.016, boneMat, 14, 6));
    });
  }

  // Pelvis Ilium Iliac Crest
  const pelvisRing = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.045, 10, 24), boneMat);
  pelvisRing.rotation.x = Math.PI / 2.2;
  pelvisRing.scale.set(1.2, 0.75, 1.0);
  pelvisRing.position.set(0, -0.1, 0);
  root.add(pelvisRing);

  // Arms & Legs (Exterior Armor + Internal Humerus/Radius/Ulna & Femur/Tibia + Signet Conduits)
  const handSpheres = [];
  [-1, 1].forEach((side) => {
    // Clavicle
    const clavPts = [
      new THREE.Vector3(0, 0.96, 0.12),
      new THREE.Vector3(side * 0.38, 0.98, 0.02)
    ];
    root.add(createTubeFromPoints(clavPts, 0.022, boneMat, 8, 6));

    // Arm poised in active Signet Channeling Stance
    const shoulder = new THREE.Vector3(side * 0.39, 0.94, 0.0);
    const elbow = new THREE.Vector3(side * 0.56, 0.54, 0.08);
    const wrist = new THREE.Vector3(side * 0.58, 0.32, 0.28);
    const armPts = [shoulder, elbow, wrist];

    root.add(createTubeFromPoints(armPts, 0.085, armorMat, 16, 10));
    root.add(createTubeFromPoints(armPts, 0.034, boneMat, 16, 8));
    root.add(createTubeFromPoints(armPts, 0.02, conduitMat, 20, 6));

    // Channeling Signet Energy Orb in each palm!
    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.11, 2), conduitMat);
    orb.position.copy(wrist).add(new THREE.Vector3(side * 0.04, 0.02, 0.08));
    root.add(orb);
    handSpheres.push(orb);

    // Legs (Hip -> Knee -> Ankle)
    const hip = new THREE.Vector3(side * 0.2, -0.18, 0);
    const knee = new THREE.Vector3(side * 0.23, -0.78, 0.04);
    const ankle = new THREE.Vector3(side * 0.25, -1.35, 0.0);
    const legPts = [hip, knee, ankle];

    root.add(createTubeFromPoints(legPts, 0.115, armorMat, 16, 10));
    root.add(createTubeFromPoints(legPts, 0.044, boneMat, 16, 8));
    root.add(createTubeFromPoints(legPts, 0.016, conduitMat, 16, 6));

    // For Violet: EDS Hypermobile Joint Biomechanical Telemetry Rings at Shoulder & Knee
    if (isViolet) {
      [shoulder, knee].forEach((jointPos) => {
        const edsRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.11, 0.012, 8, 28),
          relicMat
        );
        edsRing.position.copy(jointPos);
        edsRing.rotation.y = side * 0.5;
        root.add(edsRing);
      });
    }
  });

  // --- C. RELIC INSCRIPTIONS & HEART / CRANIAL NEXUS ---
  const riderHeart = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), conduitMat);
  riderHeart.position.set(0.05, 0.68, 0.04);
  root.add(riderHeart);

  // Cranial Bond Node (Dual-Dragon for Violet / Prefrontal Intinnsic + Sgaeyl for Xaden)
  const cranialNode = new THREE.Mesh(new THREE.OctahedronGeometry(0.095, 2), relicMat);
  cranialNode.position.set(0, 1.54, 0.04);
  root.add(cranialNode);

  // Cerebro-Cardiac Main Conduit
  root.add(
    createTubeFromPoints(
      [
        new THREE.Vector3(0, 1.54, 0.04),
        new THREE.Vector3(0, 1.15, -0.02),
        new THREE.Vector3(0.05, 0.68, 0.04),
        new THREE.Vector3(0, 0.15, 0.0)
      ],
      0.026,
      conduitMat,
      20,
      8
    )
  );

  if (isViolet) {
    // Violet's Dorsal Twin-Dragon Relic (Spreading across her upper back)
    [-1, 1].forEach((side) => {
      const relicWingPts = [
        new THREE.Vector3(0, 0.68, -0.22),
        new THREE.Vector3(side * 0.18, 0.82, -0.23),
        new THREE.Vector3(side * 0.32, 0.72, -0.19),
        new THREE.Vector3(side * 0.14, 0.52, -0.22)
      ];
      root.add(createTubeFromPoints(relicWingPts, 0.022, relicMat, 18, 6));
    });
  } else {
    // Xaden's 107 Rebellion Relic spiraling from left wrist up arm across chest to jaw
    const rebPts = [
      new THREE.Vector3(-0.58, 0.34, 0.28),
      new THREE.Vector3(-0.59, 0.55, 0.12),
      new THREE.Vector3(-0.42, 0.88, 0.06),
      new THREE.Vector3(-0.18, 1.05, 0.12),
      new THREE.Vector3(-0.08, 1.32, 0.09)
    ];
    root.add(createTubeFromPoints(rebPts, 0.026, relicMat, 28, 7));

    // Swirling Shadow Tendrils coiling around Xaden
    for (let s = 0; s < 3; s++) {
      const shadowPts = [];
      for (let k = 0; k <= 16; k++) {
        const frac = k / 16;
        const ang = frac * Math.PI * 3.0 + s * 2.1;
        shadowPts.push(
          new THREE.Vector3(
            Math.cos(ang) * (0.48 + frac * 0.25),
            -0.6 + frac * 2.1,
            Math.sin(ang) * (0.48 + frac * 0.25)
          )
        );
      }
      root.add(createTubeFromPoints(shadowPts, 0.024, conduitMat, 32, 6));
    }
  }

  root.userData.updateAnimation = (t) => {
    const pulse = 1.0 + Math.pow(Math.sin(t * 3.8), 4.0) * 0.18;
    riderHeart.scale.setScalar(pulse);
    handSpheres.forEach((orb, idx) => {
      orb.rotation.y = t * 2.5 * (idx === 0 ? 1 : -1);
      orb.rotation.x = t * 1.8;
      orb.scale.setScalar(0.9 + Math.sin(t * 6.0 + idx) * 0.2);
    });
  };

  return root;
}

// ============================================================================
// 3. BASGIATH WAR COLLEGE & SUBTERRANEAN WARDSTONE 3D BUILDER
// ============================================================================
export function buildBasgiathModel() {
  const root = new THREE.Group();
  root.name = 'basgiath-citadel';

  const mountainMat = createExteriorMaterial({
    baseColor: '#0e131d',
    specularColor: '#38b6ff',
    scalePattern: 0.0
  });
  const citadelMat = createExteriorMaterial({
    baseColor: '#171f2e',
    specularColor: '#f4c55c',
    scalePattern: 0.0
  });
  const bedrockBoneMat = createBoneMaterial({
    boneTint: '#c8d4e3'
  });
  const wardMat = createConduitMaterial({
    color: '#f4c55c',
    secondary: '#ffd97d',
    pulseSpeed: 4.5,
    alwaysFaintlyVisible: true
  });
  const tunnelMat = createConduitMaterial({
    color: '#38b6ff',
    secondary: '#7ce8ff',
    pulseSpeed: 6.0,
    alwaysFaintlyVisible: false
  });
  const veninMat = createConduitMaterial({
    color: '#ff1e42',
    secondary: '#9e0b22',
    pulseSpeed: 5.5,
    alwaysFaintlyVisible: true
  });

  // --- A. EXTERIOR TWIN MOUNTAIN PEAKS & CANYON RIFT ---
  const westPeak = new THREE.Mesh(new THREE.ConeGeometry(2.3, 3.4, 7), mountainMat);
  westPeak.position.set(-1.95, -0.35, 0);
  root.add(westPeak);

  const eastPeak = new THREE.Mesh(new THREE.ConeGeometry(2.4, 3.6, 8), mountainMat);
  eastPeak.position.set(1.85, -0.25, 0);
  root.add(eastPeak);

  const centralBase = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.6, 3.6), mountainMat);
  centralBase.position.set(0, -1.35, 0);
  root.add(centralBase);

  // The Parapet spanning the Abyssal Rift!
  const parapetBridge = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.12, 0.18), citadelMat);
  parapetBridge.position.set(0, 0.55, 1.55);
  root.add(parapetBridge);

  // Parapet Internal Stress Fractures & Ley-line (Visible in X-Ray)
  const parapetCore = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.08, 0.14), wardMat);
  parapetCore.position.set(0, 0.55, 1.55);
  root.add(parapetCore);

  // Turrets flanking the Parapet
  [-1.35, 1.35].forEach((xPos) => {
    const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 1.35, 8), citadelMat);
    turret.position.set(xPos, 0.65, 1.55);
    root.add(turret);
  });

  // Riders Quadrant Citadel Towers (East Peak) & Archives Pyramid (West Peak)
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const tower = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 1.1 + (i % 2) * 0.4, 8),
      citadelMat
    );
    tower.position.set(1.55 + Math.cos(angle) * 0.55, 0.85, Math.sin(angle) * 0.55);
    root.add(tower);
  }

  // The Archives Stepped Fortress on West Peak
  const archives = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.15, 4), citadelMat);
  archives.position.set(-1.85, 0.68, -0.55);
  archives.rotation.y = Math.PI / 4;
  root.add(archives);

  // --- B. SUBTERRANEAN ARCHIVES VAULTS & SMUGGLING TUNNELS (X-RAY LAYER) ---
  for (let lvl = 0; lvl < 4; lvl++) {
    const subVault = new THREE.Mesh(
      new THREE.BoxGeometry(0.95 - lvl * 0.1, 0.14, 0.95 - lvl * 0.1),
      bedrockBoneMat
    );
    subVault.position.set(-1.85, 0.15 - lvl * 0.26, -0.55);
    root.add(subVault);
  }

  // Marked Ones' Smuggling Tunnels
  const tunnelPts = [
    new THREE.Vector3(-1.85, -0.55, -0.55),
    new THREE.Vector3(-0.4, -0.65, 0.35),
    new THREE.Vector3(0.95, -0.45, 0.75),
    new THREE.Vector3(2.35, -0.15, 1.15)
  ];
  root.add(createTubeFromPoints(tunnelPts, 0.055, tunnelMat, 32, 8));

  // --- C. THE SUBTERRANEAN WARDSTONE CHAMBER & SEVEN BREED PILLARS ---
  const wardstoneGroup = new THREE.Group();
  wardstoneGroup.position.set(0, -1.15, 0);
  root.add(wardstoneGroup);

  // Cavern Rib-Vaulting (Deep X-Ray Bedrock Structure)
  const cavernDome = new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.65),
    bedrockBoneMat
  );
  cavernDome.position.y = -0.25;
  wardstoneGroup.add(cavernDome);

  // The Black-Iron Runed Wardstone Cauldron
  const wardstoneCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.28, 0.52, 14),
    wardMat
  );
  wardstoneGroup.add(wardstoneCore);

  // 7 Dragon-Breed Ignition Pillars around the Wardstone + Ley-Line Conduits
  for (let p = 0; p < 7; p++) {
    const ang = (p / 7) * Math.PI * 2;
    const px = Math.cos(ang) * 0.78;
    const pz = Math.sin(ang) * 0.78;
    const isSeventhBreed = p === 6;

    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 0.65, 8),
      isSeventhBreed ? tunnelMat : wardMat
    );
    pillar.position.set(px, 0.05, pz);
    wardstoneGroup.add(pillar);

    // Ley-line rising from the Wardstone up into the protective Geodesic Ward Dome
    const leyPts = [
      new THREE.Vector3(0, -1.15, 0),
      new THREE.Vector3(px * 1.4, -0.4, pz * 1.4),
      new THREE.Vector3(px * 2.5, 0.85, pz * 2.2),
      new THREE.Vector3(0, 2.35, 0)
    ];
    root.add(createTubeFromPoints(leyPts, 0.025, wardMat, 24, 6));
  }

  // Translucent Geodesic Ward Dome Lattice over Basgiath
  const wardDomeGeo = new THREE.IcosahedronGeometry(3.35, 2);
  const wardDomeWire = new THREE.Mesh(
    wardDomeGeo,
    new THREE.MeshBasicMaterial({
      color: '#f4c55c',
      wireframe: true,
      transparent: true,
      opacity: 0.14
    })
  );
  wardDomeWire.position.y = 0.1;
  root.add(wardDomeWire);

  // --- D. VENIN DESICCATION VEINS CREEPING OUTSIDE THE EASTERN WARD ---
  for (let v = 0; v < 4; v++) {
    const veninPts = [
      new THREE.Vector3(3.6, -1.45, -1.4 + v * 0.7),
      new THREE.Vector3(2.9, -1.05 + v * 0.1, -0.9 + v * 0.45),
      new THREE.Vector3(2.15, -0.75, -0.4 + v * 0.25),
      new THREE.Vector3(1.45, -0.95, 0.0)
    ];
    root.add(createTubeFromPoints(veninPts, 0.042, veninMat, 20, 6));
  }

  root.userData.updateAnimation = (t) => {
    wardstoneCore.rotation.y = t * 0.6;
    wardDomeWire.rotation.y = t * 0.08;
    const throb = 1.0 + Math.sin(t * 3.0) * 0.08;
    wardstoneCore.scale.set(throb, 1.0, throb);
  };

  return root;
}
