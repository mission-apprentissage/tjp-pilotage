import { describe, expect,it } from 'vitest';

import { parseCfd } from '@/modules/import/usecases/importFormationEtablissement/utils';

describe('parseCfd', () => {
  it('Doit retourner 310 pour un CFD qui commence par 320 et qui a une durée de 1 an(s)', () => {
    expect(parseCfd('320000', 1)).toBe(310);
  });

  it('Doit retourner 311 pour un CFD qui commence par 320 et qui a une durée de 2 an(s)', () => {
    expect(parseCfd('320000', 2)).toBe(311);
  });

  it('Doit retourner 312 pour un CFD qui commence par 320 et qui a une durée de 3 an(s)', () => {
    expect(parseCfd('320000', 3)).toBe(312);
  });

  it('Doit retourner 370 pour un CFD qui commence par 323 et qui a une durée de 1 an(s)', () => {
    expect(parseCfd('323000', 1)).toBe(370);
  });

  it('Doit retourner 247 pour un CFD qui commence par 400 et qui a une durée de 1 an(s)', () => {
    expect(parseCfd('400000', 1)).toBe(247);
  });

  it('Doit retourner 252 pour un CFD qui commence par 401 et qui a une durée de 3 an(s)', () => {
    expect(parseCfd('401000', 3)).toBe(252);
  });

  it('Doit retourner 273 pour un CFD qui commence par 403 et qui a une durée de 2 an(s)', () => {
    expect(parseCfd('403000', 2)).toBe(273);
  });

  it('Doit retourner 890 pour un CFD qui commence par 450 et qui a une durée de 1 an(s)', () => {
    expect(parseCfd('450000', 1)).toBe(890);
  });

  it('Doit retourner 240 pour un CFD qui commence par 500 et qui a une durée de 1 an(s)', () => {
    expect(parseCfd('500000', 1)).toBe(240);
  });

  it('Doit retourner 257 pour un CFD qui commence par 561', () => {
    expect(parseCfd('561000', 1)).toBe(257);
  });

  it('Doit retourner 258 pour un CFD qui commence par 461', () => {
    expect(parseCfd('461000', 1)).toBe(258);
  });

  it('Doit retourner -1 pour un CFD inconnu', () => {
    expect(parseCfd('999000', 1)).toBe(-1);
  });

  it('Doit retourner -1 pour une durée inconnue', () => {
    expect(parseCfd('320000', 4)).toBe(-1);
  });
});
