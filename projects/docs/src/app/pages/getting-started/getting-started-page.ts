import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  Icon,
  InputComponent,
  LzAvatarGroupItem,
  PulseDot,
  SwitchToggle,
  ToastService,
  Tooltip,
} from '@laziar/components';

@Component({
  selector: 'docs-getting-started-page',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    TranslocoPipe,
    Alert,
    Avatar,
    AvatarGroup,
    Badge,
    Button,
    ButtonGroup,
    Checkbox,
    Icon,
    InputComponent,
    PulseDot,
    SwitchToggle,
    Tooltip,
  ],
  templateUrl: './getting-started-page.html',
  styleUrl: './getting-started-page.scss',
})
export class GettingStartedPage {
  private readonly toast = inject(ToastService);
  private readonly transloco = inject(TranslocoService);

  protected readonly newsletter = signal(true);
  protected readonly email = signal('');
  protected readonly agreed = signal(false);

  protected readonly avatars: LzAvatarGroupItem[] = [
    { firstName: 'Ana', lastName: 'Pop' },
    { firstName: 'Ion', lastName: 'Rus' },
    { firstName: 'Maria', lastName: 'Ionescu' },
    { firstName: 'Vlad', lastName: 'Nistor' },
  ];

  protected showToast(): void {
    this.toast.show({
      message: this.transloco.translate('gettingStarted.toastMessage'),
      messageBold: this.transloco.translate('gettingStarted.toastBold'),
      type: 'success',
    });
  }
}
