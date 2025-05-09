import { Component, OnInit } from '@angular/core';
import { CharactersService } from '../characters.service';
import { Character } from '../models/character.model';
import { Pagination } from '../models/pagination.model';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
})
export class CharacterListComponent implements OnInit {
  characters: Character[] = [];
  pagination: Pagination | null = null;

  constructor(
    private readonly _characterService: CharactersService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.pagination = this._characterService.getPagination();

    if (!this.characters.length) {
      this.loadCharacters();
    }
  }

  loadCharacters(addPage?: boolean): void {
    if (addPage) {
      this.pagination!.current_page++;
    }
    this._characterService
      .getCharacters(this.pagination)
      .pipe(
        switchMap((response) => {
          this.pagination = response.pagination;
          this._characterService.setPagination(this.pagination!);
          return this._characterService.charactersCached$;
        })
      )
      .subscribe({
        next: (characters) => {
          this.characters = characters;
        },
        error: (error) => {
          console.error('Error loading characters:', error);
        },
      });
  }

  addCharacterToFavorites(character: Character): void {
    this._characterService.addCharacter(character).subscribe({
      next: () => {
        console.log('Character added to favorites:', character);
        this.router.navigate(['/characters/favorites']);
      },
    });
  }
}
