import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  FileText, 
  Upload, 
  Plus, 
  Eye,
  PhilippinePeso,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useExpenses } from '@/hooks/useExpenses';
import { useDocuments } from '@/hooks/useDocuments';
import { useNavigate } from 'react-router-dom';

export default function SecretaryDashboard() {
  const navigate = useNavigate();
  const { events, loading: eventsLoading } = useEvents();
  const { announcements, loading: announcementsLoading } = useAnnouncements();
  const { expenses, loading: expensesLoading } = useExpenses();
  const { documents, loading: documentsLoading } = useDocuments();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (eventsLoading || announcementsLoading || expensesLoading || documentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Secretary Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Manage events, announcements, documents, and expenses</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate('/events')}
            className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/announcements')}
            className="shadow-md hover:shadow-lg transition-all"
          >
            <FileText className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg hover:scale-105 transition-all cursor-pointer" onClick={() => navigate('/events')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-1">{events.length}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {events.filter(e => e.is_public).length} public events
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:shadow-lg hover:scale-105 transition-all cursor-pointer" onClick={() => navigate('/announcements')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Announcements</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{announcements.length}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {announcements.filter(a => a.is_public).length} public posts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 hover:shadow-lg hover:scale-105 transition-all cursor-pointer" onClick={() => navigate('/documents')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Documents</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Upload className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">{documents.length}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Uploaded files
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20 hover:shadow-lg hover:scale-105 transition-all cursor-pointer" onClick={() => navigate('/expenses')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Added Expenses</CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <PhilippinePeso className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-1">{expenses.length}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Total entries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <CardTitle>Recent Events</CardTitle>
            </div>
            <Button size="sm" variant="ghost" onClick={() => navigate('/events')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{event.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">{event.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(event.event_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <Badge variant={event.is_public ? 'default' : 'secondary'} className="ml-2">
                    {event.is_public ? 'Public' : 'Private'}
                  </Badge>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No events yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <CardTitle>Recent Announcements</CardTitle>
            </div>
            <Button size="sm" variant="ghost" onClick={() => navigate('/announcements')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.slice(0, 3).map((announcement) => (
              <div key={announcement.id} className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground flex-1">{announcement.title}</h4>
                  <Badge variant={announcement.is_public ? 'default' : 'secondary'} className="ml-2">
                    {announcement.is_public ? 'Public' : 'Private'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                  {announcement.content}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(announcement.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            ))}
            {announcements.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No announcements yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documents */}
        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-green-600" />
              <CardTitle>Recent Documents</CardTitle>
            </div>
            <Button size="sm" variant="ghost" onClick={() => navigate('/documents')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {documents.slice(0, 3).map((document) => (
              <div key={document.id} className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{document.title}</h4>
                    <p className="text-sm text-muted-foreground">{document.category}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(document.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <Badge variant={document.is_public ? 'default' : 'secondary'} className="ml-2">
                    {document.is_public ? 'Public' : 'Private'}
                  </Badge>
                </div>
              </div>
            ))}
            {documents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No documents yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card className="border-l-4 border-l-orange-600">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <PhilippinePeso className="w-5 h-5 text-orange-600" />
              <CardTitle>Recent Expenses</CardTitle>
            </div>
            <Button size="sm" variant="ghost" onClick={() => navigate('/expenses')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {expenses.slice(0, 3).map((expense) => (
              <div key={expense.id} className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{expense.title}</h4>
                    <p className="text-sm text-muted-foreground">{expense.category}</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-bold text-orange-600">{formatCurrency(Number(expense.amount))}</p>
                    <Badge variant={expense.status === 'approved' ? 'default' : 'secondary'} className="mt-1">
                      {expense.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(expense.expense_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            ))}
            {expenses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <PhilippinePeso className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No expenses yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => navigate('/events')}
              className="h-24 flex-col gap-3 bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 shadow-md hover:shadow-lg transition-all"
              variant="outline"
            >
              <Calendar className="w-7 h-7" />
              <span className="font-semibold">Schedule Event</span>
            </Button>
            <Button 
              onClick={() => navigate('/announcements')}
              className="h-24 flex-col gap-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border-blue-500/30 shadow-md hover:shadow-lg transition-all"
              variant="outline"
            >
              <FileText className="w-7 h-7" />
              <span className="font-semibold">Post Announcement</span>
            </Button>
            <Button 
              onClick={() => navigate('/documents')}
              className="h-24 flex-col gap-3 bg-green-500/10 hover:bg-green-500/20 text-green-600 border-green-500/30 shadow-md hover:shadow-lg transition-all"
              variant="outline"
            >
              <Upload className="w-7 h-7" />
              <span className="font-semibold">Upload Document</span>
            </Button>
            <Button 
              onClick={() => navigate('/expenses')}
              className="h-24 flex-col gap-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 border-orange-500/30 shadow-md hover:shadow-lg transition-all"
              variant="outline"
            >
              <PhilippinePeso className="w-7 h-7" />
              <span className="font-semibold">Record Expense</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}