// ============================================================================
// FOURTH WING: CODEX OCULUS — Custom GLSL Dual-Layer 3D X-Ray Shaders
// Implements real-time screen-space & world-space X-Ray lens clipping,
// procedural dragon scale micro-relief, radiograph Fresnel osteology,
// and animated signet plasma conduits.
// ============================================================================

import * as THREE from 'three';

export const sharedUniforms = {
  uTime: { value: 0.0 },
  uLensPos: { value: new THREE.Vector2(0.5, 0.5) }, // Screen UV [0..1]
  uLensRadius: { value: 0.22 },
  uAspect: { value: window.innerWidth / window.innerHeight },
  uXrayDepth: { value: 0.85 }, // 0.0 = Exterior only, 0.5 = Vascular/Signet, 1.0 = Full Deep Bone
  uFullXray: { value: 0.0 },   // 1.0 = Lock full-screen X-Ray
  uLightningFlash: { value: 0.0 },
  uThemeColor: { value: new THREE.Color('#38b6ff') },
  uSecondaryColor: { value: new THREE.Color('#f4c55c') },
  uLensActive: { value: 1.0 }
};

// Shared GLSL helper for screen-space Oculus Lens distance with organic noise edge
const LENS_GLSL_CHUNK = `
  uniform float uTime;
  uniform vec2 uLensPos;
  uniform float uLensRadius;
  uniform float uAspect;
  uniform float uXrayDepth;
  uniform float uFullXray;
  uniform float uLightningFlash;
  uniform vec3 uThemeColor;
  uniform vec3 uSecondaryColor;
  uniform float uLensActive;

  float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float noise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Returns > 0 outside lens, < 0 inside lens
  float getLensSignedDist(vec4 clipPos, vec3 worldPos) {
    if (uFullXray > 0.5) return -1.0;
    if (uLensActive < 0.5) return 1.0;
    vec2 ndc = clipPos.xy / clipPos.w;
    vec2 screenUV = ndc * 0.5 + 0.5;
    vec2 diff = screenUV - uLensPos;
    diff.x *= uAspect;
    float angle = atan(diff.y, diff.x);
    float ripple = (noise2D(vec2(angle * 4.0, uTime * 1.8)) - 0.5) * 0.014;
    return length(diff) - (uLensRadius + ripple);
  }
`;

export function createExteriorMaterial(options = {}) {
  const baseColor = new THREE.Color(options.baseColor || '#0d111a');
  const specularColor = new THREE.Color(options.specularColor || '#38b6ff');
  const scalePattern = options.scalePattern ?? 1.0; // 1 = dragon scales, 0 = armor/stone

  return new THREE.ShaderMaterial({
    uniforms: {
      ...sharedUniforms,
      uBaseColor: { value: baseColor },
      uSpecularColor: { value: specularColor },
      uScalePattern: { value: scalePattern }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vViewDir;
      varying vec4 vClipPos;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = viewMatrix * worldPosition;
        vViewDir = normalize(-mvPosition.xyz);
        vClipPos = projectionMatrix * mvPosition;
        gl_Position = vClipPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uBaseColor;
      uniform vec3 uSpecularColor;
      uniform float uScalePattern;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vViewDir;
      varying vec4 vClipPos;
      varying vec2 vUv;

      ${LENS_GLSL_CHUNK}

      void main() {
        float lensDist = getLensSignedDist(vClipPos, vWorldPos);

        // When X-Ray depth > 0.15, peel away exterior inside the Oculus lens
        if (uXrayDepth > 0.15 && lensDist < 0.0) {
          // Leave a subtle ghost silhouette if depth is low, or discard completely for deep X-ray
          if (uXrayDepth > 0.42 || lensDist < -0.018) {
            discard;
          }
        }

        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewDir);

        // Procedural overlapping dragon-scale or chiseled granite micro-relief
        float scaleTex = 0.0;
        if (uScalePattern > 0.5) {
          vec2 sUv = vWorldPos.xy * 6.5 + vec2(vWorldPos.z * 4.5);
          float s1 = noise2D(sUv);
          float s2 = noise2D(sUv * 2.3 + vec2(1.7, 3.1));
          scaleTex = mix(s1, s2, 0.5);
        } else {
          scaleTex = noise2D(vWorldPos.xz * 3.5 + vWorldPos.y * 2.0) * 0.6;
        }

        vec3 lightDir1 = normalize(vec3(0.6, 0.8, 0.5));
        vec3 lightDir2 = normalize(vec3(-0.7, -0.3, -0.6));
        float diff1 = max(dot(N, lightDir1), 0.0);
        float diff2 = max(dot(N, lightDir2), 0.0) * 0.35;

        // Fresnel rim light + Storm Lightning flash reflection
        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.6);
        vec3 halfVec = normalize(lightDir1 + V);
        float spec = pow(max(dot(N, halfVec), 0.0), 28.0) * (0.4 + scaleTex * 0.8);

        vec3 col = uBaseColor * (0.32 + diff1 * 0.85 + diff2 + scaleTex * 0.22);
        col += uSpecularColor * spec * 0.65;
        col += mix(uThemeColor, uSecondaryColor, 0.35) * fresnel * (0.55 + uLightningFlash * 1.4);

        // Blazing Arcane Rim at the boundary of the X-Ray Oculus Lens
        if (uXrayDepth > 0.15 && abs(lensDist) < 0.022) {
          float ringFactor = 1.0 - abs(lensDist) / 0.022;
          ringFactor = pow(ringFactor, 1.8);
          vec3 ringColor = mix(uSecondaryColor, uThemeColor, sin(vWorldPos.x * 6.0 + uTime * 5.0) * 0.5 + 0.5);
          col += ringColor * ringFactor * 3.2;
        }

        gl_FragColor = vec4(col, 1.0);
      }
    `,
    side: THREE.DoubleSide
  });
}

export function createBoneMaterial(options = {}) {
  const boneTint = new THREE.Color(options.boneTint || '#e8e2d2');
  return new THREE.ShaderMaterial({
    uniforms: {
      ...sharedUniforms,
      uBoneTint: { value: boneTint }
    },
    transparent: true,
    depthWrite: true,
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vViewDir;
      varying vec4 vClipPos;

      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = viewMatrix * worldPosition;
        vViewDir = normalize(-mvPosition.xyz);
        vClipPos = projectionMatrix * mvPosition;
        gl_Position = vClipPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uBoneTint;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vViewDir;
      varying vec4 vClipPos;

      ${LENS_GLSL_CHUNK}

      void main() {
        float lensDist = getLensSignedDist(vClipPos, vWorldPos);
        // Only visible inside lens or when full X-Ray is active
        if (lensDist > 0.015) {
          discard;
        }

        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewDir);

        // High-contrast radiograph X-Ray Fresnel + trabecular marrow density
        float ndotv = abs(dot(N, V));
        float xrayEdge = pow(1.0 - ndotv, 1.65);
        float marrow = noise2D(vWorldPos.xy * 9.0 + vWorldPos.z * 9.0);

        vec3 coreColor = uBoneTint * (0.28 + 0.45 * ndotv + marrow * 0.15);
        vec3 rimGlow = mix(uBoneTint, uThemeColor, 0.45) * xrayEdge * 1.85;

        // Subtle high-frequency scanline tomography effect
        float scanline = 0.92 + 0.08 * sin(vWorldPos.y * 45.0 - uTime * 4.0);
        vec3 finalCol = (coreColor + rimGlow) * scanline;

        float alpha = mix(0.35, 0.94, xrayEdge * 0.7 + 0.3) * clamp(uXrayDepth * 1.25, 0.25, 1.0);
        gl_FragColor = vec4(finalCol, alpha);
      }
    `,
    side: THREE.DoubleSide
  });
}

export function createConduitMaterial(options = {}) {
  const primary = new THREE.Color(options.color || '#38b6ff');
  const secondary = new THREE.Color(options.secondary || '#f4c55c');
  const pulseSpeed = options.pulseSpeed ?? 6.0;
  const alwaysFaintlyVisible = options.alwaysFaintlyVisible ? 1.0 : 0.0;

  return new THREE.ShaderMaterial({
    uniforms: {
      ...sharedUniforms,
      uConduitPrimary: { value: primary },
      uConduitSecondary: { value: secondary },
      uPulseSpeed: { value: pulseSpeed },
      uAlwaysVisible: { value: alwaysFaintlyVisible }
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vViewDir;
      varying vec4 vClipPos;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = viewMatrix * worldPosition;
        vViewDir = normalize(-mvPosition.xyz);
        vClipPos = projectionMatrix * mvPosition;
        gl_Position = vClipPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uConduitPrimary;
      uniform vec3 uConduitSecondary;
      uniform float uPulseSpeed;
      uniform float uAlwaysVisible;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vViewDir;
      varying vec4 vClipPos;
      varying vec2 vUv;

      ${LENS_GLSL_CHUNK}

      void main() {
        float lensDist = getLensSignedDist(vClipPos, vWorldPos);
        float outsideFactor = 1.0;
        if (lensDist > 0.01) {
          if (uAlwaysVisible < 0.5) {
            discard;
          }
          outsideFactor = 0.16 + uLightningFlash * 0.35;
        }

        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewDir);
        float rim = pow(1.0 - abs(dot(N, V)), 1.4);

        // Travelling arcane signet surge wave
        float wave = sin(vUv.x * 22.0 - uTime * uPulseSpeed + vWorldPos.x * 3.0) * 0.5 + 0.5;
        float surge = pow(wave, 3.0);

        vec3 col = mix(uConduitPrimary, uConduitSecondary, surge);
        col *= (1.1 + surge * 2.2 + rim * 1.4 + uLightningFlash * 1.2);

        float alpha = (0.55 + surge * 0.45) * outsideFactor;
        gl_FragColor = vec4(col, alpha);
      }
    `,
    side: THREE.DoubleSide
  });
}
