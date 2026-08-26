import { isMockMode } from '@/lib/api/config';

export function PrototypeBanner() {
  if (!isMockMode()) return null;

  return (
    <div
      role="status"
      className="border-b border-[color-mix(in_srgb,var(--stf-primary)_25%,var(--stf-border))] bg-[color-mix(in_srgb,var(--stf-primary)_8%,var(--stf-surface))] px-3 py-2 text-center text-[11px] font-medium leading-snug text-[var(--stf-primary)] sm:px-4 sm:text-xs"
    >
      Modo protótipo com dados fictícios. Clique em Entrar na tela de login para explorar.
    </div>
  );
}
