const CURRENT_YEAR = new Date().getFullYear();

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--stf-border)] bg-[var(--stf-surface)] px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-[1040px] flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <img
          src="/logo-cesmac-citec.png"
          alt="Desenvolvido por CESMAC CITEC"
          width={110}
          height={100}
          className="h-10 w-auto sm:h-11"
        />
        <p className="text-center text-xs leading-relaxed text-[var(--stf-text)] sm:text-left sm:text-sm">
          © {CURRENT_YEAR} Sênior Teste Funcional. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
