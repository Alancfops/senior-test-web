import { createBrowserRouter, Navigate } from 'react-router-dom';
import { GuestRoute, ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AccessRequestsPage } from '@/pages/AccessRequestsPage';
import { AssessmentDetailPage } from '@/pages/AssessmentDetailPage';
import { AssistantsPage } from '@/pages/AssistantsPage';
import { AuditLogsPage } from '@/pages/AuditLogsPage';
import { ChangePasswordPage } from '@/pages/ChangePasswordPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ForgotPasswordResetPage } from '@/pages/ForgotPasswordResetPage';
import { ForgotPasswordSentPage } from '@/pages/ForgotPasswordSentPage';
import { ForgotPasswordVerifyPage } from '@/pages/ForgotPasswordVerifyPage';
import { LoginPage } from '@/pages/LoginPage';
import { ManagersPage } from '@/pages/ManagersPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PatientProfilePage } from '@/pages/PatientProfilePage';
import { PatientsListPage } from '@/pages/PatientsListPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { TestDoubtsPage } from '@/pages/TestDoubtsPage';
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
      { path: '/forgot-password/verify', element: <ForgotPasswordVerifyPage /> },
      { path: '/forgot-password/reset', element: <ForgotPasswordResetPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/change-password', element: <ChangePasswordPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/therapists', element: <TherapistsListPage /> },
      { path: '/therapists/:id', element: <TherapistDetailPage /> },
      { path: '/patients', element: <PatientsListPage /> },
      { path: '/patients/:id', element: <PatientProfilePage /> },
      { path: '/patients/:id/assessment/:assessmentId', element: <AssessmentDetailPage /> },
      { path: '/access-requests', element: <AccessRequestsPage /> },
      { path: '/assistants', element: <AssistantsPage /> },
      { path: '/managers', element: <ManagersPage /> },
      { path: '/audit-logs', element: <AuditLogsPage /> },
      { path: '/reports', element: <ReportsPage /> },
      { path: '/testes/duvidas', element: <TestDoubtsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
