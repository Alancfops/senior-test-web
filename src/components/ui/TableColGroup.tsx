import { useMediaQuery } from '@/hooks/useMediaQuery';

type ColGroupProps = {
  variant:
    | 'patients-list'
    | 'therapist-patients'
    | 'therapists-list'
    | 'patient-assessments';
};

export function TableColGroup({ variant }: ColGroupProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (!isDesktop) return null;

  switch (variant) {
    case 'patients-list':
      return (
        <colgroup>
          <col className="stf-col-name" />
          <col className="stf-col-age" />
          <col className="stf-col-gender" />
          <col className="stf-col-therapist" />
          <col className="stf-col-count" />
          <col className="stf-col-date" />
          <col className="stf-col-actions" />
        </colgroup>
      );
    case 'therapist-patients':
      return (
        <colgroup>
          <col className="stf-col-name-wide" />
          <col className="stf-col-age" />
          <col className="stf-col-gender" />
          <col className="stf-col-count" />
          <col className="stf-col-date" />
          <col className="stf-col-actions-wide" />
        </colgroup>
      );
    case 'therapists-list':
      return (
        <colgroup>
          <col className="stf-col-name" />
          <col className="stf-col-email" />
          <col className="stf-col-count" />
          <col className="stf-col-count" />
          <col className="stf-col-date" />
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
    default:
      return null;
  }
}
