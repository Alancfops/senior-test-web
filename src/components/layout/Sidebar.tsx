import { NavLink } from 'react-router-dom';
import type { ComponentType, SVGProps } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { IconClose } from '@/components/icons/AuthIcons';
import {
  IconClipboard,
  IconFile,
  IconHelp,
  IconHome,
  IconInbox,
  IconLogout,
  IconPatient,
  IconUsers,
} from '@/components/icons/NavIcons';
import { ROLE_LABELS, type TherapistRole } from '@/types/api';

type NavItem = {
  to: string;
  label: string;
  end?: boolean;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  visible?: (role: TherapistRole | undefined) => boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    title: 'Visão geral',
    items: [{ to: '/dashboard', label: 'Início', end: true, icon: IconHome }],
  },
  {
    title: 'Cadastros',
    items: [
      { to: '/therapists', label: 'Fisioterapeutas', icon: IconUsers },
      { to: '/patients', label: 'Pacientes', icon: IconPatient },
    ],
  },
  {
    title: 'Governança',
    items: [
      {
        to: '/access-requests',
        label: 'Solicitações de acesso',
        end: true,
        icon: IconInbox,
        visible: (role) => role === 'ADMIN' || role === 'SUPER_ADMIN',
      },
      {
        to: '/assistants',
        label: 'Ajudantes',
        end: true,
        icon: IconUsers,
        visible: (role) => role === 'ADMIN' || role === 'SUPER_ADMIN',
      },
      {
        to: '/managers',
        label: 'Professoras',
        end: true,
        icon: IconUsers,
        visible: (role) => role === 'SUPER_ADMIN',
      },
      { to: '/audit-logs', label: 'Auditoria', end: true, icon: IconClipboard },
      { to: '/reports', label: 'Relatórios PDF', end: true, icon: IconFile },
    ],
  },
];

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const initial = (user?.fullName ?? 'A').charAt(0).toUpperCase();

  const sections = navSections.map((section) => ({
    ...section,
    items: section.items.filter((item) => (item.visible ? item.visible(user?.role) : true)),
  }));

  return (
    <>
      <div
        className={[
          'fixed inset-0 z-40 bg-[rgba(15,23,42,0.45)] transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        aria-hidden={!open}
        onClick={onClose}
      />

      <aside
        id="app-sidebar"
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-[min(100%,var(--stf-sidebar-width))] shrink-0 flex-col border-r border-[var(--stf-border)] bg-[var(--stf-surface)] shadow-stf transition-transform duration-200 ease-out',
          'lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        aria-label="Navegação principal"
      >
        <div className="relative border-b border-[var(--stf-border)] px-5 py-5 text-center sm:py-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-stf-sm text-[var(--stf-text-muted)] hover:bg-[var(--stf-page-bg)] hover:text-[var(--stf-text)] lg:hidden"
            aria-label="Fechar menu"
          >
            <IconClose />
          </button>

          <img
            src="/logo-seniortest-wordmark.png"
            alt=""
            width={148}
            height={44}
            className="mx-auto h-9 w-auto lg:hidden"
          />
          <img
            src="/logo-seniortest-mark.png"
            alt=""
            width={147}
            height={174}
            className="mx-auto hidden h-[88px] w-auto lg:block"
          />
          <p className="mt-3 text-sm font-bold text-[var(--stf-text)]">Gerenciador Web</p>
          <p className="text-xs font-medium leading-snug text-[var(--stf-primary)]">
            Sênior Teste Funcional
          </p>
          <p className="mt-2 hidden text-[11px] leading-relaxed text-[var(--stf-text-muted)] sm:block">
            Conta administrativa exclusiva do painel web para supervisão do app mobile.
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-3">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-[var(--stf-text-muted)]">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        [
                          'flex min-h-11 items-center gap-3 rounded-stf-lg px-3 py-2.5 text-sm font-medium transition-all',
                          isActive
                            ? 'bg-[var(--stf-primary)] text-[var(--stf-on-primary)] shadow-stf-md'
                            : 'text-[var(--stf-text)] hover:bg-[var(--stf-page-bg)] hover:text-[var(--stf-primary-dark)]',
                        ].join(' ')
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon
                            className={[
                              'size-5 shrink-0',
                              isActive ? 'text-[var(--stf-on-primary)]' : 'text-[var(--stf-primary)]',
                            ].join(' ')}
                            aria-hidden
                          />
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-[var(--stf-text-muted)]">
              Referência
            </p>
            <NavLink
              to="/testes/duvidas"
              end
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'flex min-h-11 items-center gap-3 rounded-stf-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-[var(--stf-primary)] text-[var(--stf-on-primary)] shadow-stf-md'
                    : 'text-[var(--stf-text)] hover:bg-[var(--stf-page-bg)] hover:text-[var(--stf-primary-dark)]',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <IconHelp
                    className={[
                      'size-5 shrink-0',
                      isActive ? 'text-[var(--stf-on-primary)]' : 'text-[var(--stf-primary)]',
                    ].join(' ')}
                    aria-hidden
                  />
                  <span>Dúvidas sobre testes</span>
                </>
              )}
            </NavLink>
          </div>
        </nav>

        <div className="border-t border-[var(--stf-border)] p-4">
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--stf-page-bg)] text-sm font-bold text-[var(--stf-primary)]"
              aria-hidden
            >
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--stf-text)]">
                {user?.fullName}
              </p>
              <p className="truncate text-xs text-[var(--stf-text-muted)]">{user?.email}</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--stf-primary)]">
                {user?.role ? ROLE_LABELS[user.role] : 'Gerenciador · painel web'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-3 flex min-h-11 w-full items-center gap-2 rounded-stf-lg px-3 py-2 text-sm font-medium text-[var(--stf-error)] transition-colors hover:bg-[color-mix(in_srgb,var(--stf-error)_6%,var(--stf-surface))]"
          >
            <IconLogout className="size-4" aria-hidden />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
