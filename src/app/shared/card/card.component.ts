import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() title: string = '';
  @Input() iconImageUrl: string | undefined = '';
  @Input() mainImageUrl: string | undefined = '';
  @Input() description: string = '';
  @Input() onAdd?: () => void;
  @Input() onDelete?: () => void;
  @Input() onEdit?: () => void;
}
