// confirmation.component.ts
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {
  public title = "Êtes-vous sûr de vouloir supprimer cet élément ?";
  public content= "Cette action est irréversible.";
  public Cancel= "Annuler";
  public Delete= "Supprimer";

  constructor(public dialogRef: MatDialogRef<ConfirmationComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    this.dialogRef.close(true);
  }
}
