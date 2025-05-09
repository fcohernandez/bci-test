import { CharacterImage } from "./character-image.model";

export interface Character {
  mal_id: number;
  url: string;
  images?: CharacterImage;
  name: string;
  name_kanji: string;
  nicknames: string[];
  favorites: number;
  about: string;
}
