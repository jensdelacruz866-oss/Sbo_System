import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  FileText, 
  Upload, 
  Plus, 
  Eye,
  Edit,
  Users,
  DollarSign
} from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useExpenses } from '@/hooks/useExpenses';
import { useDocuments } from '@/hooks/useDocuments';

export default function SecretaryDashboard() {
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Secretary Dashboard</h1>
          <p className="text-muted-foreground">Event management, announcements, and documentation</p>
        </div>
        <div className="flex gap-2">
          <Button className="animate-scale-in">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              {events.filter(e => e.is_public).length} public events
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{announcements.length}</div>
            <p className="text-xs text-muted-foreground">
              {announcements.filter(a => a.is_public).length} public announcements
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <Upload className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{documents.length}</div>
            <p className="text-xs text-muted-foreground">Uploaded documents</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Added Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{expenses.length}</div>
            <p className="text-xs text-muted-foreground">Total entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Event Management</CardTitle>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.event_date).toLocaleDateString()} at {event.event_time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={event.is_public ? 'default' : 'secondary'}>
                    {event.is_public ? 'Public' : 'Private'}
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No events created yet. Create your first event!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Announcements Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Announcements</CardTitle>
            <Button size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Create Announcement
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.slice(0, 5).map((announcement) => (
              <div key={announcement.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{announcement.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={announcement.is_public ? 'default' : 'secondary'}>
                      {announcement.is_public ? 'Public' : 'Private'}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {announcement.content.slice(0, 100)}...
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(announcement.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
            {announcements.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No announcements yet. Create your first announcement!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Document Management & Expense Entry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Document Management</CardTitle>
            <Button size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {documents.slice(0, 5).map((document) => (
              <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{document.title}</h4>
                  <p className="text-sm text-muted-foreground">{document.category}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(document.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={document.is_public ? 'default' : 'secondary'}>
                    {document.is_public ? 'Public' : 'Private'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {documents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No documents uploaded yet. Upload your first document!
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Expense Entries</CardTitle>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {expenses.slice(0, 5).map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{expense.title}</h4>
                  <p className="text-sm text-muted-foreground">{expense.category}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(expense.expense_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-destructive">{formatCurrency(Number(expense.amount))}</span>
                  <Badge variant={expense.status === 'approved' ? 'default' : 'secondary'}>
                    {expense.status}
                  </Badge>
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No expenses recorded yet. Add your first expense!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <Calendar className="w-6 h-6" />
              <span>Schedule Event</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <FileText className="w-6 h-6" />
              <span>Post Announcement</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <Upload className="w-6 h-6" />
              <span>Upload Document</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <DollarSign className="w-6 h-6" />
              <span>Record Expense</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}