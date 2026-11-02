// ============================================================================
// FOURTH WING: CODEX OCULUS — Sculpted 3D Models (v2 High-Detail Edition)
// Smooth lofted organic geometry, curved Bezier wing membranes, crisp internal
// osteology, beating heart, and dynamic lightning/shadow energy arcs.
// ============================================================================

import * as THREE from 'three';
import {
  createExteriorMaterial,
  createBoneMaterial,
  createConduitMaterial
} from './xrayShader.js';

function createTube(points, radius, material, tubSegs = 40, radSegs = 10) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, tubSegs, radius, radSegs, false);
  return new THREE.Mesh(geo, material);
}

// Builds a smooth continuous lofted organic body along a 3D spine curve
// with custom anatomical radius profile (neck -> chest -> waist -> tail)
function createLoftedBodyGeometry(curve, radiusProfileFn, lengthSegs = 72, radialSegs = 24) {
  const frames = curve.computeFrenetFrames(lengthSegs, false);
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= lengthSegs; i++) {
    const u = i / lengthSegs;
    const pt = curve.getPointAt(u);
    const N = frames.normals[i];
    const B = frames.binormals[i];
    const { rx, ry } = radiusProfileFn(u);

    for (let j = 0; j <= radialSegs; j++) {
      const v = j / radialSegs;
      const theta = v * Math.PI * 2;
      const sin = Math.sin(theta);
      const cos = Math.cos(theta);

      // Slight dorsal ridge shaping at top (sin > 0.7)
      const ridge = sin > 0.6 ? Math.pow((sin - 0.6) / 0.4, 2.0) * 0.08 * ry : 0;

      const vx = pt.x + (cos * rx * B.x + (sin * ry + ridge) * N.x);
      const vy = pt.y + (cos * rx * B.y + (sin * ry + ridge) * N.y);
      const vz = pt.z + (cos * rx * B.z + (sin * ry + ridge) * N.z);

      positions.push(vx, vy, vz);

      const nx = cos * B.x + sin * N.x;
      const ny = cos * B.y + sin * N.y;
      const nz = cos * B.z + sin * N.z;
      const len = Math.hypot(nx, ny, nz) || 1;
      normals.push(nx / len, ny / len, nz / len);
      uvs.push(u, v);
    }
  }

  const stride = radialSegs + 1;
  for (let i = 0; i < lengthSegs; i++) {
    for (let j = 0; j < radialSegs; j++) {
      const a = i * stride + j;
      const b = (i + 1) * stride + j;
      const c = (i + 1) * stride + (j + 1);
      const d = i * stride + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setIndex(indices);
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return geo;
}

// ============================================================================
// 1. SCULPTED DRAGON ANATOMY (Tairn, Andarna, Wyvern)
// ============================================================================
export function buildDragonModel(specimenId = 'tairn', customColors = null) {
  const root = new THREE.Group();
  root.name = `dragon-${specimenId}`;

  const isAndarna = specimenId === 'andarna';
  const isWyvern = specimenId === 'wyvern';

  const scaleFactor = isAndarna ? 0.85 : isWyvern ? 0.95 : 1.05;
  root.scale.setScalar(scaleFactor);

  const primaryHex = customColors?.colorHex || (isAndarna ? '#f4c55c' : isWyvern ? '#ff2a4b' : '#38b6ff');
  const secondaryHex = customColors?.secondaryHex || (isAndarna ? '#ff9e44' : isWyvern ? '#9e0b22' : '#f4c55c');
  const hideHex = customColors?.hideHex || (isAndarna ? '#2c200b' : isWyvern ? '#17111a' : '#090d16');

  const extMat = createExteriorMaterial({
    baseColor: hideHex,
    specularColor: primaryHex,
    scalePattern: 1.0
  });
  const wingMembraneMat = createExteriorMaterial({
    baseColor: isAndarna ? '#211706' : '#0b101c',
    specularColor: secondaryHex,
    scalePattern: 1.0
  });
  const boneMat = createBoneMaterial({
    boneTint: isWyvern ? '#dfd0d3' : '#f2ede0'
  });
  const conduitMat = createConduitMaterial({
    color: primaryHex,
    secondary: secondaryHex,
    pulseSpeed: 6.5,
    alwaysFaintlyVisible: true
  });
  const pyroMat = createConduitMaterial({
    color: isWyvern ? '#00e5ff' : '#ff6b1a',
    secondary: isWyvern ? '#ff2a4b' : '#ffd966',
    pulseSpeed: 8.5,
    alwaysFaintlyVisible: false
  });

  // Sinuous S-curve spine from tail tip [-4.0] to neck/head [2.9]
  const spinePts = [
    new THREE.Vector3(-4.1, 0.15, 0),
    new THREE.Vector3(-2.9, 0.05, 0),
    new THREE.Vector3(-1.7, 0.28, 0),
    new THREE.Vector3(-0.5, 0.52, 0),
    new THREE.Vector3(0.55, 0.58, 0),
    new THREE.Vector3(1.5, 0.78, 0),
    new THREE.Vector3(2.25, 1.32, 0),
    new THREE.Vector3(2.85, 1.38, 0)
  ];
  const spineCurve = new THREE.CatmullRomCurve3(spinePts);

  // Smooth continuous lofted dragon body
  const bodyGeo = createLoftedBodyGeometry(spineCurve, (u) => {
    // u=0 is tail tip, u=0.55 is broad chest, u=0.85 is slender neck, u=1.0 is skull base
    if (u < 0.35) {
      const t = u / 0.35;
      const r = THREE.MathUtils.lerp(0.05, 0.42, Math.pow(t, 1.3));
      return { rx: r * 0.9, ry: r };
    } else if (u < 0.68) {
      const t = (u - 0.35) / 0.33;
      const chest = Math.sin(t * Math.PI);
      return {
        rx: 0.42 + chest * 0.36,
        ry: 0.44 + chest * 0.38
      };
    } else {
      const t = (u - 0.68) / 0.32;
      const r = THREE.MathUtils.lerp(0.42, 0.22, t);
      return { rx: r * 0.88, ry: r };
    }
  });
  root.add(new THREE.Mesh(bodyGeo, extMat));

  // Dorsal spine armor crests along the back
  for (let i = 4; i < 42; i++) {
    const u = i / 44;
    const pt = spineCurve.getPointAt(u);
    const crestH = 0.12 + Math.sin(u * Math.PI) * 0.24;
    const crestGeo = new THREE.ConeGeometry(0.045, crestH, 4);
    const crest = new THREE.Mesh(crestGeo, extMat);
    const offsetY = u > 0.35 && u < 0.68 ? 0.68 : 0.32;
    crest.position.copy(pt).add(new THREE.Vector3(0, offsetY * Math.sin(u * Math.PI) + 0.18, 0));
    crest.rotation.z = -0.45;
    root.add(crest);
  }

  // --- SCULPTED HEAD, JAW & SWEPT HORNS ---
  const headGroup = new THREE.Group();
  headGroup.position.set(2.92, 1.35, 0);
  root.add(headGroup);

  // Upper skull & snout
  const upperSkullGeo = new THREE.ConeGeometry(0.34, 0.98, 12);
  upperSkullGeo.rotateZ(-Math.PI / 2);
  upperSkullGeo.scale(1.0, 0.65, 0.82);
  const upperSkull = new THREE.Mesh(upperSkullGeo, extMat);
  upperSkull.position.set(0.32, 0.04, 0);
  headGroup.add(upperSkull);

  // Lower hinged jaw
  const lowerJawGeo = new THREE.ConeGeometry(0.26, 0.84, 10);
  lowerJawGeo.rotateZ(-Math.PI / 2);
  lowerJawGeo.scale(1.0, 0.42, 0.72);
  const lowerJaw = new THREE.Mesh(lowerJawGeo, extMat);
  lowerJaw.position.set(0.26, -0.14, 0);
  lowerJaw.rotation.z = -0.15;
  headGroup.add(lowerJaw);

  // Glowing Slit Eyes + Swept Occipital Horns + Brow Horns
  const eyeMat = new THREE.MeshBasicMaterial({
    color: isWyvern ? '#ff1e42' : '#ffd54f'
  });
  [-1, 1].forEach((side) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.046, 12, 12), eyeMat);
    eye.scale.set(1.4, 0.8, 1.0);
    eye.position.set(0.22, 0.08, side * 0.21);
    headGroup.add(eye);

    const mainHornPts = [
      new THREE.Vector3(-0.02, 0.14, side * 0.15),
      new THREE.Vector3(-0.48, 0.42, side * 0.36),
      new THREE.Vector3(-1.05, 0.64, side * 0.48)
    ];
    headGroup.add(createTube(mainHornPts, 0.055, extMat, 20, 8));
    headGroup.add(createTube(mainHornPts, 0.036, boneMat, 20, 6));

    const browHornPts = [
      new THREE.Vector3(0.08, 0.12, side * 0.19),
      new THREE.Vector3(-0.28, 0.24, side * 0.32)
    ];
    headGroup.add(createTube(browHornPts, 0.03, extMat, 12, 6));
  });

  // Internal X-Ray Cranium, Jawbone & Telepathic Bond Core
  const innerSkull = new THREE.Mesh(upperSkullGeo.clone().scale(0.84, 0.84, 0.84), boneMat);
  innerSkull.position.set(0.28, 0.04, 0);
  headGroup.add(innerSkull);

  const innerJaw = new THREE.Mesh(lowerJawGeo.clone().scale(0.82, 0.82, 0.82), boneMat);
  innerJaw.position.set(0.24, -0.13, 0);
  innerJaw.rotation.z = -0.15;
  headGroup.add(innerJaw);

  const cranialBondNexus = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 2), conduitMat);
  cranialBondNexus.position.set(-0.04, 0.06, 0);
  headGroup.add(cranialBondNexus);

  // --- DEEP X-RAY SKELETON: VERTEBRAE, RIBCAGE & STERNUM ---
  for (let i = 0; i < 38; i++) {
    const u = i / 37;
    const pos = spineCurve.getPointAt(u);
    const tangent = spineCurve.getTangentAt(u);
    const vRad = 0.055 + Math.sin(u * Math.PI) * 0.075;

    const vertGeo = new THREE.CylinderGeometry(vRad, vRad * 0.85, 0.12, 10);
    vertGeo.rotateZ(Math.PI / 2);
    const vert = new THREE.Mesh(vertGeo, boneMat);
    vert.position.copy(pos);
    vert.lookAt(pos.clone().add(tangent));
    root.add(vert);

    const neuralSpine = new THREE.Mesh(new THREE.BoxGeometry(0.035, vRad * 2.1, 0.025), boneMat);
    neuralSpine.position.copy(pos).add(new THREE.Vector3(0, vRad * 1.25, 0));
    neuralSpine.rotation.z = -0.35;
    root.add(neuralSpine);
  }

  // 12 Pairs of Anatomical Thoracic Ribs
  for (let r = 0; r < 12; r++) {
    const u = 0.35 + (r / 11) * 0.32;
    const sp = spineCurve.getPointAt(u);
    const arch = Math.sin((r / 11) * Math.PI);
    const w = 0.34 + arch * 0.35;
    const h = 0.42 + arch * 0.38;

    [-1, 1].forEach((side) => {
      const ribPts = [
        sp.clone(),
        sp.clone().add(new THREE.Vector3(0.04, -h * 0.32, side * w)),
        sp.clone().add(new THREE.Vector3(-0.05, -h * 0.85, side * w * 0.65)),
        sp.clone().add(new THREE.Vector3(-0.08, -h, side * 0.05))
      ];
      root.add(createTube(ribPts, 0.026, boneMat, 16, 8));
    });
  }

  // Sternum Keel
  root.add(
    createTube(
      [
        new THREE.Vector3(-0.55, -0.18, 0),
        new THREE.Vector3(0.25, -0.26, 0),
        new THREE.Vector3(1.1, -0.04, 0)
      ],
      0.05,
      boneMat,
      16,
      8
    )
  );

  // --- HEART / WYVERN RUNE STONE & PYRO-GLANDS ---
  const heartGroup = new THREE.Group();
  heartGroup.position.set(0.25, 0.3, 0);
  root.add(heartGroup);

  if (isWyvern) {
    // Wyvern Dark-Magic Carved Rune Stone
    const stone = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.31, 0),
      createExteriorMaterial({ baseColor: '#241520', specularColor: '#ff2a4b', scalePattern: 0 })
    );
    heartGroup.add(stone);
    for (let k = 0; k < 3; k++) {
      const rRing = new THREE.Mesh(new THREE.TorusGeometry(0.35 + k * 0.025, 0.016, 8, 36), conduitMat);
      rRing.rotation.set(k * 1.1, k * 0.7, k * 0.4);
      heartGroup.add(rRing);
    }
  } else {
    const heart = new THREE.Mesh(new THREE.SphereGeometry(0.27, 20, 20), conduitMat);
    heart.scale.set(1.25, 0.95, 0.9);
    heartGroup.add(heart);

    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.02, 10, 44), pyroMat);
    halo.rotation.x = Math.PI / 3;
    heartGroup.add(halo);
  }

  // Pyro-Chemical Fire Sacs & Tracheal Ducts
  [-1, 1].forEach((side) => {
    const sac = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 16), pyroMat);
    sac.scale.set(1.8, 0.72, 0.7);
    sac.position.set(1.15, 0.42, side * 0.22);
    sac.rotation.z = 0.28;
    root.add(sac);

    root.add(
      createTube(
        [
          new THREE.Vector3(1.25, 0.44, side * 0.2),
          new THREE.Vector3(1.85, 0.82, side * 0.13),
          new THREE.Vector3(2.42, 1.28, side * 0.08),
          new THREE.Vector3(3.12, 1.26, side * 0.04)
        ],
        0.022,
        pyroMat,
        20,
        6
      )
    );
  });

  // Main Spinal Signet Conduit
  root.add(createTube(spinePts, 0.036, conduitMat, 48, 8));

  // --- MUSCULAR LEGS & TALONS ---
  const buildLeg = (hipPos, isFront, side) => {
    const knee = hipPos.clone().add(new THREE.Vector3(isFront ? -0.22 : 0.3, -0.56, side * 0.22));
    const ankle = knee.clone().add(new THREE.Vector3(isFront ? 0.34 : -0.34, -0.5, side * 0.05));
    const foot = ankle.clone().add(new THREE.Vector3(0.26, -0.2, 0));
    const pts = [hipPos, knee, ankle, foot];

    root.add(createTube(pts, 0.145, extMat, 20, 12));
    root.add(createTube(pts, 0.055, boneMat, 20, 8));
    root.add(createTube(pts, 0.02, conduitMat, 20, 6));

    [-0.09, 0, 0.09].forEach((zOff) => {
      root.add(
        createTube(
          [foot.clone(), foot.clone().add(new THREE.Vector3(0.24, -0.06, zOff))],
          0.026,
          boneMat,
          8,
          6
        )
      );
    });
  };

  [-1, 1].forEach((side) => {
    buildLeg(new THREE.Vector3(-0.75, 0.32, side * 0.42), false, side);
    if (!isWyvern) {
      buildLeg(new THREE.Vector3(0.92, 0.36, side * 0.45), true, side);
    }
  });

  // --- SCULPTED 5-RAY WINGS WITH SUBDIVIDED MEMBRANES ---
  const leftWingGroup = new THREE.Group();
  const rightWingGroup = new THREE.Group();

  const buildWing = (side) => {
    const wg = side > 0 ? leftWingGroup : rightWingGroup;
    wg.position.set(0.62, 0.72, side * 0.34);
    root.add(wg);

    const shoulder = new THREE.Vector3(0, 0, 0);
    const elbow = new THREE.Vector3(-0.42, 0.46, side * 0.96);
    const wrist = new THREE.Vector3(0.38, 0.92, side * 2.15);
    const tip = new THREE.Vector3(-0.68, 1.18, side * 4.55);

    const leadPts = [shoulder, elbow, wrist, tip];
    wg.add(createTube(leadPts, 0.082, extMat, 28, 10));
    wg.add(createTube(leadPts, 0.044, boneMat, 28, 8));
    wg.add(createTube(leadPts, 0.022, conduitMat, 28, 6));

    const fingers = [
      tip,
      new THREE.Vector3(-1.18, 0.66, side * 3.9),
      new THREE.Vector3(-1.58, 0.24, side * 2.95),
      new THREE.Vector3(-1.68, -0.04, side * 1.95),
      new THREE.Vector3(-1.35, -0.18, side * 1.05)
    ];

    for (let f = 1; f < fingers.length; f++) {
      const fPts = [
        wrist,
        wrist.clone().lerp(fingers[f], 0.5).add(new THREE.Vector3(-0.14, 0.1, 0)),
        fingers[f]
      ];
      wg.add(createTube(fPts, 0.036, extMat, 18, 8));
      wg.add(createTube(fPts, 0.022, boneMat, 18, 6));
      wg.add(createTube(fPts, 0.014, conduitMat, 18, 5));
    }

    // Subdivided curved wing membranes between each finger ray
    for (let m = 0; m < fingers.length - 1; m++) {
      const fA = fingers[m];
      const fB = fingers[m + 1];
      const positions = [];
      const indices = [];
      const steps = 10;

      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const pA = wrist.clone().lerp(fA, u);
        const pB = wrist.clone().lerp(fB, u);
        for (let j = 0; j <= steps; j++) {
          const v = j / steps;
          const pt = pA.clone().lerp(pB, v);
          // Camber arch for realistic aerodynamic wing membrane
          const camber = Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * 0.14;
          pt.y += camber;
          positions.push(pt.x, pt.y, pt.z);
        }
      }

      const stride = steps + 1;
      for (let i = 0; i < steps; i++) {
        for (let j = 0; j < steps; j++) {
          const a = i * stride + j;
          const b = (i + 1) * stride + j;
          const c = (i + 1) * stride + (j + 1);
          const d = i * stride + (j + 1);
          indices.push(a, b, d, b, c, d);
        }
      }

      const webGeo = new THREE.BufferGeometry();
      webGeo.setIndex(indices);
      webGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      webGeo.computeVertexNormals();
      wg.add(new THREE.Mesh(webGeo, wingMembraneMat));
    }
  };

  buildWing(1);
  buildWing(-1);

  // --- TAIL WEAPONRY ---
  const tailGroup = new THREE.Group();
  tailGroup.position.set(-4.05, 0.15, 0);
  root.add(tailGroup);

  if (isAndarna) {
    for (let p = -3; p <= 3; p++) {
      const ang = p * 0.22;
      const vaneGeo = new THREE.ConeGeometry(0.08, 0.88, 8);
      vaneGeo.rotateZ(Math.PI / 2);
      vaneGeo.scale(1.0, 0.22, 1.8);
      const vane = new THREE.Mesh(vaneGeo, extMat);
      vane.position.set(-0.32, Math.sin(ang) * 0.08, Math.sin(ang) * 0.38);
      vane.rotation.y = ang;
      tailGroup.add(vane);

      const oss = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.008, 0.72, 6), boneMat);
      oss.rotation.z = Math.PI / 2;
      oss.rotation.y = ang;
      oss.position.copy(vane.position);
      tailGroup.add(oss);
    }
  } else if (isWyvern) {
    const barbPts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.45, 0.28, 0),
      new THREE.Vector3(-0.25, 0.58, 0),
      new THREE.Vector3(0.05, 0.42, 0)
    ];
    tailGroup.add(createTube(barbPts, 0.085, extMat, 16, 8));
    tailGroup.add(createTube(barbPts, 0.042, boneMat, 16, 6));
  } else {
    // Tairn's Morningstartail Mace
    const club = new THREE.Mesh(new THREE.SphereGeometry(0.32, 18, 18), extMat);
    club.scale.set(1.45, 0.95, 0.95);
    tailGroup.add(club);

    const clubBone = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 14), boneMat);
    clubBone.scale.set(1.4, 0.9, 0.9);
    tailGroup.add(clubBone);

    for (let s = 0; s < 18; s++) {
      const phi = Math.acos(1 - (2 * (s + 0.5)) / 18);
      const theta = Math.PI * (1 + Math.sqrt(5)) * s;
      const dir = new THREE.Vector3(
        Math.cos(theta) * Math.sin(phi),
        Math.sin(theta) * Math.sin(phi),
        Math.cos(phi)
      ).normalize();

      const spOut = new THREE.Mesh(new THREE.ConeGeometry(0.052, 0.42, 6), extMat);
      spOut.position.copy(dir.clone().multiplyScalar(0.35));
      spOut.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      tailGroup.add(spOut);

      const spIn = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.35, 6), boneMat);
      spIn.position.copy(dir.clone().multiplyScalar(0.31));
      spIn.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      tailGroup.add(spIn);
    }
  }

  root.userData.updateAnimation = (t) => {
    const flap = Math.sin(t * 1.7) * 0.24;
    leftWingGroup.rotation.x = flap;
    rightWingGroup.rotation.x = -flap;
    const beat = 1.0 + Math.pow(Math.sin(t * 3.2), 6.0) * 0.16;
    heartGroup.scale.setScalar(beat);
    tailGroup.rotation.y = Math.sin(t * 1.2) * 0.14;
    headGroup.rotation.y = Math.sin(t * 0.8) * 0.06;
  };

  return root;
}

// ============================================================================
// 2. SCULPTED RIDER'S CONDUIT (Violet Sorrengail & Xaden Riorson)
// ============================================================================
export function buildRiderModel(specimenId = 'violet') {
  const root = new THREE.Group();
  root.name = `rider-${specimenId}`;
  root.scale.setScalar(1.38);
  root.position.y = -0.3;

  const isViolet = specimenId === 'violet';
  const primaryHex = isViolet ? '#7ce8ff' : '#9d65ff';
  const secondaryHex = isViolet ? '#f4c55c' : '#38b6ff';

  const armorMat = createExteriorMaterial({
    baseColor: isViolet ? '#0f1622' : '#090c14',
    specularColor: primaryHex,
    scalePattern: isViolet ? 1.0 : 0.2
  });
  const boneMat = createBoneMaterial({ boneTint: '#f2ece1' });
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

  // Smooth Lofted Torso & Waist
  const torsoSpine = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.22, 0),
    new THREE.Vector3(0, 0.22, 0.02),
    new THREE.Vector3(0, 0.68, 0),
    new THREE.Vector3(0, 1.08, -0.01)
  ]);
  const torsoGeo = createLoftedBodyGeometry(torsoSpine, (u) => {
    // Hips -> narrow waist -> chest/shoulders
    const waistDip = Math.sin(u * Math.PI);
    const rx = THREE.MathUtils.lerp(0.26, 0.34, u) - waistDip * 0.05;
    const ry = THREE.MathUtils.lerp(0.18, 0.22, u) - waistDip * 0.02;
    return { rx, ry };
  }, 36, 24);
  root.add(new THREE.Mesh(torsoGeo, armorMat));

  // Neck & Sculpted Head
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.26, 16), armorMat);
  neck.position.set(0, 1.18, 0);
  root.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 24, 24), armorMat);
  head.scale.set(0.88, 1.12, 0.95);
  head.position.set(0, 1.48, 0.02);
  root.add(head);

  if (isViolet) {
    // Silver-Tipped Crown & Braid
    const braidPts = [
      new THREE.Vector3(0, 1.66, -0.1),
      new THREE.Vector3(0.08, 1.46, -0.23),
      new THREE.Vector3(0.24, 1.15, -0.14),
      new THREE.Vector3(0.31, 0.82, 0.14),
      new THREE.Vector3(0.27, 0.48, 0.23)
    ];
    root.add(
      createTube(
        braidPts,
        0.04,
        createConduitMaterial({ color: '#e2edf8', secondary: '#7ce8ff', pulseSpeed: 3.0, alwaysFaintlyVisible: true }),
        24,
        8
      )
    );
  }

  // Deep Articulated Skeleton Inside
  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 18), boneMat);
  cranium.scale.set(0.86, 1.05, 0.94);
  cranium.position.set(0, 1.5, 0.02);
  root.add(cranium);

  for (let v = 0; v < 22; v++) {
    const y = -0.14 + (v / 21) * 1.42;
    const vert = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.044, 10), boneMat);
    vert.position.set(0, y, -0.07);
    root.add(vert);
  }

  const sternum = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.46, 0.028), boneMat);
  sternum.position.set(0, 0.68, 0.16);
  root.add(sternum);

  for (let r = 0; r < 10; r++) {
    const y = 0.35 + (r / 9) * 0.55;
    const w = 0.21 + Math.sin((r / 9) * Math.PI) * 0.095;
    [-1, 1].forEach((side) => {
      root.add(
        createTube(
          [
            new THREE.Vector3(0, y, -0.07),
            new THREE.Vector3(side * w, y - 0.02, 0.02),
            new THREE.Vector3(side * w * 0.65, y - 0.05, 0.15),
            new THREE.Vector3(side * 0.04, y - 0.04, 0.16)
          ],
          0.015,
          boneMat,
          14,
          6
        )
      );
    });
  }

  const pelvisBone = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.042, 10, 24), boneMat);
  pelvisBone.rotation.x = Math.PI / 2.2;
  pelvisBone.scale.set(1.2, 0.75, 1.0);
  pelvisBone.position.set(0, -0.12, 0);
  root.add(pelvisBone);

  const handOrbs = [];
  [-1, 1].forEach((side) => {
    const shoulder = new THREE.Vector3(side * 0.38, 0.94, 0);
    const elbow = new THREE.Vector3(side * 0.55, 0.54, 0.08);
    const wrist = new THREE.Vector3(side * 0.58, 0.32, 0.28);
    const armPts = [shoulder, elbow, wrist];

    root.add(createTube(armPts, 0.082, armorMat, 18, 12));
    root.add(createTube(armPts, 0.032, boneMat, 18, 8));
    root.add(createTube(armPts, 0.02, conduitMat, 20, 6));

    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.11, 2), conduitMat);
    orb.position.copy(wrist).add(new THREE.Vector3(side * 0.04, 0.02, 0.08));
    root.add(orb);
    handOrbs.push(orb);

    const hip = new THREE.Vector3(side * 0.19, -0.18, 0);
    const knee = new THREE.Vector3(side * 0.22, -0.78, 0.04);
    const ankle = new THREE.Vector3(side * 0.24, -1.35, 0);
    const legPts = [hip, knee, ankle];

    root.add(createTube(legPts, 0.112, armorMat, 18, 12));
    root.add(createTube(legPts, 0.042, boneMat, 18, 8));
    root.add(createTube(legPts, 0.016, conduitMat, 18, 6));

    if (isViolet) {
      [shoulder, knee].forEach((jp) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.011, 8, 28), relicMat);
        ring.position.copy(jp);
        ring.rotation.y = side * 0.5;
        root.add(ring);
      });
    }
  });

  const riderHeart = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), conduitMat);
  riderHeart.position.set(0.05, 0.68, 0.04);
  root.add(riderHeart);

  const cranialNode = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 2), relicMat);
  cranialNode.position.set(0, 1.54, 0.04);
  root.add(cranialNode);

  root.add(
    createTube(
      [
        new THREE.Vector3(0, 1.54, 0.04),
        new THREE.Vector3(0, 1.15, -0.02),
        new THREE.Vector3(0.05, 0.68, 0.04),
        new THREE.Vector3(0, 0.15, 0)
      ],
      0.025,
      conduitMat,
      20,
      8
    )
  );

  // Orbiting Lightning / Shadow Tendrils around the Rider
  const auraGroup = new THREE.Group();
  root.add(auraGroup);
  for (let s = 0; s < 3; s++) {
    const pts = [];
    for (let k = 0; k <= 18; k++) {
      const f = k / 18;
      const a = f * Math.PI * 3.0 + s * 2.1;
      pts.push(
        new THREE.Vector3(
          Math.cos(a) * (0.48 + f * 0.22),
          -0.65 + f * 2.15,
          Math.sin(a) * (0.48 + f * 0.22)
        )
      );
    }
    auraGroup.add(createTube(pts, 0.018, isViolet ? relicMat : conduitMat, 36, 6));
  }

  root.userData.updateAnimation = (t) => {
    const pulse = 1.0 + Math.pow(Math.sin(t * 3.8), 4.0) * 0.18;
    riderHeart.scale.setScalar(pulse);
    auraGroup.rotation.y = t * 0.65;
    handOrbs.forEach((orb, idx) => {
      orb.rotation.y = t * 2.5 * (idx === 0 ? 1 : -1);
      orb.scale.setScalar(0.9 + Math.sin(t * 6.0 + idx) * 0.2);
    });
  };

  return root;
}

// ============================================================================
// 3. BASGIATH WAR COLLEGE & SUBTERRANEAN WARDSTONE
// ============================================================================
export function buildBasgiathModel() {
  const root = new THREE.Group();
  root.name = 'basgiath-citadel';

  const mountainMat = createExteriorMaterial({
    baseColor: '#0c111b',
    specularColor: '#38b6ff',
    scalePattern: 0.0
  });
  const citadelMat = createExteriorMaterial({
    baseColor: '#161f30',
    specularColor: '#f4c55c',
    scalePattern: 0.0
  });
  const bedrockBoneMat = createBoneMaterial({ boneTint: '#c8d4e3' });
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

  const westPeak = new THREE.Mesh(new THREE.ConeGeometry(2.3, 3.4, 9), mountainMat);
  westPeak.position.set(-1.95, -0.35, 0);
  root.add(westPeak);

  const eastPeak = new THREE.Mesh(new THREE.ConeGeometry(2.4, 3.6, 10), mountainMat);
  eastPeak.position.set(1.85, -0.25, 0);
  root.add(eastPeak);

  const centralBase = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.6, 3.6), mountainMat);
  centralBase.position.set(0, -1.35, 0);
  root.add(centralBase);

  // The Parapet Bridge
  const parapetBridge = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.12, 0.18), citadelMat);
  parapetBridge.position.set(0, 0.55, 1.55);
  root.add(parapetBridge);

  const parapetCore = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.08, 0.14), wardMat);
  parapetCore.position.set(0, 0.55, 1.55);
  root.add(parapetCore);

  [-1.35, 1.35].forEach((xPos) => {
    const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 1.35, 10), citadelMat);
    turret.position.set(xPos, 0.65, 1.55);
    root.add(turret);
  });

  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2;
    const tower = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 1.1 + (i % 2) * 0.4, 10),
      citadelMat
    );
    tower.position.set(1.55 + Math.cos(ang) * 0.55, 0.85, Math.sin(ang) * 0.55);
    root.add(tower);
  }

  const archives = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.15, 4), citadelMat);
  archives.position.set(-1.85, 0.68, -0.55);
  archives.rotation.y = Math.PI / 4;
  root.add(archives);

  for (let lvl = 0; lvl < 4; lvl++) {
    const subVault = new THREE.Mesh(
      new THREE.BoxGeometry(0.95 - lvl * 0.1, 0.14, 0.95 - lvl * 0.1),
      bedrockBoneMat
    );
    subVault.position.set(-1.85, 0.15 - lvl * 0.26, -0.55);
    root.add(subVault);
  }

  root.add(
    createTube(
      [
        new THREE.Vector3(-1.85, -0.55, -0.55),
        new THREE.Vector3(-0.4, -0.65, 0.35),
        new THREE.Vector3(0.95, -0.45, 0.75),
        new THREE.Vector3(2.35, -0.15, 1.15)
      ],
      0.055,
      tunnelMat,
      32,
      8
    )
  );

  const wardstoneGroup = new THREE.Group();
  wardstoneGroup.position.set(0, -1.15, 0);
  root.add(wardstoneGroup);

  const cavernDome = new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.65),
    bedrockBoneMat
  );
  cavernDome.position.y = -0.25;
  wardstoneGroup.add(cavernDome);

  const wardstoneCore = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.28, 0.52, 16), wardMat);
  wardstoneGroup.add(wardstoneCore);

  for (let p = 0; p < 7; p++) {
    const ang = (p / 7) * Math.PI * 2;
    const px = Math.cos(ang) * 0.78;
    const pz = Math.sin(ang) * 0.78;
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 0.65, 8),
      p === 6 ? tunnelMat : wardMat
    );
    pillar.position.set(px, 0.05, pz);
    wardstoneGroup.add(pillar);

    root.add(
      createTube(
        [
          new THREE.Vector3(0, -1.15, 0),
          new THREE.Vector3(px * 1.4, -0.4, pz * 1.4),
          new THREE.Vector3(px * 2.5, 0.85, pz * 2.2),
          new THREE.Vector3(0, 2.35, 0)
        ],
        0.025,
        wardMat,
        24,
        6
      )
    );
  }

  const wardDomeWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.35, 2),
    new THREE.MeshBasicMaterial({
      color: '#f4c55c',
      wireframe: true,
      transparent: true,
      opacity: 0.11
    })
  );
  wardDomeWire.position.y = 0.1;
  root.add(wardDomeWire);

  for (let v = 0; v < 4; v++) {
    root.add(
      createTube(
        [
          new THREE.Vector3(3.6, -1.45, -1.4 + v * 0.7),
          new THREE.Vector3(2.9, -1.05 + v * 0.1, -0.9 + v * 0.45),
          new THREE.Vector3(2.15, -0.75, -0.4 + v * 0.25),
          new THREE.Vector3(1.45, -0.95, 0)
        ],
        0.042,
        veninMat,
        20,
        6
      )
    );
  }

  root.userData.updateAnimation = (t) => {
    wardstoneCore.rotation.y = t * 0.6;
    wardDomeWire.rotation.y = t * 0.08;
    const throb = 1.0 + Math.sin(t * 3.0) * 0.08;
    wardstoneCore.scale.set(throb, 1.0, throb);
  };

  return root;
}
