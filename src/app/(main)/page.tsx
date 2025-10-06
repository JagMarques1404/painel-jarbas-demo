'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  DollarSign, 
  Target,
  ArrowRight,
  Plus,
  MoreHorizontal
} from 'lucide-react'
import { 
  mockTasks, 
  mockEvents, 
  mockHabits, 
  mockHabitLogs, 
  mockExpenses,
  mockGoals 
} from '@/lib/mock-data'
import { 
  formatDate, 
  formatCurrency, 
  getPriorityColor, 
  getPriorityText, 
  isToday,
  calculateGoalProgress
} from '@/lib/utils'
import { toast } from 'sonner'

export default function HomePage() {
  // Filtrar dados para hoje
  const todayTasks = mockTasks.filter(task => 
    task.due_date && isToday(task.due_date) && task.status !== 'done'
  )
  
  const todayEvents = mockEvents.filter(event => 
    isToday(event.start_at)
  )
  
  const todayExpenses = mockExpenses.filter(expense => 
    isToday(expense.spent_at)
  )
  
  const todayHabitsCompleted = mockHabitLogs.filter(log => 
    isToday(log.done_at)
  ).length
  
  // Metas próximas do vencimento (7 dias)
  const upcomingGoals = mockGoals.filter(goal => {
    if (!goal.due_date) return false
    const dueDate = new Date(goal.due_date)
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  })

  // Combinar tarefas e eventos para agenda do dia
  const agendaItems = [
    ...todayTasks.map(task => ({
      id: task.id,
      type: 'task' as const,
      title: task.title,
      time: task.due_date ? formatDate(task.due_date, 'time') : null,
      priority: task.priority,
      project: task.project?.name,
      status: task.status,
      data: task
    })),
    ...todayEvents.map(event => ({
      id: event.id,
      type: 'event' as const,
      title: event.title,
      time: formatDate(event.start_at, 'time'),
      location: event.location,
      project: event.project?.name,
      data: event
    }))
  ].sort((a, b) => {
    // Ordenar por: status != done > time > priority
    if (a.type === 'task' && b.type === 'task') {
      if (a.status !== 'done' && b.status === 'done') return -1
      if (a.status === 'done' && b.status !== 'done') return 1
      if (a.priority !== b.priority) return a.priority - b.priority
    }
    return 0
  })

  const handleCompleteTask = (taskId: string) => {
    toast.success('Tarefa concluída!')
  }

  const handlePostponeTask = (taskId: string, days: number) => {
    const period = days === 1 ? 'amanhã' : 'próxima semana'
    toast.success(`Tarefa adiada para ${period}`)
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bom dia! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          {formatDate(new Date(), 'long')}
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas de Hoje</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayTasks.filter(t => t.priority === 1).length} alta prioridade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hábitos do Dia</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayHabitsCompleted}/{mockHabits.length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((todayHabitsCompleted / mockHabits.length) * 100)}% concluído
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reuniões da Semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayEvents.length} hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(todayExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {todayExpenses.length} lançamentos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Agenda do dia */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Agenda do Dia</CardTitle>
                  <CardDescription>
                    Tarefas e eventos priorizados para hoje
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {agendaItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma tarefa ou evento para hoje</p>
                </div>
              ) : (
                agendaItems.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {item.type === 'task' ? (
                          <CheckCircle2 className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Clock className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.title}
                          </p>
                          {item.type === 'task' && item.priority && (
                            <Badge 
                              variant="outline" 
                              className={getPriorityColor(item.priority)}
                            >
                              {getPriorityText(item.priority)}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-1">
                          {item.time && (
                            <span className="text-xs text-gray-500">
                              {item.time}
                            </span>
                          )}
                          {item.project && (
                            <Badge variant="secondary" className="text-xs">
                              {item.project}
                            </Badge>
                          )}
                          {item.type === 'event' && item.location && (
                            <span className="text-xs text-gray-500">
                              📍 {item.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {item.type === 'task' && (
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCompleteTask(item.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          ✓
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePostponeTask(item.id, 1)}
                          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        >
                          +1d
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePostponeTask(item.id, 7)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          +1s
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar com metas próximas */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metas Próximas</CardTitle>
              <CardDescription>
                Vencendo nos próximos 7 dias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingGoals.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Nenhuma meta próxima do vencimento
                </p>
              ) : (
                upcomingGoals.map((goal) => {
                  const progress = calculateGoalProgress(goal.items || [])
                  const daysLeft = Math.ceil(
                    (new Date(goal.due_date!).getTime() - new Date().getTime()) / 
                    (1000 * 60 * 60 * 24)
                  )
                  
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{goal.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {goal.area}
                        </Badge>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{progress}% concluído</span>
                        <span>{daysLeft} dias restantes</span>
                      </div>
                    </div>
                  )
                })
              )}
              
              <Button variant="outline" size="sm" className="w-full mt-4">
                Ver todas as metas
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
