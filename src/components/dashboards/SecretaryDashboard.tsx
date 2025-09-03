import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  FileText, 
  Upload, 
  Plus, 
  Eye,
  Edit,
  Users,
  PhilippinePeso,
} from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useExpenses } from '@/hooks/useExpenses';
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from 'sonner';

export default function SecretaryDashboard() {
  const { events, loading: eventsLoading, addEvent } = useEvents();
  const { announcements, loading: announcementsLoading, addAnnouncement } = useAnnouncements();
  const { expenses, loading: expensesLoading, addExpense } = useExpenses();
  const { documents, loading: documentsLoading } = useDocuments();

  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    expense_date: new Date().toISOString().split('T')[0]
  });

  const [showEventDialog, setShowEventDialog] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    location: '',
    event_date: '',
    event_time: '',
    is_public: true
  });

  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    is_public: true
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleAddExpense = async () => {
    if (!expenseForm.title || !expenseForm.amount || !expenseForm.category) {
      toast.error('Please fill all required fields');
      return;
    }

    await addExpense({
      title: expenseForm.title,
      amount: Number(expenseForm.amount),
      category: expenseForm.category,
      description: expenseForm.description || null,
      expense_date: expenseForm.expense_date,
      status: 'pending'
    });

    setExpenseForm({
      title: '',
      amount: '',
      category: '',
      description: '',
      expense_date: new Date().toISOString().split('T')[0]
    });
    setShowExpenseDialog(false);
  };

  const handleAddEvent = async () => {
    if (!eventForm.title || !eventForm.event_date) {
      toast.error('Please fill all required fields');
      return;
    }

    await addEvent({
      title: eventForm.title,
      description: eventForm.description || null,
      location: eventForm.location || null,
      event_date: eventForm.event_date,
      event_time: eventForm.event_time || null,
      is_public: eventForm.is_public
    });

    setEventForm({
      title: '',
      description: '',
      location: '',
      event_date: '',
      event_time: '',
      is_public: true
    });
    setShowEventDialog(false);
  };

  const handleAddAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.content) {
      toast.error('Please fill all required fields');
      return;
    }

    await addAnnouncement({
      title: announcementForm.title,
      content: announcementForm.content,
      is_public: announcementForm.is_public
    });

    setAnnouncementForm({
      title: '',
      content: '',
      is_public: true
    });
    setShowAnnouncementDialog(false);
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
          <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
            <DialogTrigger asChild>
              <Button className="animate-scale-in">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="event-title">Title</Label>
                  <Input
                    id="event-title"
                    value={eventForm.title}
                    onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Event title"
                  />
                </div>
                <div>
                  <Label htmlFor="event-desc">Description</Label>
                  <Textarea
                    id="event-desc"
                    value={eventForm.description}
                    onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Event description"
                  />
                </div>
                <div>
                  <Label htmlFor="event-location">Location</Label>
                  <Input
                    id="event-location"
                    value={eventForm.location}
                    onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Event location"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event-date">Date</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={eventForm.event_date}
                      onChange={(e) => setEventForm(prev => ({ ...prev, event_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-time">Time</Label>
                    <Input
                      id="event-time"
                      type="time"
                      value={eventForm.event_time}
                      onChange={(e) => setEventForm(prev => ({ ...prev, event_time: e.target.value }))}
                    />
                  </div>
                </div>
                <Button onClick={handleAddEvent} className="w-full">
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="announcement-title">Title</Label>
                  <Input
                    id="announcement-title"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Announcement title"
                  />
                </div>
                <div>
                  <Label htmlFor="announcement-content">Content</Label>
                  <Textarea
                    id="announcement-content"
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Announcement content"
                    rows={4}
                  />
                </div>
                <Button onClick={handleAddAnnouncement} className="w-full">
                  Create Announcement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
            <PhilippinePeso className="h-4 w-4 text-orange-600" />
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
            <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.length > 0 ? (
              events.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.event_date).toLocaleDateString()} {event.event_time && `at ${event.event_time}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={event.is_public ? 'default' : 'secondary'}>
                      {event.is_public ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
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
            <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Announcement
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.length > 0 ? (
              announcements.slice(0, 5).map((announcement) => (
                <div key={announcement.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{announcement.title}</h4>
                    <Badge variant={announcement.is_public ? 'default' : 'secondary'}>
                      {announcement.is_public ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {announcement.content.slice(0, 100)}{announcement.content.length > 100 ? '...' : ''}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No announcements yet. Create your first announcement!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Expense Entry */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Expense Entries</CardTitle>
          <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="expense-title">Title</Label>
                  <Input
                    id="expense-title"
                    value={expenseForm.title}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Expense title"
                  />
                </div>
                <div>
                  <Label htmlFor="expense-amount">Amount (PHP)</Label>
                  <Input
                    id="expense-amount"
                    type="number"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="expense-category">Category</Label>
                  <Input
                    id="expense-category"
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Events, Office Supplies"
                  />
                </div>
                <div>
                  <Label htmlFor="expense-desc">Description</Label>
                  <Textarea
                    id="expense-desc"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Expense description (optional)"
                  />
                </div>
                <div>
                  <Label htmlFor="expense-date">Date</Label>
                  <Input
                    id="expense-date"
                    type="date"
                    value={expenseForm.expense_date}
                    onChange={(e) => setExpenseForm(prev => ({ ...prev, expense_date: e.target.value }))}
                  />
                </div>
                <Button onClick={handleAddExpense} className="w-full">
                  Add Expense
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {expenses.length > 0 ? (
            expenses.slice(0, 5).map((expense) => (
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
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No expenses recorded yet. Add your first expense!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}