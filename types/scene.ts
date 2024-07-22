import { Film } from "./film";

export interface Scene {
  id: string;
  description: string;
  location: string;
  minutes: number;
  filmId?: number;
  film?: Film;
}
