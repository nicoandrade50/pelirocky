import { Film } from "./film";

export interface Scene {
  id: string;
  description: string;
  budget: number;
  minutes: number;
  filmId?: number;
  film?: Film;
}
