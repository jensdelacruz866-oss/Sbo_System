import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  FileText,
  Users,
  ArrowRight,
  PieChart as PieChartIcon,
  Receipt
} from 'lucide-react';
import { useBudget } from '@/hooks/useBudget';
import { useExpenses } from '@/hooks/useExpenses';
import { useEvents } from '@/hooks/useEvents';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useOfficers } from '@/hooks/useOfficers';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export default function PresidentDashboard() {
  const navigate = useNavigate();
  const { budget, loading: budgetLoading } = useBudget();
  const { expenses, loading: expensesLoading } = useExpenses();
  const { events, loading: eventsLoading } = useEvents();
  const { announcements, loading: announcementsLoading } = useAnnouncements();
  const { officers, loading: officersLoading } = useOfficers();

  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const totalBudget = budget.reduce((sum, category) => sum + Number(category.allocated_amount), 0);
  const remainingBudget = totalBudget - totalExpenses;
  const budgetUtilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  // Data for charts
  const pieData = budget.map((category, index) => ({
    name: category.category,
    value: Number(category.allocated_amount),
    color: COLORS[index % COLORS.length]
  }));

  const barData = budget.map(category => {
    const spent = expenses
      .filter(exp => exp.category === category.category)
      .reduce((sum, exp) => sum + Number(exp.amount), 0);
    
    return {
      name: category.category,
      allocated: Number(category.allocated_amount),
      spent: spent,
      remaining: Number(category.allocated_amount) - spent
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  if (budgetLoading || expensesLoading || eventsLoading || announcementsLoading || officersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          President Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">Complete overview and control of SBO operations</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary hover:shadow-xl transition-all cursor-pointer" onClick={() => navigate('/budget')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-1">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">FY {new Date().getFullYear()}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive hover:shadow-xl transition-all cursor-pointer" onClick={() => navigate('/expenses')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Receipt className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive mb-1">{formatCurrency(totalExpenses)}</div>
            <Progress value={budgetUtilization} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{budgetUtilization.toFixed(1)}% utilized</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingDown className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500 mb-1">{formatCurrency(remainingBudget)}</div>
            <p className="text-xs text-muted-foreground">Available funds</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all cursor-pointer" onClick={() => navigate('/officers')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Officers</CardTitle>
            <Users className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500 mb-1">{officers.length}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Budget Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <PieChartIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No budget data</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle>Budget vs Spending</CardTitle>
          </CardHeader>
          <CardContent>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="allocated" fill="#6366f1" name="Allocated" />
                  <Bar dataKey="spent" fill="#10b981" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No budget data</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-xl transition-all cursor-pointer group" onClick={() => navigate('/budget')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-10 h-10 text-primary" />
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Budget</h3>
            <p className="text-sm text-muted-foreground">Manage allocations</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all cursor-pointer group" onClick={() => navigate('/expenses')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Receipt className="w-10 h-10 text-destructive" />
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Expenses</h3>
            <p className="text-sm text-muted-foreground">Track spending</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all cursor-pointer group" onClick={() => navigate('/events')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-10 h-10 text-blue-500" />
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Events</h3>
            <p className="text-sm text-muted-foreground">Manage calendar</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all cursor-pointer group" onClick={() => navigate('/announcements')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-10 h-10 text-green-500" />
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-green-500 transition-colors" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Announcements</h3>
            <p className="text-sm text-muted-foreground">Post updates</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Expenses</CardTitle>
            <Button size="sm" variant="outline" onClick={() => navigate('/expenses')}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {expenses.slice(0, 5).map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium">{expense.title}</h4>
                  <p className="text-sm text-muted-foreground">{expense.category} • {new Date(expense.expense_date).toLocaleDateString()}</p>
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
                <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No expenses yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Events</CardTitle>
            <Button size="sm" variant="outline" onClick={() => navigate('/events')}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.event_date).toLocaleDateString()} • {event.location}
                  </p>
                </div>
                <Badge variant={event.is_public ? 'default' : 'secondary'}>
                  {event.is_public ? 'Public' : 'Private'}
                </Badge>
              </div>
            ))}
            {events.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No events scheduled</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card className="hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Announcements</CardTitle>
          <Button size="sm" variant="outline" onClick={() => navigate('/announcements')}>
            View All
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {announcements.slice(0, 3).map((announcement) => (
            <div key={announcement.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{announcement.title}</h4>
                <Badge variant={announcement.is_public ? 'default' : 'secondary'}>
                  {announcement.is_public ? 'Public' : 'Private'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{announcement.content}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(announcement.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
          {announcements.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No announcements yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}