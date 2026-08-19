import { lzTableUtilityToCss } from './table.types';

describe('lzTableUtilityToCss', () => {
  it('parses Tailwind arbitrary and scale width classes from publikator', () => {
    expect(lzTableUtilityToCss('min-w-[260px]')).toBe('260px');
    expect(lzTableUtilityToCss('min-w-[12rem]')).toBe('12rem');
    expect(lzTableUtilityToCss('min-w-12')).toBe('3rem');
    expect(lzTableUtilityToCss('w-40')).toBe('10rem');
    expect(lzTableUtilityToCss('92px')).toBe('92px');
    expect(lzTableUtilityToCss('unknown-class')).toBeNull();
  });
});
