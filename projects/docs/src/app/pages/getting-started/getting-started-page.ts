import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'docs-getting-started-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './getting-started-page.html',
  styleUrl: './getting-started-page.scss',
})
export class GettingStartedPage {}
