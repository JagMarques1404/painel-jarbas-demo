'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Trophy, 
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  Tv,
  Gem,
  User
} from 'lucide-react'
import { mockGoals } from '@/lib/mock-data'
import { formatDate, calculateGoalProgress } from '@/lib/utils'
import { toast } from 'sonner'

export default function MetasPage() {
  const [completedItems, setCompletedItems] = useState<string[]>(
    mockGoals
      .flatMap(goal => goal.items || [])
      .filter(item => item.done)
      .map(item => item.id)
  )

  const handleToggleItem = (itemId: string) => {
    if (completedItems.includes(itemId)) {
      setCompletedItems(prev => prev.filter(id => id !== itemId))
      toast.success('Item desmarcado')
    } else {
      setCompletedItems(prev => [...prev, itemId])
      toast.success('Item concluído! 🎉')
    }
  }

  const getAreaIcon = (area: string) => {
    switch (area) {
      case 'melancia': return <Tv className="h-5 w-5" />
      case 'preciosa': return <Gem className="h-5 w-5" />
      case 'pessoal': return <User className="h-5 w-5" />
      default: return <Target className="h-5 w-5" />
    }
  }

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'melancia': return 'bg-red-100 text-red-800 border-red-200'
      case 'preciosa': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'pessoal': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAreaName = (area: string) => {
    switch (area) {
      case 'melancia': return 'Melancia TV'
      case 'preciosa': return 'Preciosa'
      case 'pessoal': return 'Pessoal'
      default: return area
    }
  }

  // Calcular estatísticas
  const totalGoals = mockGoals.length
  const completedGoals = mockGoals.filter(goal => {
    const progress = calculateGoalProgress(goal.items || [])
    return progress === 100
  }).length

  const upcomingGoals = mockGoals.filter(goal => {
    if (!goal.due_date) return false
    const dueDate = new Date(goal.due_date)
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  }).length

  const overallProgress = Math.round(
    mockGoals.reduce((sum, goal) => sum + calculateGoalProgress(goal.items || []), 0) / mockGoals.length
  )

  // Agrupar metas por área
  const goalsByArea = mockGoals.reduce((acc, goal) => {
    if (!acc[goal.area]) {
      acc[goal.area] = []
    }
    acc[goal.area].push(goal)
    return acc
  }, {} as Record<string, typeof mockGoals>)

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Metas</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe o progresso dos seus objetivos e projetos
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Metas</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGoals}</div>
            <p className="text-xs text-muted-foreground">
              objetivos definidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((completedGoals / totalGoals) * 100)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencendo em 7 dias</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{upcomingGoals}</div>
            <p className="text-xs text-muted-foreground">
              precisam de atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="todas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="todas">Todas as Metas</TabsTrigger>
          <TabsTrigger value="melancia">Melancia TV</TabsTrigger>
          <TabsTrigger value="preciosa">Preciosa</TabsTrigger>
          <TabsTrigger value="pessoal">Pessoal</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockGoals.map((goal) => {
              const progress = calculateGoalProgress(goal.items || [])
              const isOverdue = goal.due_date && new Date(goal.due_date) < new Date()
              const daysLeft = goal.due_date 
                ? Math.ceil((new Date(goal.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : null

              return (
                <Card key={goal.id} className={isOverdue ? 'border-red-200 bg-red-50' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getAreaColor(goal.area)} variant="outline">
                            <div className="flex items-center space-x-1">
                              {getAreaIcon(goal.area)}
                              <span>{getAreaName(goal.area)}</span>
                            </div>
                          </Badge>
                          {isOverdue && (
                            <Badge variant="destructive">
                              Vencida
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        {goal.description && (
                          <CardDescription className="mt-1">
                            {goal.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {goal.due_date 
                            ? `Prazo: ${formatDate(goal.due_date)}`
                            : 'Sem prazo definido'
                          }
                        </span>
                      </div>
                      {daysLeft !== null && (
                        <span className={daysLeft <= 7 ? 'text-orange-600 font-medium' : ''}>
                          {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Vencida'}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Barra de progresso */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progresso</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>

                    {/* Lista de itens */}
                    {goal.items && goal.items.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">
                          Itens ({goal.items.filter(item => completedItems.includes(item.id)).length}/{goal.items.length})
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {goal.items.map((item) => {
                            const isCompleted = completedItems.includes(item.id)
                            
                            return (
                              <div key={item.id} className="flex items-center space-x-2">
                                <Checkbox
                                  checked={isCompleted}
                                  onCheckedChange={() => handleToggleItem(item.id)}
                                />
                                <span className={`text-sm ${isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                  {item.title}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Ações */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-gray-500">
                        Criada em {formatDate(goal.created_at)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        {progress === 100 && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            ✓ Concluída
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Tabs por área */}
        {Object.entries(goalsByArea).map(([area, goals]) => (
          <TabsContent key={area} value={area} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {goals.map((goal) => {
                const progress = calculateGoalProgress(goal.items || [])
                const isOverdue = goal.due_date && new Date(goal.due_date) < new Date()
                const daysLeft = goal.due_date 
                  ? Math.ceil((new Date(goal.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  : null

                return (
                  <Card key={goal.id} className={isOverdue ? 'border-red-200 bg-red-50' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {isOverdue && (
                              <Badge variant="destructive">
                                Vencida
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                          {goal.description && (
                            <CardDescription className="mt-1">
                              {goal.description}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {goal.due_date 
                              ? `Prazo: ${formatDate(goal.due_date)}`
                              : 'Sem prazo definido'
                            }
                          </span>
                        </div>
                        {daysLeft !== null && (
                          <span className={daysLeft <= 7 ? 'text-orange-600 font-medium' : ''}>
                            {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Vencida'}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Barra de progresso */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progresso</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>

                      {/* Lista de itens */}
                      {goal.items && goal.items.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">
                            Itens ({goal.items.filter(item => completedItems.includes(item.id)).length}/{goal.items.length})
                          </h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {goal.items.map((item) => {
                              const isCompleted = completedItems.includes(item.id)
                              
                              return (
                                <div key={item.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={isCompleted}
                                    onCheckedChange={() => handleToggleItem(item.id)}
                                  />
                                  <span className={`text-sm ${isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                    {item.title}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Ações */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-xs text-gray-500">
                          Criada em {formatDate(goal.created_at)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          {progress === 100 && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              ✓ Concluída
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Empty state */}
      {mockGoals.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma meta definida
            </h3>
            <p className="text-gray-500 mb-4">
              Comece definindo seus objetivos e acompanhe o progresso
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Criar primeira meta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
