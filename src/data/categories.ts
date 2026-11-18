export const categories = [
  { id: 'strategy', name: 'Стратегия', image: 'strategy.svg' },
  { id: 'party', name: 'Вечеринка', image: 'party.svg' },
  { id: 'family', name: 'Семейные', image: 'family.svg' },
] as const;

export type Category = (typeof categories)[number]['id'];
