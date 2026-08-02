import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { Icon } from '../icon/icon.component';
import { LzDropdownSection, LzDropdownSize } from './dropdown.types';

@Component({
  selector: 'lz-dropdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgStyle, Icon],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  host: {
    class: 'lz-dropdown-host',
  },
})
export class DropdownComponent implements AfterViewInit {
  readonly title = input('Menu');
  readonly sections = input<LzDropdownSection[]>([]);
  readonly sizeVariant = input<LzDropdownSize>('xl');

  readonly itemSelected = output<string>();
  // Required source-compatible API name.
  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly close = output<void>();

  @ViewChild('dropdownMenu') private dropdownMenu?: ElementRef<HTMLElement>;

  protected readonly isOpen = signal(false);
  protected readonly positionStyle = signal<Record<string, string>>({
    top: 'auto',
    bottom: 'auto',
    left: 'auto',
    right: 'auto',
  });

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  ngAfterViewInit(): void {
    this.calculatePosition();
  }

  protected toggleDropdown(): void {
    const open = !this.isOpen();
    this.isOpen.set(open);

    if (open) {
      setTimeout(() => this.calculatePosition());
    } else {
      this.closeDropdown();
    }
  }

  protected selectItem(item: string): void {
    this.itemSelected.emit(item);
    this.closeDropdown();
  }

  @HostListener('window:resize')
  protected onWindowResize(): void {
    if (this.isOpen()) {
      this.calculatePosition();
    }
  }

  @HostListener('document:click', ['$event'])
  protected onClickOutside(event: MouseEvent): void {
    if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeDropdown();
    }
  }

  private closeDropdown(): void {
    if (!this.isOpen()) return;

    this.isOpen.set(false);
    this.close.emit();
  }

  private calculatePosition(): void {
    const menu = this.dropdownMenu?.nativeElement;
    const button =
      this.elementRef.nativeElement.querySelector<HTMLButtonElement>('.lz-dropdown__trigger');
    if (!menu || !button) return;

    const buttonRect = button.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const parentRect = this.elementRef.nativeElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    let top = 'auto';
    let bottom = 'auto';

    if (spaceBelow >= menuRect.height || spaceBelow >= spaceAbove) {
      top = `${buttonRect.bottom - parentRect.top}px`;
    } else {
      bottom = `${parentRect.bottom - buttonRect.top}px`;
    }

    this.positionStyle.set({
      top,
      bottom,
      left: `${buttonRect.left - parentRect.left}px`,
      right: 'auto',
    });
  }
}
