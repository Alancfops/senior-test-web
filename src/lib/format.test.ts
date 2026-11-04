import { describe, expect, it } from 'vitest';
import { formatGreetingName } from './format';

describe('formatGreetingName', () => {
  it('keeps the first two names without ellipsis', () => {
    expect(formatGreetingName('Maria Aparecida da Silva Souza')).toBe('Maria Aparecida');
  });

  it('includes the next word when the second one is a particle', () => {
    expect(formatGreetingName('Ana de Souza Lima')).toBe('Ana de Souza');
  });

  it('returns short names as they are', () => {
    expect(formatGreetingName('  Ana   Souza ')).toBe('Ana Souza');
    expect(formatGreetingName('Ana')).toBe('Ana');
  });

  it('returns an empty string for blank input', () => {
    expect(formatGreetingName('   ')).toBe('');
  });
});
