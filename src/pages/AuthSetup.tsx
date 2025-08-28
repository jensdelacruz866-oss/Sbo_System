import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function AuthSetup() {
  const { isAuthenticated, isLoading, profile } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-sbo-blue-light/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sbo-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-sbo-blue-light/20 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sbo-blue to-sbo-blue-dark rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sbo-blue to-sbo-blue-dark bg-clip-text text-transparent">
            SBO Authentication
          </h1>
          <p className="text-muted-foreground">
            Campus Governor Suite Setup
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Authentication System</span>
              <Badge variant="secondary" className="bg-sbo-success/10 text-sbo-success">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span>Database Connection</span>
              <Badge variant="secondary" className="bg-sbo-success/10 text-sbo-success">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span>User Status</span>
              {isAuthenticated ? (
                <Badge variant="secondary" className="bg-sbo-success/10 text-sbo-success">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Logged In
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-sbo-warning/10 text-sbo-warning">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Not Logged In
                </Badge>
              )}
            </div>

            {isAuthenticated && profile && (
              <div className="pt-4 border-t border-border/50">
                <h4 className="font-semibold mb-2">User Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{profile.full_name || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role:</span>
                    <span>{profile.role || 'No role assigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Student ID:</span>
                    <span>{profile.student_id || 'Not set'}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          {!isAuthenticated ? (
            <Button asChild className="w-full bg-primary hover:bg-primary-hover">
              <a href="/login">Go to Login</a>
            </Button>
          ) : (
            <Button asChild className="w-full bg-primary hover:bg-primary-hover">
              <a href="/dashboard">Go to Dashboard</a>
            </Button>
          )}
          
          <Button asChild variant="outline" className="w-full">
            <a href="/officers">View Officers (Public)</a>
          </Button>
        </div>

        <Card className="bg-sbo-blue-light/20 border-sbo-blue/20">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2 text-sbo-blue">Setup Instructions</h4>
            <ol className="text-sm space-y-1 text-muted-foreground">
              <li>1. Register a new account or login</li>
              <li>2. Contact administrator to assign President role</li>
              <li>3. Access officer management features</li>
              <li>4. Upload photos and manage officer profiles</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}