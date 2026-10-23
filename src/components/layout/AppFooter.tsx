const CURRENT_YEAR = new Date().getFullYear();

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--stf-border)] bg-[var(--stf-surface)] p-4">
      <div className="mx-auto flex w-full max-w-[1040px] flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between sm:gap-4">
        <div className="flex items-center gap-2">
          <img
            src="/logo-cesmac-citec.svg"
            alt=""
            width={110}
            height={100}
            className="h-8 w-auto"
          />
          <span className="text-xs text-[var(--stf-text-muted)]">CESMAC CITEC</span>
        </div>
        <p className="text-xs text-[var(--stf-text-muted)]">© {CURRENT_YEAR} Sênior Teste Funcional</p>
      </div>
    </footer>
  );
}
