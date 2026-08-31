export type BackNavigationState = {
  backTo?: string;
  backLabel?: string;
};

export function readBackNavigation(
  state: unknown,
  fallback: BackNavigationState,
): Required<BackNavigationState> {
  const parsed = state as BackNavigationState | null;
  return {
    backTo: parsed?.backTo ?? fallback.backTo ?? '/dashboard',
    backLabel: parsed?.backLabel ?? fallback.backLabel ?? 'Voltar',
  };
}
