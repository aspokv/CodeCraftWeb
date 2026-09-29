/** Replaceable GLB. Top-level groups with userData.layer enable exploded view. */
export const MODEL_CONFIG = {
  url: "/models/codecraft-world.glb",
  dracoPath: "/draco/",
  scale: 1,
  rotation: 0.2,
};
export type SceneState = {
  progress: number;
  spin: number;
  explode: boolean;
  color: string;
  material: number;
  reduced: boolean;
  hotspots: boolean;
  tower: number;
};
