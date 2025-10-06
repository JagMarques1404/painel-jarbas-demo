'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  CreditCard,
  Smartphone,
  Banknote,
  Receipt
} from 'lucide-react'
import { mockExpenses } from '@/lib/mock-data'
import { formatCurrency, formatDate, isToday } from '@/lib/utils'
import { toast } from 'sonner'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function GastosPage() {
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    payment_method: '',
    note: ''
  })

  // Filtrar gastos por período
  const todayExpenses = mockExpenses.filter(expense => isToday(expense.spent_at))
  const thisWeekExpenses = mockExpenses.filter(expense => {
    const expenseDate = new Date(expense.spent_at)
    const today = new Date()
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
    return expenseDate >= weekStart
  })

  // Calcular totais
  const todayTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const weekTotal = thisWeekExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthTotal = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Dados para gráficos
  const categoryData = mockExpenses.reduce((acc, expense) => {
    const category = expense.category
    if (!acc[category]) {
      acc[category] = { name: category, value: 0, count: 0 }
    }
    acc[category].value += expense.amount
    acc[category].count += 1
    return acc
  }, {} as Record<string, { name: string; value: number; count: number }>)

  const categoryChartData = Object.values(categoryData)

  const paymentMethodData = mockExpenses.reduce((acc, expense) => {
    const method = expense.payment_method || 'Não informado'
    if (!acc[method]) {
      acc[method] = { name: method, value: 0, count: 0 }
    }
    acc[method].value += expense.amount
    acc[method].count += 1
    return acc
  }, {} as Record<string, { name: string; value: number; count: number }>)

  const paymentMethodChartData = Object.values(paymentMethodData)

  // Cores para os gráficos
  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']

  const categories = [
    'alimentação', 'transporte', 'saúde', 'educação', 'lazer', 
    'casa', 'roupas', 'tecnologia', 'marketing', 'outros'
  ]

  const paymentMethods = ['pix', 'crédito', 'débito', 'dinheiro', 'transferência']

  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.category) {
      toast.error('Preencha pelo menos o valor e a categoria')
      return
    }

    toast.success('Gasto adicionado com sucesso!')
    setNewExpense({
      amount: '',
      category: '',
      payment_method: '',
      note: ''
    })
  }

  const handleExportCSV = () => {
    toast.success('Exportação iniciada! O arquivo será baixado em breve.')
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'pix': return <Smartphone className="h-4 w-4" />
      case 'crédito': case 'débito': return <CreditCard className="h-4 w-4" />
      case 'dinheiro': return <Banknote className="h-4 w-4" />
      default: return <Receipt className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gastos do Dia</h1>
          <p className="text-gray-600 mt-1">
            Controle seus gastos e acompanhe suas despesas
          </p>
        </div>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Input rápido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Adicionar Gasto</span>
          </CardTitle>
          <CardDescription>
            Registre um novo gasto rapidamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Valor *
              </label>
              <Input
                type="number"
                placeholder="0,00"
                value={newExpense.amount}
                onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                className="text-lg"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Categoria *
              </label>
              <Select 
                value={newExpense.category} 
                onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Forma de Pagamento
              </label>
              <Select 
                value={newExpense.payment_method} 
                onValueChange={(value) => setNewExpense(prev => ({ ...prev, payment_method: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      <div className="flex items-center space-x-2">
                        {getPaymentMethodIcon(method)}
                        <span>{method.charAt(0).toUpperCase() + method.slice(1)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Nota
              </label>
              <Input
                placeholder="Descrição..."
                value={newExpense.note}
                onChange={(e) => setNewExpense(prev => ({ ...prev, note: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <Button onClick={handleAddExpense} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Gasto
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos de Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(todayTotal)}</div>
            <p className="text-xs text-muted-foreground">
              {todayExpenses.length} lançamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(weekTotal)}</div>
            <p className="text-xs text-muted-foreground">
              {thisWeekExpenses.length} lançamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthTotal)}</div>
            <p className="text-xs text-muted-foreground">
              {mockExpenses.length} lançamentos
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lista" className="space-y-6">
        <TabsList>
          <TabsTrigger value="lista">Lista de Gastos</TabsTrigger>
          <TabsTrigger value="graficos">Gráficos</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gastos Recentes</CardTitle>
              <CardDescription>
                Seus lançamentos mais recentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockExpenses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum gasto registrado</p>
                  </div>
                ) : (
                  mockExpenses
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {getPaymentMethodIcon(expense.payment_method || '')}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">
                                {expense.note || 'Sem descrição'}
                              </h4>
                              <Badge variant="secondary">
                                {expense.category}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>{formatDate(expense.spent_at)}</span>
                              {expense.payment_method && (
                                <>
                                  <span>•</span>
                                  <span>{expense.payment_method}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600">
                            {formatCurrency(expense.amount)}
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graficos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gastos por Categoria</CardTitle>
                <CardDescription>
                  Distribuição dos gastos por categoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Formas de Pagamento</CardTitle>
                <CardDescription>
                  Como você tem pago suas despesas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={paymentMethodChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Resumo por categoria */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo por Categoria</CardTitle>
              <CardDescription>
                Detalhamento dos gastos por categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryChartData
                  .sort((a, b) => b.value - a.value)
                  .map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div>
                          <h4 className="font-medium capitalize">{category.name}</h4>
                          <p className="text-sm text-gray-600">{category.count} lançamentos</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(category.value)}</div>
                        <div className="text-sm text-gray-600">
                          {((category.value / monthTotal) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
