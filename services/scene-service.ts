import environment from "../environment/api";
import { Scene } from "../types/scene";

export function getAllScenesByFilmId(id: number) {
  return fetch(`${environment.api}/films/${id}/scenes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json() as Promise<Scene[]>);
}

export function createNewScene(scene: Scene) {
  return fetch(`${environment.api}/scenes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scene),
  }).then((res) => res.json() as Promise<Scene[]>);
}

export function deleteSceneById(id: number) {
  return fetch(`${environment.api}/scenes/${id}`, { method: "DELETE" });
}

export function patchScene({
  id,
  scene,
}: {
  id: number;
  scene: Partial<Scene>;
}) {
  return fetch(`${environment.api}/scenes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scene),
  });
}

export function findAllScenesByFilmId(filmId: number) {
  return fetch(`${environment.api}/films/${filmId}/scenes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json() as Promise<Scene[]>);
}
