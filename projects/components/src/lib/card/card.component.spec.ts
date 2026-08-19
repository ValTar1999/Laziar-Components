import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates with frontend card defaults', () => {
    expect(component).toBeTruthy();
    expect(component.link()).toBe('#');
    expect(component.variant()).toBe('col');
    expect(component.size()).toBe('xl');
    expect(component.rowImageHeightMode()).toBe('fixed');
    expect(component.rowIdentityPosition()).toBe('top');
    expect(component.rowMetaLayout()).toBe('split');
    expect(component.rowImageAspect()).toBe('1/1');
    expect(component.rowImageAspectMd()).toBe('3/2');
    expect(component.rowSubtitleLayout()).toBe('below');
    expect(component.rowSubtitleLayoutMd()).toBe('beside');
    expect(component.showBottomBorder()).toBeTrue();
    expect(component.isLoading()).toBeFalse();
    expect(component.metricsType()).toBeFalse();
    expect(component.showActions()).toBeTrue();
    expect(component.showSavedActions()).toBeFalse();
  });

  it('emits openArticle when the title is clicked', () => {
    fixture.componentRef.setInput('title', 'Headline');
    fixture.componentRef.setInput('openArticleId', 42);
    fixture.detectChanges();

    const payloads: (string | number | null)[] = [];
    component.openArticle.subscribe((value) => payloads.push(value));

    fixture.debugElement.query(By.css('.lz-card__title-link')).nativeElement.click();

    expect(payloads).toEqual([42]);
  });

  it('renders publisher identity on row cards', () => {
    fixture.componentRef.setInput('variant', 'row');
    fixture.componentRef.setInput('size', 'md');
    fixture.componentRef.setInput('publisher', 'AGORA');
    fixture.componentRef.setInput('author', 'Ion');
    fixture.componentRef.setInput('title', 'Headline');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('AGORA');
    expect(fixture.nativeElement.textContent).toContain('Ion');
    expect(fixture.nativeElement.textContent).toContain('de');
  });

  it('opens the more-actions menu in a CDK overlay', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1280 });
    component['onWindowResize']();
    fixture.componentRef.setInput('title', 'Headline');
    fixture.detectChanges();

    fixture.debugElement.query(By.css('[aria-label="Mai mult"]')).nativeElement.click();
    fixture.detectChanges();

    expect(component['isMoreMenuOpen']()).toBeTrue();
    expect(document.querySelector('.lz-card-cdk-pane .lz-card__menu')).not.toBeNull();
  });
});
