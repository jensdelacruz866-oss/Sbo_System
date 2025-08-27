import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Mail, Calendar } from 'lucide-react';
import { useState } from 'react';
import { sampleOfficers } from '@/data/sampleData';

export default function OfficersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredOfficers = sampleOfficers.filter(officer =>
    officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">SBO Officers</h1>
          <p className="text-muted-foreground mt-1">
            Meet your dedicated student government representatives
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search officers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOfficers.map((officer) => (
          <Card key={officer.id} className="hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-6">
              {/* Profile Section */}
              <div className="text-center mb-6">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={officer.avatar} alt={officer.name} />
                  <AvatarFallback className="text-lg bg-primary/10">
                    {officer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl font-semibold mb-2">{officer.name}</h3>
                <Badge variant="secondary" className="mb-4">
                  {officer.role}
                </Badge>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {officer.bio}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{officer.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Term: {new Date(officer.termStart).getFullYear()} - {new Date(officer.termStart).getFullYear() + 1}
                  </span>
                </div>
              </div>

              {/* Contact Button */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = `mailto:${officer.email}`}
              >
                <Mail size={16} className="mr-2" />
                Contact Officer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredOfficers.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No officers found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms</p>
        </div>
      )}

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>About SBO Leadership</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">President</h4>
              <p className="text-sm text-muted-foreground">
                Leads the organization, represents students, and oversees all SBO activities and initiatives.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Auditor</h4>
              <p className="text-sm text-muted-foreground">
                Manages finances, reviews budgets, and ensures transparent handling of student funds.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Secretary</h4>
              <p className="text-sm text-muted-foreground">
                Records meetings, manages communications, and keeps students informed about SBO activities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}