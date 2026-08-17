import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Icon } from './icon.component';

describe('Icon', () => {
  let fixture: ComponentFixture<Icon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Icon],
    }).compileComponents();

    fixture = TestBed.createComponent(Icon);
    fixture.componentRef.setInput('name', 'chevron-down');
    fixture.componentRef.setInput('type', 'mini');
    fixture.detectChanges();
  });

  it('creates and points at the mini sprite symbol', () => {
    expect(fixture.componentInstance).toBeTruthy();
    const useEl = fixture.nativeElement.querySelector('use') as SVGUseElement;
    expect(useEl.getAttribute('href')).toBe('assets/icons/icons-mini.svg#chevron-down');
    expect(fixture.nativeElement.getAttribute('data-type')).toBe('mini');
  });

  it('uses the outline sprite for stroked icons', () => {
    fixture.componentRef.setInput('type', 'outline');
    fixture.componentRef.setInput('name', 'arrow-right');
    fixture.detectChanges();

    const useEl = fixture.nativeElement.querySelector('use') as SVGUseElement;
    expect(useEl.getAttribute('href')).toBe('assets/icons/icons-outline.svg#arrow-right');
  });
});
