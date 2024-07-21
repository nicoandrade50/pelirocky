import environment from "../environment/api";
import { Character } from "../types/character";

export function getAllCharactersBySceneId(id: number) {
  return fetch(`${environment.api}/scenes/${id}/characters`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json() as Promise<Character[]>);
}

export function createNewCharacter(character: Character) {
  return fetch(`${environment.api}/characters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(character),
  }).then((res) => res.json() as Promise<Character>);
}

export function patchCharacter({
  id,
  character,
}: {
  id: number;
  character: Partial<Character>;
}) {
  return fetch(`${environment.api}/characters/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(character),
  });
}

export function deleteCharacterById(id: number) {
  return fetch(`${environment.api}/characters/${id}`, {
    method: "DELETE",
  });
}
