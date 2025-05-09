import { Component, OnDestroy, OnInit } from '@angular/core';
import { CharactersService } from '../characters.service';
import { Character } from '../models/character.model';
import { Pagination } from '../models/pagination.model';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
})
export class CharacterListComponent implements OnInit, OnDestroy {
  characters: Character[] = [];
  pagination: Pagination | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly _characterService: CharactersService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Recupera la paginación desde el servicio
    this.pagination = this._characterService.getPagination();

    if (!this.characters.length) {
      this.loadCharacters();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCharacters(addPage?: boolean): void {
    if (addPage && this.pagination?.has_next_page) {
      this.pagination = {
        ...this.pagination,
        current_page: this.pagination.current_page + 1,
      };
    }

    this.isLoading = true;

    this._characterService
      .getCharacters(this.pagination)
      .pipe(
        switchMap((response) => {
          this.pagination = response.pagination;
          this._characterService.setPagination(this.pagination!);
          return this._characterService.charactersCached$;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (characters) => {
          this.characters = characters;
          this.isLoading = false;
          this.errorMessage = null;
        },
        error: (error) => {
          console.error('Error loading characters:', error);
          this.isLoading = false;
          this.errorMessage =
            'Error loading characters. Please try again later.';
        },
      });
  }

  addCharacterToFavorites(character: Character): void {
    this._characterService.addCharacter(character).subscribe({
      next: () => {
        console.log('Character added to favorites:', character);
        this.router.navigate(['/characters/favorites']);
      },
      error: (error) => {
        console.error('Error adding character to favorites:', error);
      },
    });
  }
}
