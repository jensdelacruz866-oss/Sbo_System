import { useAuth } from '@/contexts/AuthContext';
import PresidentDashboard from './dashboards/PresidentDashboard';
import SecretaryDashboard from './dashboards/SecretaryDashboard';
import AuditorDashboard from './dashboards/AuditorDashboard';

export default function RoleBasedDashboard() {
  const { profile } = useAuth();

  if (!profile?.role) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Pending</h2>
          <p className="text-muted-foreground">Your role is being assigned. Please contact an administrator.</p>
        </div>
      </div>
    );
  }

  switch (profile.role) {
    case 'President':
      return <PresidentDashboard />;
    case 'Secretary':
      return <SecretaryDashboard />;
    case 'Auditor':
      return <AuditorDashboard />;
    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Invalid Role</h2>
            <p className="text-muted-foreground">Your role is not recognized. Please contact an administrator.</p>
          </div>
        </div>
      );
  }
}