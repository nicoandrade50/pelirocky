import environment from "../environment/api";
import { Film } from "../types/film";

export function getAllFilms() {
  return fetch(`${environment.api}/films`).then(
    (res) => res.json() as Promise<Film[]>
  );
}
export function createFilm(film: Film) {
  return fetch(`${environment.api}/films`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(film),
  }).then((res) => res.json() as Promise<Film>);
}

export function deleteFilm(id: number) {
  return fetch(`${environment.api}/films/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function patchFilm({ id, film }: { id: number; film: Partial<Film> }) {
  return fetch(`${environment.api}/films/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(film),
  });
}
