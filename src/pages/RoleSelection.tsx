import { useState } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { School, UserCheck, Users, Eye, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const roles: { value: UserRole; label: string; description: string; icon: React.ReactNode; permissions: string[] }[] = [
  {
    value: 'President',
    label: 'President',
    description: 'Full administrative access to all SBO functions',
    icon: <UserCheck className="h-8 w-8" />,
    permissions: [
      'Manage budget allocations',
      'Full expense control (add/edit/delete)',
      'Manage officers and roles',
      'Create/edit events and announcements',
      'Access all reports and audit logs',
      'Upload and manage documents'
    ]
  },
  {
    value: 'Secretary',
    label: 'Secretary',
    description: 'Event management and documentation responsibilities',
    icon: <Users className="h-8 w-8" />,
    permissions: [
      'Add expenses (limited editing)',
      'Create and manage events',
      'Create announcements',
      'Upload and manage documents',
      'View budget and expense reports'
    ]
  },
  {
    value: 'Auditor',
    label: 'Auditor',
    description: 'Financial oversight and audit responsibilities',
    icon: <Eye className="h-8 w-8" />,
    permissions: [
      'Read-only access to all expenses',
      'View budget allocations',
      'Access audit logs and reports',
      'View documents and reports',
      'Financial compliance monitoring'
    ]
  }
];

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, assignRole, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const handleRoleAssignment = async () => {
    if (!selectedRole || !user) return;

    setIsLoading(true);
    try {
      // Use the assignRole function from AuthContext
      const { error: roleError } = await assignRole(selectedRole);

      if (roleError) {
        console.error('Error assigning role:', roleError);
        toast({
          title: "Error",
          description: "Failed to assign role. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Wait a bit for the profile to be refreshed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refresh profile to ensure role is loaded
      await refreshProfile();

      toast({
        title: "Role Assigned",
        description: `Successfully assigned ${selectedRole} role`,
      });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sbo-blue-light to-background p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <School className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Select Your Role</h1>
          <p className="text-muted-foreground mt-2">Choose your position in the Student Body Organization</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card 
              key={role.value}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedRole === role.value 
                  ? 'ring-2 ring-primary border-primary bg-primary/5' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedRole(role.value)}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2 text-primary">
                  {role.icon}
                </div>
                <CardTitle className="text-xl">{role.label}</CardTitle>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm font-medium text-foreground">Permissions:</div>
                  <div className="space-y-2">
                    {role.permissions.map((permission, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Role Display */}
        {selectedRole && (
          <div className="text-center">
            <Badge variant="outline" className="px-4 py-2 text-base">
              Selected: {selectedRole}
            </Badge>
          </div>
        )}

        {/* Action Button */}
        <div className="text-center">
          <Button 
            onClick={handleRoleAssignment}
            disabled={!selectedRole || isLoading}
            size="lg"
            className="px-8"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Assigning Role...' : 'Confirm Selection'}
          </Button>
        </div>

        {/* Note */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Your role determines your access level within the SBO Dashboard.</p>
          <p>Contact an administrator if you need to change your role later.</p>
        </div>
      </div>
    </div>
  );
}