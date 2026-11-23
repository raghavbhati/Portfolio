import { experienceYears } from './experience';

const march2024 = new Date(2024, 2, 1);

describe('experienceYears', () => {
  test('counts whole half-years, rounding down', () => {
    expect(experienceYears(march2024, new Date(2026, 10, 23))).toBe('2.5+');
    expect(experienceYears(march2024, new Date(2027, 1, 28))).toBe('2.5+');
    expect(experienceYears(march2024, new Date(2027, 2, 1))).toBe('3+');
    expect(experienceYears(march2024, new Date(2027, 8, 1))).toBe('3.5+');
  });

  test('never goes below zero', () => {
    expect(experienceYears(march2024, new Date(2024, 1, 1))).toBe('0+');
  });
});
