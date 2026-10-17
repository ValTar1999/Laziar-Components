import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PageHeader } from './page-header.component';

@Component({
  imports: [PageHeader],
  template: `
    <lz-page-header id="full" heading="Conținut Video" subtitle="Videoclipuri și playlisturi">
      <button lzPageHeaderActions type="button">Creează</button>
      <nav lzPageHeaderTabs>Tabs</nav>
    </lz-page-header>
    <lz-page-header id="bare" heading="Setări" />
  `,
})
class HostComponent {}

describe('PageHeader', () => {
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
    document.body.appendChild(host);
  });

  afterEach(() => host.remove());

  const part = (id: string, selector: string): HTMLElement | null =>
    host.querySelector<HTMLElement>(`#${id} ${selector}`);

  it('renders the title as the page heading', () => {
    expect(part('full', 'h1')?.textContent?.trim()).toBe('Conținut Video');
  });

  it('shows the subtitle only when given', () => {
    expect(part('full', '.lz-page-header__subtitle')?.textContent?.trim()).toBe(
      'Videoclipuri și playlisturi',
    );
    expect(part('bare', '.lz-page-header__subtitle')).toBeNull();
  });

  it('projects actions and tabs into their slots', () => {
    expect(part('full', '.lz-page-header__actions button')?.textContent).toBe('Creează');
    expect(part('full', '.lz-page-header__tabs nav')).not.toBeNull();
  });

  it('collapses the empty slots', () => {
    expect(getComputedStyle(part('bare', '.lz-page-header__actions')!).display).toBe('none');
    expect(getComputedStyle(part('bare', '.lz-page-header__tabs')!).display).toBe('none');
  });

  it('draws one line under the whole header', () => {
    const header = part('bare', '.lz-page-header')!;
    expect(getComputedStyle(header).borderBottomWidth).toBe('1px');
    expect(getComputedStyle(header).borderBottomStyle).toBe('solid');
  });
});
