/** Source of "now". Injected so tests can freeze today's date. */
export interface Clock {
  now(): Date;
}

export const systemClock: Clock = { now: () => new Date() };

export const fixedClock = (iso: string): Clock => ({ now: () => new Date(iso) });
