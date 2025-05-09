import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './shared/dialog/dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'test-bci';
  constructor(private dialog: MatDialog, private router: Router) {}

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      width: '400px',
      panelClass: 'dialog-container',
    });
  }

  goToFavoritesCharacters(): void {
    this.router.navigate(['/characters/favorites']);
  }

  goToAllCharacters(): void {
    this.router.navigate(['/characters']);
  }
}
