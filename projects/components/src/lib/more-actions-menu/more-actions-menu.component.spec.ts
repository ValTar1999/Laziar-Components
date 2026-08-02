import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoreActionsMenu } from './more-actions-menu.component';

describe('MoreActionsMenu', () => {
  let component: MoreActionsMenu;
  let fixture: ComponentFixture<MoreActionsMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoreActionsMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(MoreActionsMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isDesktop reflects the layout input', () => {
    expect(component['isDesktop']()).toBe(true);

    fixture.componentRef.setInput('layout', 'mobile');
    fixture.detectChanges();

    expect(component['isDesktop']()).toBe(false);
  });

  it('toggles Romanian labels with followed/saved state', () => {
    expect(component['watchLaterLabel']()).toBe('Vizioneaza mai tarziu');
    fixture.componentRef.setInput('isWatchLater', true);
    expect(component['watchLaterLabel']()).toBe('Elimina din Vizioneaza mai tarziu');

    expect(component['saveToListLabel']()).toBe('Salveaza in lista');
    fixture.componentRef.setInput('isSavedToList', true);
    expect(component['saveToListLabel']()).toBe('Elimina din lista');

    expect(component['publisherFollowLabel']()).toBe('Urmareste Publisherul');
    fixture.componentRef.setInput('isPublisherFollowed', true);
    expect(component['publisherFollowLabel']()).toBe('Nu mai urmaresti Publisherul');

    expect(component['authorFollowLabel']()).toBe('Urmareste Autorul');
    fixture.componentRef.setInput('isAuthorFollowed', true);
    expect(component['authorFollowLabel']()).toBe('Nu mai urmaresti Autorul');
  });

  it('emits watchLater, share and copyLink from enabled rows', () => {
    const watch = spyOn(component.watchLater, 'emit');
    const share = spyOn(component.share, 'emit');
    const copy = spyOn(component.copyLink, 'emit');
    fixture.detectChanges();

    clickRow('Vizioneaza mai tarziu');
    clickRow('Distribuie');
    clickRow('Copiază link');

    expect(watch).toHaveBeenCalled();
    expect(share).toHaveBeenCalled();
    expect(copy).toHaveBeenCalled();
  });

  it('does not emit saveToList while disabled by default', () => {
    const saved = spyOn(component.saveToList, 'emit');
    fixture.detectChanges();

    clickRow('Salveaza in lista');

    expect(saved).not.toHaveBeenCalled();
  });

  it('emits disabled-by-default actions once enabled', () => {
    fixture.componentRef.setInput('disableSaveToList', false);
    fixture.componentRef.setInput('disablePublisherFollow', false);
    fixture.componentRef.setInput('disableAuthorFollow', false);
    fixture.componentRef.setInput('disableReport', false);

    const save = spyOn(component.saveToList, 'emit');
    const publisher = spyOn(component.publisherFollow, 'emit');
    const author = spyOn(component.authorFollow, 'emit');
    const report = spyOn(component.report, 'emit');
    fixture.detectChanges();

    clickRow('Salveaza in lista');
    clickRow('Urmareste Publisherul');
    clickRow('Urmareste Autorul');
    clickRow('Raporteaza');

    expect(save).toHaveBeenCalled();
    expect(publisher).toHaveBeenCalled();
    expect(author).toHaveBeenCalled();
    expect(report).toHaveBeenCalled();
  });

  function clickRow(labelText: string): void {
    const host = fixture.nativeElement as HTMLElement;
    const button = Array.from(host.querySelectorAll('button[role="menuitem"]')).find((b) =>
      b.textContent?.includes(labelText),
    ) as HTMLButtonElement | undefined;
    button?.click();
  }
});
