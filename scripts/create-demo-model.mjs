import * as THREE from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { writeFileSync, mkdirSync, cpSync } from "node:fs";
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((data) => {
      this.result = data;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((data) => {
      this.result =
        "data:application/octet-stream;base64," +
        Buffer.from(data).toString("base64");
      this.onloadend?.();
    });
  }
};
const root = new THREE.Group();
root.name = "CodeCraft_World";
const colors = {
  grass: "#75b943",
  grass2: "#8ecb54",
  dirt: "#967047",
  rock: "#83959c",
  water: "#45c2de",
  trunk: "#88603c",
  leaves: "#479846",
  leaves2: "#68b141",
  stone: "#d3cfb8",
  wood: "#c39459",
  roof: "#547bc9",
  crystal: "#8953e8",
  sand: "#dfd3a6",
};
const mats = Object.fromEntries(
  Object.entries(colors).map(([name, color]) => [
    name,
    new THREE.MeshStandardMaterial({
      name: name === "crystal" ? "Crystal" : name,
      color,
      roughness: name === "water" ? 0.3 : 0.95,
      metalness: 0,
      emissive: name === "crystal" ? color : "#000000",
      emissiveIntensity: name === "crystal" ? 0.3 : 0,
    }),
  ]),
);
function group(name, layer) {
  const g = new THREE.Group();
  g.name = name;
  g.userData.layer = layer;
  root.add(g);
  return g;
}
const ground = group("Terrain", 0),
  nature = group("Forest", 1),
  logic = group("Codestone", 2);
function box(parent, name, x, y, z, w, h, d, material) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats[material]);
  m.name = name;
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}
// Each tile is a chunk of a small floating landscape, not an external game asset.
for (let x = -3; x <= 3; x++)
  for (let z = -3; z <= 3; z++) {
    if (Math.abs(x) === 3 && Math.abs(z) === 3) continue;
    const xx = x * 0.68,
      zz = z * 0.68;
    const river = x === -1;
    const depth = 0.8 + ((x * x + z * z) % 3) * 0.26;
    box(
      ground,
      `earth_${x}_${z}`,
      xx,
      -depth / 2 - 0.1,
      zz,
      0.69,
      depth,
      0.69,
      "dirt",
    );
    box(
      ground,
      `surface_${x}_${z}`,
      xx,
      river ? -0.05 : 0.08,
      zz,
      0.69,
      river ? 0.13 : 0.18,
      river ? "water" : (x + z) % 2 === 0 ? "grass" : "grass2",
    );
    if ((x + z) % 3 === 0)
      box(
        ground,
        `stone_${x}_${z}`,
        xx,
        -depth - 0.15,
        zz,
        0.53,
        0.4,
        0.54,
        "rock",
      );
  }
box(ground, "Waterfall", -0.68, -0.95, 2.2, 0.69, 1.9, 0.18, "water");
function tree(x, z, size = 1) {
  box(nature, "Tree_trunk", x, 0.62, z, 0.2, 1.1, 0.2, "trunk");
  box(
    nature,
    "Tree_crown",
    x,
    1.32,
    z,
    0.92 * size,
    0.64 * size,
    0.9 * size,
    "leaves",
  );
  box(
    nature,
    "Tree_top",
    x - 0.09,
    1.82,
    z,
    0.67 * size,
    0.42,
    0.65 * size,
    "leaves2",
  );
}
tree(-1.72, -1.5, 1.2);
tree(1.7, -1.62, 1.15);
tree(-1.8, 0.7, 0.9);
tree(1.95, 1.55, 0.72);
box(nature, "Bridge", -0.68, 0.18, 0.18, 1.08, 0.14, 0.66, "wood");
for (let i = 0; i < 4; i++) {
  box(
    nature,
    "BridgePost",
    -1.12 + i * 0.3,
    0.36,
    0.5,
    0.07,
    0.44,
    0.07,
    "wood",
  );
  box(
    nature,
    "BridgePost",
    -1.12 + i * 0.3,
    0.36,
    -0.12,
    0.07,
    0.44,
    0.07,
    "wood",
  );
}
box(nature, "BridgeRail", -0.67, 0.55, 0.5, 1.1, 0.06, 0.06, "wood");
box(nature, "BridgeRail", -0.67, 0.55, -0.12, 1.1, 0.06, 0.06, "wood");
box(nature, "House", 0.52, 0.58, -1.38, 0.9, 0.94, 0.85, "stone");
box(nature, "HouseDoor", 0.51, 0.42, -0.945, 0.23, 0.57, 0.03, "wood");
const roof = new THREE.Mesh(new THREE.ConeGeometry(0.84, 0.61, 4), mats.roof);
roof.position.set(0.52, 1.35, -1.38);
roof.rotation.y = Math.PI / 4;
nature.add(roof);
for (const [x, z] of [
  [-1.5, 1.5],
  [0.05, 1.5],
  [1.5, -0.4],
]) {
  box(logic, "CodestoneNode", x, 0.36, z, 0.35, 0.4, 0.35, "stone");
  box(logic, "Crystal", x, 0.63, z, 0.23, 0.17, 0.23, "crystal");
}
box(logic, "CircuitWire", -0.72, 0.2, 1.5, 1.4, 0.05, 0.05, "crystal");
box(logic, "CircuitWire2", 0.05, 0.2, 0.68, 0.05, 0.05, 1.64, "crystal");
box(logic, "CircuitWire3", 0.77, 0.2, -0.12, 1.47, 0.05, 0.05, "crystal");
for (let i = 0; i < 5; i++)
  box(
    nature,
    "PathTile",
    0.08,
    0.205,
    -0.73 + i * 0.45,
    0.36,
    0.025,
    0.35,
    "sand",
  );
const glb = await new GLTFExporter().parseAsync(root, { binary: true });
mkdirSync("public/models", { recursive: true });
writeFileSync("public/models/codecraft-world.glb", Buffer.from(glb));
cpSync("node_modules/three/examples/jsm/libs/draco/gltf", "public/draco", {
  recursive: true,
});
console.log("New voxel world:", glb.byteLength, "bytes");
