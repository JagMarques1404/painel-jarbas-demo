'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle2, 
  Circle, 
  Plus,
  Target,
  Calendar,
  TrendingUp,
  Clock
} from 'lucide-react'
import { mockHabits, mockHabitLogs } from '@/lib/mock-data'
import { 
  formatDate, 
  calculateStreak, 
  calculateMonthlyPercentage,
  isToday 
} from '@/lib/utils'
import { toast } from 'sonner'

export default function HabitosPage() {
  const [completedToday, setCompletedToday] = useState<string[]>(
    mockHabitLogs
      .filter(log => isToday(log.done_at))
      .map(log => log.habit_id)
  )

  const handleToggleHabit = (habitId: string) => {
    if (completedToday.includes(habitId)) {
      setCompletedToday(prev => prev.filter(id => id !== habitId))
      toast.success('Hábito desmarcado para hoje')
    } else {
      setCompletedToday(prev => [...prev, habitId])
      toast.success('Hábito concluído hoje! 🎉')
    }
  }

  const getHabitStats = (habitId: string) => {
    const habitLogs = mockHabitLogs.filter(log => log.habit_id === habitId)
    const habit = mockHabits.find(h => h.id === habitId)
    
    if (!habit) return { streak: 0, monthlyPercentage: 0, lastDone: null }
    
    const streak = calculateStreak(habitLogs, habit.frequency)
    const monthlyPercentage = calculateMonthlyPercentage(habitLogs, habit.target_per_period)
    const lastDone = habitLogs.length > 0 
      ? habitLogs.sort((a, b) => new Date(b.done_at).getTime() - new Date(a.done_at).getTime())[0].done_at
      : null
    
    return { streak, monthlyPercentage, lastDone }
  }

  const totalHabits = mockHabits.length
  const completedTodayCount = completedToday.length
  const completionPercentage = Math.round((completedTodayCount / totalHabits) * 100)

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hábitos Diários</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe seus hábitos e construa uma rotina consistente
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Hábito
        </Button>
      </div>

      {/* Resumo do dia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso de Hoje</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{completedTodayCount}/{totalHabits}</div>
            <Progress value={completionPercentage} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {completionPercentage}% dos hábitos concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maior Sequência</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...mockHabits.map(habit => getHabitStats(habit.id).streak))}
            </div>
            <p className="text-xs text-muted-foreground">
              dias consecutivos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta do Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                mockHabits.reduce((sum, habit) => 
                  sum + getHabitStats(habit.id).monthlyPercentage, 0
                ) / mockHabits.length
              )}%
            </div>
            <p className="text-xs text-muted-foreground">
              média de conclusão
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de hábitos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockHabits.map((habit) => {
          const isCompletedToday = completedToday.includes(habit.id)
          const stats = getHabitStats(habit.id)
          
          return (
            <Card key={habit.id} className={isCompletedToday ? 'ring-2 ring-green-200 bg-green-50' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleHabit(habit.id)}
                      className={`p-0 h-8 w-8 rounded-full ${
                        isCompletedToday 
                          ? 'text-green-600 hover:text-green-700' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {isCompletedToday ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </Button>
                    
                    <div>
                      <CardTitle className="text-lg">{habit.name}</CardTitle>
                      <CardDescription>
                        {habit.frequency === 'daily' && 'Diário'} • 
                        Meta: {habit.target_per_period}/mês
                      </CardDescription>
                    </div>
                  </div>
                  
                  {isCompletedToday && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Concluído hoje
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Estatísticas */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {stats.streak}
                    </div>
                    <div className="text-xs text-gray-500">Sequência</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.monthlyPercentage}%
                    </div>
                    <div className="text-xs text-gray-500">Este mês</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-600">
                      {stats.lastDone ? formatDate(stats.lastDone) : 'Nunca'}
                    </div>
                    <div className="text-xs text-gray-500">Última vez</div>
                  </div>
                </div>

                {/* Barra de progresso mensal */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progresso mensal</span>
                    <span className="font-medium">{stats.monthlyPercentage}%</span>
                  </div>
                  <Progress value={stats.monthlyPercentage} />
                </div>

                {/* Ações */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant={isCompletedToday ? "secondary" : "default"}
                    size="sm"
                    onClick={() => handleToggleHabit(habit.id)}
                    className="flex items-center space-x-2"
                  >
                    {isCompletedToday ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Concluído</span>
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4" />
                        <span>Marcar como feito</span>
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>Criado {formatDate(habit.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty state se não houver hábitos */}
      {mockHabits.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum hábito cadastrado
            </h3>
            <p className="text-gray-500 mb-4">
              Comece criando seu primeiro hábito para acompanhar sua rotina
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Criar primeiro hábito
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
