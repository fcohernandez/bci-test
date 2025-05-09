import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CharactersService } from '../../characters/characters.service';

export interface DialogData {
  name?: string;
  description?: string;
  characterId?: number;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  form: FormGroup;
  characterId: number;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private readonly charactersService: CharactersService
  ) {
    this.characterId = data?.characterId ?? 0;
    this.form = this.fb.group({
      name: [data?.name, [Validators.required]],
      description: [data?.description, [Validators.required]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const updatedData = this.form.value;
      this.charactersService.saveAndUpdateCharacter(this.characterId, {
        name: updatedData.name,
        about: updatedData.description,
      });
    }
    this.dialogRef.close();
  }
}
