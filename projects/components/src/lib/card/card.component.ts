import { booleanAttribute, Component, input, signal } from '@angular/core';
import { LzCardSize, LzCardVariant } from './card.types';

@Component({
  selector: 'lz-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  host: {
    class: 'lz-card-host',
  },
})
export class CardComponent {
  readonly image = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
  readonly subtitle = input<string | undefined>(undefined);
  readonly date = input<string | undefined>(undefined);
  readonly link = input('#');
  readonly variant = input<LzCardVariant>('col');
  readonly size = input<LzCardSize>('xl');
  readonly isLoading = input(false, { transform: booleanAttribute });
  /** Preserved for source API compatibility; it has no visual effect in publikator. */
  readonly metricsType = input(false, { transform: booleanAttribute });

  protected readonly isChecked = signal(false);

  protected toggleChecked(): void {
    this.isChecked.update((checked) => !checked);
  }
}
