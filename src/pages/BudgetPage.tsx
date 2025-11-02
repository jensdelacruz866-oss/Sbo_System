import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2, TrendingUp, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { useBudget } from '@/hooks/useBudget';
import { useExpenses } from '@/hooks/useExpenses';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export default function BudgetPage() {
  const { budget, loading, addBudgetAllocation, deleteBudgetAllocation } = useBudget();
  const { expenses } = useExpenses();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    allocated_amount: '',
    fiscal_year: new Date().getFullYear()
  });

  const totalBudget = budget.reduce((sum, item) => sum + Number(item.allocated_amount), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const remainingBudget = totalBudget - totalExpenses;
  const utilizationRate = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  const pieData = budget.map((item, index) => ({
    name: item.category,
    value: Number(item.allocated_amount),
    color: COLORS[index % COLORS.length]
  }));

  const barData = budget.map(item => {
    const spent = expenses
      .filter(exp => exp.category === item.category)
      .reduce((sum, exp) => sum + Number(exp.amount), 0);
    
    return {
      name: item.category,
      allocated: Number(item.allocated_amount),
      spent: spent,
      remaining: Number(item.allocated_amount) - spent
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.allocated_amount) {
      toast.error('Please fill all required fields');
      return;
    }
    await addBudgetAllocation({
      category: formData.category,
      allocated_amount: Number(formData.allocated_amount),
      fiscal_year: formData.fiscal_year
    });
    setFormData({ category: '', allocated_amount: '', fiscal_year: new Date().getFullYear() });
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this budget allocation?')) {
      await deleteBudgetAllocation(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Budget Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage and track budget allocations</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg hover:shadow-xl transition-shadow">
              <Plus className="w-4 h-4 mr-2" />
              Add Budget Allocation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New Budget Allocation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Events, Operations"
                />
              </div>
              <div>
                <Label htmlFor="amount">Allocated Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.allocated_amount}
                  onChange={(e) => setFormData({ ...formData, allocated_amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="year">Fiscal Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.fiscal_year}
                  onChange={(e) => setFormData({ ...formData, fiscal_year: Number(e.target.value) })}
                />
              </div>
              <Button type="submit" className="w-full">Add Allocation</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground mt-1">Fiscal Year {new Date().getFullYear()}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{formatCurrency(totalExpenses)}</div>
            <Progress value={utilizationRate} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{utilizationRate.toFixed(1)}% utilized</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <PieChartIcon className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{formatCurrency(remainingBudget)}</div>
            <p className="text-xs text-muted-foreground mt-1">Available funds</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Budget Distribution</CardTitle>
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
                No budget data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
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
                No budget data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Budget Allocations Table */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Budget Allocations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {budget.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No budget allocations yet</p>
                <p className="text-sm">Click "Add Budget Allocation" to get started</p>
              </div>
            ) : (
              budget.map((item) => {
                const spent = expenses
                  .filter(exp => exp.category === item.category)
                  .reduce((sum, exp) => sum + Number(exp.amount), 0);
                const remaining = Number(item.allocated_amount) - spent;
                const progress = (spent / Number(item.allocated_amount)) * 100;

                return (
                  <div key={item.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{item.category}</h4>
                        <p className="text-sm text-muted-foreground">FY {item.fiscal_year}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Allocated:</span>
                        <span className="font-semibold">{formatCurrency(Number(item.allocated_amount))}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Spent:</span>
                        <span className="font-semibold text-destructive">{formatCurrency(spent)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Remaining:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(remaining)}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{progress.toFixed(1)}% used</span>
                        <Badge variant={progress > 90 ? 'destructive' : progress > 70 ? 'default' : 'secondary'}>
                          {progress > 90 ? 'Critical' : progress > 70 ? 'Warning' : 'Healthy'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
