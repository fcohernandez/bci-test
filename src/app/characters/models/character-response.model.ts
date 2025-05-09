import { Character } from './character.model';
import { Pagination } from './pagination.model';

export interface CharacterResponse {
  pagination: Pagination;
  data: Character[];
}
