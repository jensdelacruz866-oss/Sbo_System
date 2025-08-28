import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Mail, Calendar, Users, Shield } from 'lucide-react';
import { useState } from 'react';
import { useOfficers } from '@/hooks/useOfficers';
import { useAuth } from '@/contexts/AuthContext';
import OfficerManagement from '@/components/OfficerManagement';

export default function OfficersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { officers, loading, canManage } = useOfficers();
  const { isAuthenticated } = useAuth();
  
  const filteredOfficers = officers.filter(officer =>
    officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-sbo-blue-light/20">
      <div className="container mx-auto px-4 py-6 lg:py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sbo-blue to-sbo-blue-dark rounded-2xl mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-sbo-blue to-sbo-blue-dark bg-clip-text text-transparent">
            SBO Officers
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet your dedicated student government representatives working to make your campus experience better
          </p>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="officers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="officers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">View Officers</span>
              <span className="sm:hidden">Officers</span>
            </TabsTrigger>
            {canManage && (
              <TabsTrigger value="manage" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Manage Officers</span>
                <span className="sm:hidden">Manage</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="officers" className="space-y-8">
            {/* Search */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search officers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 backdrop-blur-sm border-border/50"
                />
              </div>
            </div>

            {/* Officers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="pt-6">
                      <div className="text-center mb-6">
                        <div className="h-24 w-24 bg-muted rounded-full mx-auto mb-4" />
                        <div className="h-6 bg-muted rounded mb-2" />
                        <div className="h-4 bg-muted rounded w-20 mx-auto" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded" />
                        <div className="h-4 bg-muted rounded w-3/4" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                filteredOfficers.map((officer) => (
                  <Card key={officer.id} className="group hover:shadow-xl hover:shadow-sbo-blue/10 transition-all duration-500 bg-white/80 backdrop-blur-sm border-border/50 hover:border-sbo-blue/30">
                    <CardContent className="pt-6">
                      {/* Profile Section */}
                      <div className="text-center mb-6">
                        <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-sbo-blue-light group-hover:ring-sbo-blue transition-colors duration-300">
                          <AvatarImage src={officer.avatar_url || undefined} alt={officer.name} />
                          <AvatarFallback className="text-lg bg-gradient-to-br from-sbo-blue to-sbo-blue-dark text-white">
                            {officer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-sbo-blue transition-colors">
                          {officer.name}
                        </h3>
                        <Badge variant="secondary" className="mb-4 bg-sbo-blue-light text-sbo-blue hover:bg-sbo-blue hover:text-white transition-colors">
                          {officer.role}
                        </Badge>
                      </div>

                      {/* Bio */}
                      {officer.bio && (
                        <div className="mb-6">
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                            {officer.bio}
                          </p>
                        </div>
                      )}

                      {/* Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={16} className="text-sbo-blue" />
                          <span className="text-muted-foreground break-all">{officer.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={16} className="text-sbo-blue" />
                          <span className="text-muted-foreground">
                            Term: {new Date(officer.term_start).getFullYear()} - {new Date(officer.term_start).getFullYear() + 1}
                          </span>
                        </div>
                      </div>

                      {/* Contact Button */}
                      <Button 
                        variant="outline" 
                        className="w-full hover:bg-sbo-blue hover:text-white border-sbo-blue text-sbo-blue transition-all duration-300"
                        onClick={() => window.location.href = `mailto:${officer.email}`}
                      >
                        <Mail size={16} className="mr-2" />
                        Contact Officer
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* No Results */}
            {!loading && filteredOfficers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-sbo-blue-light rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-sbo-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {searchTerm ? 'No officers found' : 'No officers available'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms' : 'Officer information will be displayed here once added'}
                </p>
              </div>
            )}
          </TabsContent>

          {canManage && (
            <TabsContent value="manage">
              <OfficerManagement />
            </TabsContent>
          )}

        </Tabs>

        {/* Info Section */}
        <Card className="bg-white/60 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-sbo-blue">About SBO Leadership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-sbo-blue to-sbo-blue-dark rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-lg text-sbo-blue">President</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Leads the organization, represents students, and oversees all SBO activities and initiatives to ensure student voices are heard.
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-sbo-success to-green-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-lg text-sbo-success">Auditor</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Manages finances, reviews budgets, and ensures transparent and responsible handling of student organization funds.
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-sbo-warning to-orange-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-lg text-sbo-warning">Secretary</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Records meetings, manages communications, and keeps students informed about all SBO activities and important updates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}