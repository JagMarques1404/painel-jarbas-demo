import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatação de datas para o timezone do Brasil
export function formatDate(date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string {
  const d = new Date(date)
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Sao_Paulo',
  }
  
  switch (format) {
    case 'short':
      options.day = '2-digit'
      options.month = '2-digit'
      options.year = 'numeric'
      return d.toLocaleDateString('pt-BR', options)
    
    case 'long':
      options.weekday = 'long'
      options.day = 'numeric'
      options.month = 'long'
      options.year = 'numeric'
      return d.toLocaleDateString('pt-BR', options)
    
    case 'time':
      options.hour = '2-digit'
      options.minute = '2-digit'
      return d.toLocaleTimeString('pt-BR', options)
    
    default:
      return d.toLocaleDateString('pt-BR', options)
  }
}

// Verifica se uma data é hoje
export function isToday(date: string | Date): boolean {
  const today = new Date()
  const compareDate = new Date(date)
  
  return today.toDateString() === compareDate.toDateString()
}

// Verifica se uma data é amanhã
export function isTomorrow(date: string | Date): boolean {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const compareDate = new Date(date)
  
  return tomorrow.toDateString() === compareDate.toDateString()
}

// Calcula a diferença em dias entre duas datas
export function daysDifference(date1: string | Date, date2: string | Date): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Formatar valores monetários
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Obter cor da prioridade
export function getPriorityColor(priority: 1 | 2 | 3): string {
  switch (priority) {
    case 1: return 'text-red-600 bg-red-50 border-red-200'
    case 2: return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 3: return 'text-green-600 bg-green-50 border-green-200'
    default: return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

// Obter texto da prioridade
export function getPriorityText(priority: 1 | 2 | 3): string {
  switch (priority) {
    case 1: return 'Alta'
    case 2: return 'Média'
    case 3: return 'Baixa'
    default: return 'Média'
  }
}

// Obter cor do status
export function getStatusColor(status: string): string {
  switch (status) {
    case 'todo': return 'text-gray-600 bg-gray-50 border-gray-200'
    case 'doing': return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'done': return 'text-green-600 bg-green-50 border-green-200'
    case 'novo': return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'andamento': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'proposta': return 'text-purple-600 bg-purple-50 border-purple-200'
    case 'fechado': return 'text-green-600 bg-green-50 border-green-200'
    case 'perdido': return 'text-red-600 bg-red-50 border-red-200'
    default: return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

// Obter texto do status
export function getStatusText(status: string): string {
  switch (status) {
    case 'todo': return 'A fazer'
    case 'doing': return 'Fazendo'
    case 'done': return 'Concluído'
    case 'novo': return 'Novo'
    case 'andamento': return 'Em andamento'
    case 'proposta': return 'Proposta enviada'
    case 'fechado': return 'Fechado'
    case 'perdido': return 'Perdido'
    default: return status
  }
}

// Calcular progresso de uma meta
export function calculateGoalProgress(items: { done: boolean }[]): number {
  if (items.length === 0) return 0
  const completedItems = items.filter(item => item.done).length
  return Math.round((completedItems / items.length) * 100)
}

// Calcular streak de hábitos
export function calculateStreak(logs: { done_at: string }[], frequency: 'daily' | 'weekly' | 'monthly'): number {
  if (logs.length === 0) return 0
  
  // Ordenar logs por data (mais recente primeiro)
  const sortedLogs = logs.sort((a, b) => new Date(b.done_at).getTime() - new Date(a.done_at).getTime())
  
  let streak = 0
  const today = new Date()
  
  // Para hábitos diários, verificar dias consecutivos
  if (frequency === 'daily') {
    const currentDate = new Date(today)
    
    for (const log of sortedLogs) {
      const logDate = new Date(log.done_at)
      
      // Se o log é de hoje ou ontem, continuar contando
      if (logDate.toDateString() === currentDate.toDateString()) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
  }
  
  return streak
}

// Calcular porcentagem do mês para hábitos
export function calculateMonthlyPercentage(logs: { done_at: string }[], targetPerPeriod: number): number {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  const logsThisMonth = logs.filter(log => {
    const logDate = new Date(log.done_at)
    return logDate >= startOfMonth && logDate <= endOfMonth
  })
  
  return Math.round((logsThisMonth.length / targetPerPeriod) * 100)
}
