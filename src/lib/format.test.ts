import { describe, expect, it } from 'vitest';
import { buildGeneralReportFilename, formatGreetingName } from './format';

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

describe('buildGeneralReportFilename', () => {
  const today = new Date(2026, 10, 4); // 04/11/2026

  it('names the last N days ending today', () => {
    expect(buildGeneralReportFilename('2026-10-06', '2026-11-04', today)).toBe(
      'Relatório Geral - Últimos 30 dias.pdf',
    );
  });

  it('names the current semester', () => {
    expect(buildGeneralReportFilename('2026-07-01', '2026-11-04', today)).toBe(
      'Relatório Geral - Este semestre.pdf',
    );
  });

  it('names whole calendar months', () => {
    expect(buildGeneralReportFilename('2026-08-01', '2026-09-30', today)).toBe(
      'Relatório Geral - 2 meses.pdf',
    );
    expect(buildGeneralReportFilename('2026-10-01', '2026-10-31', today)).toBe(
      'Relatório Geral - 1 mês.pdf',
    );
    expect(buildGeneralReportFilename('2026-01-01', '2026-06-30', today)).toBe(
      'Relatório Geral - Semestre.pdf',
    );
  });

  it('falls back to the number of days for custom ranges', () => {
    expect(buildGeneralReportFilename('2026-09-10', '2026-09-24', today)).toBe(
      'Relatório Geral - 15 dias.pdf',
    );
  });
});
