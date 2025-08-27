import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps } from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  FileText,
  Plus,
  Users,
  AlertCircle
} from 'lucide-react';
import { sampleBudget, sampleExpenses, sampleAnnouncements, sampleEvents } from '@/data/sampleData';

const COLORS = ['hsl(220 70% 25%)', 'hsl(142 76% 36%)', 'hsl(38 92% 50%)', 'hsl(220 60% 90%)', 'hsl(0 84% 55%)', 'hsl(220 70% 40%)'];

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [budget] = useState(sampleBudget);
  const [recentExpenses] = useState(sampleExpenses.slice(0, 5));
  const [upcomingEvents] = useState(sampleEvents.slice(0, 3));
  const [announcements] = useState(sampleAnnouncements.slice(0, 3));

  const budgetPercentage = (budget.totalExpenses / budget.totalBudget) * 100;
  
  const categoryData = budget.categories.map(cat => ({
    name: cat.name,
    spent: cat.spent,
    allocated: cat.allocated,
    remaining: cat.allocated - cat.spent
  }));

  const pieData = budget.categories.map(cat => ({
    name: cat.name,
    value: cat.spent
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {profile?.full_name || user?.email}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your SBO dashboard overview for today
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Add Expense
        </Button>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budget.totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              For current academic year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budget.totalExpenses.toLocaleString()}</div>
            <Progress value={budgetPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {budgetPercentage.toFixed(1)}% of total budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sbo-success">
              ${budget.remainingBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Available for spending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Spending Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`$${value}`, 'Spent']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget vs Spent Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation vs Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`$${value}`, '']} />
                <Bar dataKey="allocated" fill="hsl(220 60% 90%)" name="Allocated" />
                <Bar dataKey="spent" fill="hsl(220 70% 25%)" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Expenses</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{expense.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.category} • {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${expense.amount}</p>
                    <Badge 
                      variant={expense.status === 'approved' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {expense.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Events</CardTitle>
            <Button variant="outline" size="sm">
              <Calendar size={16} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>
                    <p className="text-xs text-muted-foreground">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
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
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Plus size={20} />
              Add Expense
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText size={20} />
              New Announcement
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar size={20} />
              Schedule Event
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users size={20} />
              Manage Officers
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}