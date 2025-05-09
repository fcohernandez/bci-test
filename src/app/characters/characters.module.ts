import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CharactersRoutingModule } from './characters-routing.module';
import { CharacterListComponent } from './character-list/character-list.component';
import { SharedModule } from '../shared/shared.module';
import { FavoriteCharactersComponent } from './favorite-characters/favorite-characters.component';

@NgModule({
  declarations: [CharacterListComponent, FavoriteCharactersComponent],
  imports: [CommonModule, CharactersRoutingModule, SharedModule],
})
export class CharactersModule {}
