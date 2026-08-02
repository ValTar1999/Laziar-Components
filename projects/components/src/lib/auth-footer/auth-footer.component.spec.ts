import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { AuthFooter } from './auth-footer.component';

describe('AuthFooter', () => {
  let component: AuthFooter;
  let fixture: ComponentFixture<AuthFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFooter],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exposes the current year', () => {
    expect(component['currentYear']()).toBe(new Date().getFullYear());
  });

  it('renders the copyright line with defaults', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain(`© ${new Date().getFullYear()} Laziar SRL`);
  });

  it('renders the three footer navigation links', () => {
    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    const hrefs = links.map((link) => (link.nativeElement as HTMLElement).getAttribute('href'));
    expect(hrefs).toEqual(['/about', '/terms-and-conditions', '/contacts']);
  });
});
