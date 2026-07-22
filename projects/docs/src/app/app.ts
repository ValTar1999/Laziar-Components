import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Components } from '@laziar/components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Components],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Laziar Components Docs');
}
