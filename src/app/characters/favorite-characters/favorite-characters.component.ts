import { Component } from '@angular/core';
import { CharactersService } from '../characters.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { Character } from '../models/character.model';

@Component({
  selector: 'app-favorite-characters',
  templateUrl: './favorite-characters.component.html',
  styleUrl: './favorite-characters.component.scss',
})
export class FavoriteCharactersComponent {
  constructor(
    private readonly charactersService: CharactersService,
    private dialog: MatDialog
  ) {}
  get favoriteCharacters() {
    return this.charactersService.favoriteCharacters;
  }

  addCharacter(character: any): void {
    this.charactersService.addCharacter(character);
  }

  removeCharacterFromFavorites(character: any): void {
    this.charactersService.removeCharacter(character);
  }

  openDialog(character: Character): void {
    this.dialog.open(DialogComponent, {
      width: '400px',
      panelClass: 'dialog-container',
      data: {
        name: character.name,
        description: character.about,
        characterId: character.mal_id,
      },
    });
  }

  onEditCharacter(character: Character): void {
    this.openDialog(character);
  }
}
