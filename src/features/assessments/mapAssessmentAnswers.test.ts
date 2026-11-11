import { describe, expect, it } from 'vitest';
import { mapAssessmentPayloadToAnswers } from './mapAssessmentAnswers';

describe('mapAssessmentPayloadToAnswers', () => {
  it('formats TUG trial times in seconds with a decimal comma', () => {
    const rows = mapAssessmentPayloadToAnswers('TUG', {
      trial1Sec: 5.123,
      trial2Sec: 6.5,
      trial3Sec: 7,
    });

    expect(rows.map((row) => row.value)).toEqual(['5,12 s', '6,5 s', '7 s']);
    expect(rows.map((row) => row.title)).toEqual(['Ensaio 1', 'Ensaio 2', 'Ensaio 3']);
  });

  it('keeps integer scores and maps categorical answers to labels', () => {
    const rows = mapAssessmentPayloadToAnswers('KATZ', { katz_1: 'independente' });
    expect(rows[0].value).toBe('Independente');

    const berg = mapAssessmentPayloadToAnswers('BERG', { berg_1: 4 });
    expect(berg[0].value).toBe('4');
  });
});
