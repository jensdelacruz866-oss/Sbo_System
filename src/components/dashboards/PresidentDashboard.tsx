import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  FileText,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useBudget } from '@/hooks/useBudget';
import { useExpenses } from '@/hooks/useExpenses';
import { useEvents } from '@/hooks/useEvents';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useOfficers } from '@/hooks/useOfficers';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function PresidentDashboard() {
  const { budget, loading: budgetLoading, addBudgetAllocation, deleteBudgetAllocation } = useBudget();
  const { expenses, loading: expensesLoading, deleteExpense } = useExpenses();
  const { events, loading: eventsLoading } = useEvents();
  const { announcements, loading: announcementsLoading } = useAnnouncements();
  const { officers, loading: officersLoading } = useOfficers();

  const [budgetForm, setBudgetForm] = useState({
    category: '',
    allocated_amount: '',
    fiscal_year: new Date().getFullYear()
  });
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);

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
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleAddBudget = async () => {
    if (!budgetForm.category || !budgetForm.allocated_amount) {
      toast.error('Please fill all required fields');
      return;
    }

    await addBudgetAllocation({
      category: budgetForm.category,
      allocated_amount: Number(budgetForm.allocated_amount),
      fiscal_year: budgetForm.fiscal_year
    });

    setBudgetForm({
      category: '',
      allocated_amount: '',
      fiscal_year: new Date().getFullYear()
    });
    setShowBudgetDialog(false);
  };

  const handleDeleteBudget = async (id: string) => {
    if (confirm('Are you sure you want to delete this budget allocation?')) {
      await deleteBudgetAllocation(id);
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">President Dashboard</h1>
          <p className="text-muted-foreground">Complete oversight and control of SBO operations</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
            <DialogTrigger asChild>
              <Button className="animate-scale-in">
                <Plus className="w-4 h-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Budget Allocation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={budgetForm.category}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Events, Office Supplies"
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount (PHP)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={budgetForm.allocated_amount}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, allocated_amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="fiscal_year">Fiscal Year</Label>
                  <Input
                    id="fiscal_year"
                    type="number"
                    value={budgetForm.fiscal_year}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, fiscal_year: Number(e.target.value) }))}
                  />
                </div>
                <Button onClick={handleAddBudget} className="w-full">
                  Add Budget Allocation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">Current fiscal year</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</div>
            <div className="mt-2">
              <Progress value={budgetUtilization} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {budgetUtilization.toFixed(1)}% of budget used
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(remainingBudget)}</div>
            <p className="text-xs text-muted-foreground">Available for allocation</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Officers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{officers.length}</div>
            <p className="text-xs text-muted-foreground">Active officers</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Budget Allocations</CardTitle>
          <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {budget.length > 0 ? (
            budget.map((allocation) => (
              <div key={allocation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{allocation.category}</h4>
                  <p className="text-sm text-muted-foreground">
                    Fiscal Year {allocation.fiscal_year}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-primary">
                    {formatCurrency(Number(allocation.allocated_amount))}
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteBudget(allocation.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No budget allocations yet. Add your first budget category!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts Section */}
      {budget.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget vs Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="allocated" fill="#8884d8" name="Allocated" />
                  <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Expenses</CardTitle>
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
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No expenses recorded yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Officers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {officers.length > 0 ? (
              officers.slice(0, 5).map((officer) => (
                <div key={officer.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{officer.name}</h4>
                    <p className="text-sm text-muted-foreground">{officer.role}</p>
                    <p className="text-sm text-muted-foreground">{officer.email}</p>
                  </div>
                  <Badge variant="outline">
                    Active
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No officers added yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}