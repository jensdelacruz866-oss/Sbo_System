import { useAuth } from '@/contexts/AuthContext';
import RoleBasedDashboard from '@/components/RoleBasedDashboard';

export default function DashboardPage() {
  return <RoleBasedDashboard />;
}