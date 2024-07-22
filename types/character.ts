import { Scene } from "./scene";

export interface Character {
  id: string;
  description: string;
  gender: string;
  status: string;
  sceneId?: number;
  scene?: Scene;
}
