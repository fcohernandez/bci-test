import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, mergeMap, Observable, of } from 'rxjs';
import { CharacterResponse } from './models/character-response.model';
import { Character } from './models/character.model';
import { Pagination } from './models/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  private paginationKey = 'pagination';
  private lastLoadedPageKey = 'lastLoadedPage';

  private charactersSubject = new BehaviorSubject<Character[]>([]);
  characters$: Observable<Character[]> = this.charactersSubject.asObservable();

  private charactersCachedSubject = new BehaviorSubject<Character[]>([]);
  charactersCached$: Observable<Character[]> =
    this.charactersCachedSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.clearPagination();
  }

  clearPagination(): void {
    const pagination = {
      current_page: 1,
      last_visible_page: 0,
      has_next_page: false,
      items: { count: 0, total: 0, per_page: 0 },
    };
    localStorage.removeItem(this.lastLoadedPageKey);
    localStorage.setItem(this.paginationKey, JSON.stringify(pagination));
  }

  getPagination(): Pagination | null {
    const storedPagination = localStorage.getItem(this.paginationKey);
    return storedPagination ? JSON.parse(storedPagination) : null;
  }

  setPagination(pagination: Pagination): void {
    localStorage.setItem(this.paginationKey, JSON.stringify(pagination));
  }

  getCharacters(pagination?: Pagination | null): Observable<CharacterResponse> {
    const currentPage = pagination?.current_page ?? 0;

    const lastLoadedPage =
      Number(localStorage.getItem(this.lastLoadedPageKey)) || 1;
    if (
      lastLoadedPage === currentPage &&
      this.charactersCachedSubject.value.length > 0
    ) {
      return of({
        data: this.charactersCachedSubject.value,
        pagination: this.getPagination() || {
          current_page: currentPage,
          total_pages: 0,
        },
      } as CharacterResponse);
    }

    if (!pagination) {
      pagination = {
        current_page: 1,
        last_visible_page: 0,
        has_next_page: false,
        items: { count: 0, total: 0, per_page: 0 },
      };
    }

    const queryParams = `&page=${pagination.current_page}`;

    return this.http
      .get<CharacterResponse>(
        `https://animedb1.p.rapidapi.com/top/characters?limit=25${queryParams}`,
        {
          headers: {
            'x-rapidapi-key':
              '17dec05238msh1a785d4f9b0c0d1p187ea3jsna232e3ed1cba',
            'x-rapidapi-host': 'animedb1.p.rapidapi.com',
          },
        }
      )
      .pipe(
        mergeMap((response) => {
          const currentCharacters = this.charactersCachedSubject.value;
          const updatedCharacters = [...currentCharacters, ...response.data];

          this.charactersCachedSubject.next(updatedCharacters);

          this.setPagination(response.pagination);
          localStorage.setItem(this.lastLoadedPageKey, currentPage.toString());

          return of(response);
        })
      );
  }

  addCharacter(newCharacter: Character): Observable<void> {
    const currentCharacters = this.charactersSubject.value;

    this.charactersSubject.next([...currentCharacters, newCharacter]);

    return of(void 0);
  }

  removeCharacter(characterToRemove: Character): void {
    const currentCharacters = this.charactersSubject.value;
    const updatedCharacters = currentCharacters.filter(
      (character) => character.mal_id !== characterToRemove.mal_id
    );
    this.charactersSubject.next(updatedCharacters);
  }

  saveAndUpdateCharacter(
    characterId: number,
    updatedData: Partial<Character>
  ): void {
    const currentCharacters = this.charactersSubject.value;
    const characterIndex = currentCharacters.findIndex(
      (character) => character.mal_id === characterId
    );

    if (characterIndex !== -1) {
      const updatedCharacter = {
        ...currentCharacters[characterIndex],
        ...updatedData,
      };
      const updatedCharacters = [...currentCharacters];
      updatedCharacters[characterIndex] = updatedCharacter;

      this.charactersSubject.next(updatedCharacters);
    } else {
      const newCharacter: Character = {
        mal_id: characterId,
        ...updatedData,
      } as Character;
      this.charactersSubject.next([...currentCharacters, newCharacter]);
    }
  }

  get favoriteCharacters(): Character[] {
    return this.charactersSubject.getValue();
  }
}
