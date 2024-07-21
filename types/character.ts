import { Scene } from "./scene";

export interface Character {
  id: string;
  description: string;
  cost: number;
  stock: number;
  sceneId?: number;
  scene?: Scene;
}
