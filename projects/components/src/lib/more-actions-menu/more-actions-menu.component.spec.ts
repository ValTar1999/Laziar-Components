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

  it('toggles default English labels with followed/saved state', () => {
    expect(component['watchLaterDisplayLabel']()).toBe('Watch later');
    fixture.componentRef.setInput('isWatchLater', true);
    expect(component['watchLaterDisplayLabel']()).toBe('Remove from Watch later');

    expect(component['saveToListDisplayLabel']()).toBe('Save to list');
    fixture.componentRef.setInput('isSavedToList', true);
    expect(component['saveToListDisplayLabel']()).toBe('Remove from list');

    expect(component['publisherFollowDisplayLabel']()).toBe('Follow publisher');
    fixture.componentRef.setInput('isPublisherFollowed', true);
    expect(component['publisherFollowDisplayLabel']()).toBe('Unfollow publisher');

    expect(component['authorFollowDisplayLabel']()).toBe('Follow author');
    fixture.componentRef.setInput('isAuthorFollowed', true);
    expect(component['authorFollowDisplayLabel']()).toBe('Unfollow author');
  });

  it('accepts locale-specific label overrides from the consumer', () => {
    fixture.componentRef.setInput('watchLaterLabel', 'Vizioneaza mai tarziu');
    fixture.componentRef.setInput('removeWatchLaterLabel', 'Elimina din Vizioneaza mai tarziu');
    fixture.detectChanges();

    expect(component['watchLaterDisplayLabel']()).toBe('Vizioneaza mai tarziu');
    fixture.componentRef.setInput('isWatchLater', true);
    expect(component['watchLaterDisplayLabel']()).toBe('Elimina din Vizioneaza mai tarziu');
  });

  it('emits watchLater, share and copyLink from enabled rows', () => {
    const watch = spyOn(component.watchLater, 'emit');
    const share = spyOn(component.share, 'emit');
    const copy = spyOn(component.copyLink, 'emit');
    fixture.detectChanges();

    clickRow('Watch later');
    clickRow('Share');
    clickRow('Copy link');

    expect(watch).toHaveBeenCalled();
    expect(share).toHaveBeenCalled();
    expect(copy).toHaveBeenCalled();
  });

  it('does not emit saveToList while disabled by default', () => {
    const saved = spyOn(component.saveToList, 'emit');
    fixture.detectChanges();

    clickRow('Save to list');

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

    clickRow('Save to list');
    clickRow('Follow publisher');
    clickRow('Follow author');
    clickRow('Report');

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
