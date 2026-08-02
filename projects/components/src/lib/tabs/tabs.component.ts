import { Component, computed, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LzTabBadge, LzTabsSize, LzTabsStyle, LzDisabledTabTooltipTrigger } from './tabs.types';
import { Badge } from '../badge/badge.component';
import { Icon } from '../icon/icon.component';
import { Tooltip } from '../tooltip/tooltip.component';

/** Tabs — union: frontend + publikator (`app-tabs` / `lz-tabs`). */
@Component({
  selector: 'lz-tabs',
  standalone: true,
  imports: [CommonModule, Badge, Icon, Tooltip],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class Tabs {
  readonly tabs = input<string[]>([]);
  readonly style = input<LzTabsStyle>('outline');
  readonly size = input<LzTabsSize>('md');
  readonly badges = input<(LzTabBadge | null)[]>([]);
  readonly icons = input<string[]>([]);
  readonly class = input<string | undefined>(undefined);
  readonly disabledTabIndexes = input<number[]>([]);
  readonly disabledTabTooltips = input<Record<string, string>>({});
  readonly disabledTabTooltipTrigger = input<LzDisabledTabTooltipTrigger>('hover');
  /** Two-way active index (updates locally on click like F/P). */
  readonly activeTab = model(0);

  protected readonly showUnderline = computed(() => this.style() !== 'outline');

  protected readonly underlineStyle = computed(() => {
    const tabCount = this.tabs().length || 1;
    const width = 100 / tabCount;
    return {
      width: `${width}%`,
      left: `${this.activeTab() * width}%`,
    };
  });

  protected isTabDisabled(index: number): boolean {
    return this.disabledTabIndexes().includes(index);
  }

  protected getDisabledTooltip(index: number): string {
    return this.disabledTabTooltips()[String(index)] || '';
  }

  setActiveTab(index: number): void {
    if (this.isTabDisabled(index)) {
      return;
    }
    if (index >= 0 && index < this.tabs().length) {
      this.activeTab.set(index);
    }
  }
}
