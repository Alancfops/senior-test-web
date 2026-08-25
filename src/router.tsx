import { createBrowserRouter, Navigate } from 'react-router-dom';
import { GuestRoute, ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AssessmentDetailPage } from '@/pages/AssessmentDetailPage';
import { AuditLogsPage } from '@/pages/AuditLogsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ForgotPasswordSentPage } from '@/pages/ForgotPasswordSentPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PatientProfilePage } from '@/pages/PatientProfilePage';
import { PatientsListPage } from '@/pages/PatientsListPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { TherapistDetailPage } from '@/pages/TherapistDetailPage';
import { TherapistsListPage } from '@/pages/TherapistsListPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/forgot-password/sent', element: <ForgotPasswordSentPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/therapists', element: <TherapistsListPage /> },
      { path: '/therapists/:id', element: <TherapistDetailPage /> },
      { path: '/patients', element: <PatientsListPage /> },
      { path: '/patients/:id', element: <PatientProfilePage /> },
      { path: '/patients/:id/assessment/:assessmentId', element: <AssessmentDetailPage /> },
      { path: '/audit-logs', element: <AuditLogsPage /> },
      { path: '/reports', element: <ReportsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
