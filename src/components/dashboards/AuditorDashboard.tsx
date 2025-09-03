import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  FileText, 
  AlertTriangle,
  Download,
  Filter,
  Calendar,
  BarChart,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search
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
  const [timeRange, setTimeRange] = useState<string>('month');
  
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
  
  // Pending expenses for auditor review
  const pendingExpenses = expenses.filter(expense => expense.status === 'pending');
  
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
  
  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <CheckCircle className="h-4 w-4 text-green-600" />;
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Auditor Dashboard</h1>
          <p className="text-muted-foreground">Financial oversight, compliance monitoring, and audit trails</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="animate-scale-in">
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter Data
          </Button>
          <Button variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Audit Search
          </Button>
        </div>
      </div>
      
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-scale border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">Allocated for fiscal year</p>
          </CardContent>
        </Card>
        
        <Card className="hover-scale border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <div className="mt-2">
              <Progress value={budgetUtilization} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {budgetUtilization.toFixed(1)}% utilized
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover-scale border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variance</CardTitle>
            {remainingBudget >= 0 ? (
              <TrendingDown className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(Math.abs(remainingBudget))}
            </div>
            <p className="text-xs text-muted-foreground">
              {remainingBudget >= 0 ? 'Under budget' : 'Over budget'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover-scale border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingExpenses.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
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
          
          {/* Compliance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg bg-green-50">
                  <h3 className="text-lg font-semibold text-green-600">Compliant</h3>
                  <p className="text-2xl font-bold">{categoryVariances.filter(c => c.riskLevel === 'low').length}</p>
                  <p className="text-sm text-muted-foreground">Categories within budget</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-yellow-50">
                  <h3 className="text-lg font-semibold text-yellow-600">Monitor</h3>
                  <p className="text-2xl font-bold">{categoryVariances.filter(c => c.riskLevel === 'medium').length}</p>
                  <p className="text-sm text-muted-foreground">Categories to watch</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-red-50">
                  <h3 className="text-lg font-semibold text-red-600">Action Required</h3>
                  <p className="text-2xl font-bold">{categoryVariances.filter(c => c.riskLevel === 'high').length}</p>
                  <p className="text-sm text-muted-foreground">Categories over 90% budget</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="risk" className="space-y-6">
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
                      <div className="flex items-center gap-2">
                        {getRiskIcon(category.riskLevel)}
                        <Badge variant={getRiskBadgeColor(category.riskLevel)}>
                          {category.riskLevel.toUpperCase()} RISK
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>Allocated: {formatCurrency(category.allocated)}</span>
                      <span>Spent: {formatCurrency(category.spent)}</span>
                      <span>Remaining: {formatCurrency(category.variance)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Progress 
                        value={category.utilizationRate} 
                        className="flex-1 mr-4" 
                      />
                      <span className="text-sm font-medium">
                        {category.utilizationRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-6">
          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingExpenses.length > 0 ? (
                pendingExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h4 className="font-medium">{expense.title}</h4>
                      <p className="text-sm text-muted-foreground">{expense.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(expense.expense_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-destructive">{formatCurrency(Number(expense.amount))}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No pending expenses to review
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Transactions */}
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
        </TabsContent>
        
        <TabsContent value="audit" className="space-y-6">
          {/* Audit Trail */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {auditLogs.length > 0 ? (
                auditLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {log.action.includes('CREATE') && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {log.action.includes('UPDATE') && <FileText className="h-4 w-4 text-blue-500" />}
                        {log.action.includes('DELETE') && <XCircle className="h-4 w-4 text-red-500" />}
                        <span className="font-medium">{log.action}</span>
                      </div>
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
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No audit logs available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}