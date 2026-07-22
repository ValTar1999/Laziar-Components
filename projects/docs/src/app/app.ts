import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Components, LzThemeMode, ThemeService } from '@laziar/components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Components],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly theme = inject(ThemeService);

  protected readonly title = 'Laziar Components Docs';
  protected readonly mode = this.theme.mode;
  protected readonly resolved = this.theme.resolved;

  protected setTheme(mode: LzThemeMode): void {
    this.theme.setMode(mode);
  }
}
