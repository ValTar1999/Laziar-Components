import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoginPromptBanner } from './login-prompt-banner.component';

describe('LoginPromptBanner', () => {
  let component: LoginPromptBanner;
  let fixture: ComponentFixture<LoginPromptBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPromptBanner],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPromptBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses source defaults', () => {
    expect(component.text()).toBe('');
    expect(component.route()).toBe('/auth');
    expect(component.ariaLabel()).toBe('');
  });

  it('renders text and falls back aria-label to text', () => {
    fixture.componentRef.setInput('text', 'Autentifică-te pentru a continua');
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector('a');
    expect(link?.textContent).toContain('Autentifică-te pentru a continua');
    expect(link?.getAttribute('aria-label')).toBe('Autentifică-te pentru a continua');
  });

  it('prefers explicit ariaLabel over text', () => {
    fixture.componentRef.setInput('text', 'Visible');
    fixture.componentRef.setInput('ariaLabel', 'Accessible');
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector('a');
    expect(link?.getAttribute('aria-label')).toBe('Accessible');
  });
});
