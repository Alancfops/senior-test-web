import { useMediaQuery } from '@/hooks/useMediaQuery';

type ColGroupProps = {
  variant:
    | 'patients-list'
    | 'therapist-patients'
    | 'therapists-list'
    | 'patient-assessments'
    | 'access-requests';
};

/**
 * Larguras alinhadas às colunas *visíveis* no breakpoint.
 * Evita espaço vazio à direita no tablet quando colunas tertiary (data) ainda
 * estavam reservadas no colgroup mas ocultas via CSS.
 */
export function TableColGroup({ variant }: ColGroupProps) {
  const isMd = useMediaQuery('(min-width: 768px)');
  const isXl = useMediaQuery('(min-width: 1280px)');

  if (!isMd) return null;

  switch (variant) {
    case 'patients-list':
      return isXl ? (
        <colgroup>
          <col className="stf-col-name" />
          <col className="stf-col-age" />
          <col className="stf-col-gender" />
          <col className="stf-col-therapist" />
          <col className="stf-col-count" />
          <col className="stf-col-date" />
          <col className="stf-col-actions" />
        </colgroup>
      ) : (
        <colgroup>
          <col style={{ width: '26%' }} />
          <col style={{ width: '9%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '24%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '0' }} />
          <col className="stf-col-actions" />
        </colgroup>
      );
    case 'therapist-patients':
      return isXl ? (
        <colgroup>
          <col className="stf-col-name-wide" />
          <col className="stf-col-age" />
          <col className="stf-col-gender" />
          <col className="stf-col-count" />
          <col className="stf-col-date" />
          <col className="stf-col-actions-wide" />
        </colgroup>
      ) : (
        <colgroup>
          <col style={{ width: '36%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '16%' }} />
          <col style={{ width: '14%' }} />
          <col style={{ width: '0' }} />
          <col className="stf-col-actions-wide" />
        </colgroup>
      );
    case 'therapists-list':
      return isXl ? (
        <colgroup>
          <col className="stf-col-name" />
          <col className="stf-col-email" />
          <col className="stf-col-count" />
          <col className="stf-col-count" />
          <col className="stf-col-date" />
          <col className="stf-col-actions" />
        </colgroup>
      ) : (
        <colgroup>
          <col style={{ width: '28%' }} />
          <col style={{ width: '32%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '0' }} />
          <col className="stf-col-actions" />
        </colgroup>
      );
    case 'patient-assessments':
      return (
        <colgroup>
          <col className="stf-col-instrument" />
          <col className="stf-col-result" />
          <col className="stf-col-classification" />
          <col className="stf-col-date" />
          <col className="stf-col-actions" />
        </colgroup>
      );
    case 'access-requests':
      return (
        <colgroup>
          <col style={{ width: '28%' }} />
          <col style={{ width: '32%' }} />
          <col style={{ width: '18%' }} />
          <col style={{ width: '22%' }} />
        </colgroup>
      );
    default:
      return null;
  }
}
