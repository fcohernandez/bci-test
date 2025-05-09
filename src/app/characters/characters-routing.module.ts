import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterListComponent } from './character-list/character-list.component';
import { FavoriteCharactersComponent } from './favorite-characters/favorite-characters.component';

const routes: Routes = [
  {
    path: '',
    component: CharacterListComponent,
  },
  {
    path: 'favorites',
    component: FavoriteCharactersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharactersRoutingModule {}
