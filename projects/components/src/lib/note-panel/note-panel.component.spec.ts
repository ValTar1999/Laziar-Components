import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotePanel } from './note-panel.component';

describe('NotePanel', () => {
  let fixture: ComponentFixture<NotePanel>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [NotePanel] });
    fixture = TestBed.createComponent(NotePanel);
  });

  it('renders the block content as inner HTML inside the note panel', () => {
    fixture.componentRef.setInput('content', 'Heads up: <em>read this</em>');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const panel = host.querySelector('.lz-note-panel .lz-note-panel__text');
    expect(host.querySelector('.lz-note-panel__icon')).not.toBeNull();
    expect(panel?.textContent).toBe('Heads up: read this');
    expect(panel?.querySelector('em')?.textContent).toBe('read this');
  });

  it('renders the note-panel wrapper even with empty content', () => {
    fixture.componentRef.setInput('content', '');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.lz-note-panel')).not.toBeNull();
  });
});
