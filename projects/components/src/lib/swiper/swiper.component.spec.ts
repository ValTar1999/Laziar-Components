import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwiperComponent } from './swiper.component';

@Component({
  standalone: true,
  imports: [SwiperComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    @if (shown) {
      <lz-swiper previousLabel="Înapoi" nextLabel="Înainte">
        <swiper-slide>One</swiper-slide>
        <swiper-slide>Two</swiper-slide>
        <swiper-slide>Three</swiper-slide>
        <swiper-slide>Four</swiper-slide>
      </lz-swiper>
    }
  `,
})
class SwiperHost {
  shown = true;
}

describe('SwiperComponent', () => {
  let fixture: ComponentFixture<SwiperHost>;
  const nav = (which: 'prev' | 'next'): HTMLButtonElement =>
    fixture.nativeElement.querySelector('.lz-swiper__nav--' + which);

  beforeEach(() => {
    fixture = TestBed.createComponent(SwiperHost);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.nativeElement.remove();
    fixture.destroy();
  });

  it('projects the slides and names the arrows with the given strings', () => {
    expect(fixture.nativeElement.querySelectorAll('swiper-slide').length).toBe(4);
    expect(nav('prev').getAttribute('aria-label')).toBe('Înapoi');
    expect(nav('next').getAttribute('aria-label')).toBe('Înainte');
  });

  it('starts at the first slide, with the previous arrow marked disabled', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    expect(nav('prev').getAttribute('aria-disabled')).toBe('true');
    expect(nav('prev').classList).toContain('lz-swiper__nav--disabled');
  });

  it('can be removed while swiper is still loading', async () => {
    fixture.componentInstance.shown = false;
    fixture.detectChanges();

    await expectAsync(fixture.whenStable()).toBeResolved();
    expect(fixture.nativeElement.querySelector('lz-swiper')).toBeNull();
  });
});
