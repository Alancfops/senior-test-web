export function isMockMode(): boolean {
  return import.meta.env.VITE_USE_MOCK_API === 'true';
}

export function getMockDelay(): number {
  const parsed = Number(import.meta.env.VITE_MOCK_DELAY_MS ?? 350);
  return Number.isFinite(parsed) ? parsed : 350;
}
