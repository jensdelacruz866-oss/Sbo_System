import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  AlertTriangle,
  Download,
  Filter,
  Calendar,
  BarChart
} from 'lucide-react';
import { useBudget } from '@/hooks/useBudget';
import { useExpenses } from '@/hooks/useExpenses';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AuditorDashboard() {
  const { budget, loading: budgetLoading } = useBudget();
  const { expenses, loading: expensesLoading } = useExpenses();
  const { auditLogs, loading: auditLoading } = useAuditLogs();

  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const totalBudget = budget.reduce((sum, category) => sum + Number(category.allocated_amount), 0);
  const remainingBudget = totalBudget - totalExpenses;
  const budgetUtilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  // Calculate variance and risk analysis
  const categoryVariances = budget.map(category => {
    const spent = expenses
      .filter(exp => exp.category === category.category)
      .reduce((sum, exp) => sum + Number(exp.amount), 0);
    
    const variance = Number(category.allocated_amount) - spent;
    const utilizationRate = Number(category.allocated_amount) > 0 
      ? (spent / Number(category.allocated_amount)) * 100 
      : 0;
    
    return {
      name: category.category,
      allocated: Number(category.allocated_amount),
      spent: spent,
      variance: variance,
      utilizationRate: utilizationRate,
      riskLevel: utilizationRate > 90 ? 'high' : utilizationRate > 70 ? 'medium' : 'low'
    };
  });

  // Expense trends by month
  const expensesByMonth = expenses.reduce((acc, expense) => {
    const month = new Date(expense.expense_date).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += Number(expense.amount);
    return acc;
  }, {} as Record<string, number>);

  const trendData = Object.entries(expensesByMonth).map(([month, amount]) => ({
    month,
    amount
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  if (budgetLoading || expensesLoading || auditLoading) {
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
          <h1 className="text-3xl font-bold text-foreground">Auditor Dashboard</h1>
          <p className="text-muted-foreground">Financial oversight, compliance monitoring, and audit trails</p>
        </div>
        <div className="flex gap-2">
          <Button className="animate-scale-in">
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter Data
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">Allocated for fiscal year</p>
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
              {budgetUtilization.toFixed(1)}% utilized
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variance</CardTitle>
            <BarChart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(remainingBudget)}</div>
            <p className="text-xs text-muted-foreground">
              {remainingBudget >= 0 ? 'Under budget' : 'Over budget'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {categoryVariances.filter(c => c.riskLevel === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">High-risk categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget Utilization by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={categoryVariances}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="allocated" fill="#8884d8" name="Allocated" />
                <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Analysis by Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categoryVariances.map((category) => (
            <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{category.name}</h4>
                  <Badge variant={getRiskBadgeColor(category.riskLevel)}>
                    {category.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>Allocated: {formatCurrency(category.allocated)}</span>
                  <span>Spent: {formatCurrency(category.spent)}</span>
                  <span>Remaining: {formatCurrency(category.variance)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Progress value={category.utilizationRate} className="flex-1 mr-4" />
                  <span className="text-sm font-medium">
                    {category.utilizationRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Transactions & Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Trail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{log.action}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Table: {log.table_name}
                </p>
                {log.record_id && (
                  <p className="text-xs text-muted-foreground">
                    Record ID: {log.record_id}
                  </p>
                )}
              </div>
            ))}
            {auditLogs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No audit logs available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Compliance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="text-lg font-semibold text-green-600">Compliant</h3>
              <p className="text-2xl font-bold">{categoryVariances.filter(c => c.riskLevel === 'low').length}</p>
              <p className="text-sm text-muted-foreground">Categories within budget</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="text-lg font-semibold text-orange-600">Monitor</h3>
              <p className="text-2xl font-bold">{categoryVariances.filter(c => c.riskLevel === 'medium').length}</p>
              <p className="text-sm text-muted-foreground">Categories to watch</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="text-lg font-semibold text-red-600">Action Required</h3>
              <p className="text-2xl font-bold">{categoryVariances.filter(c => c.riskLevel === 'high').length}</p>
              <p className="text-sm text-muted-foreground">Categories over 90% budget</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}