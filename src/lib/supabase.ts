import { createClient } from '@supabase/supabase-js'

// Para a demo, usaremos dados mockados em vez de uma conexão real com Supabase
// Em produção, estas variáveis viriam do ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos TypeScript para o banco de dados
export interface Project {
  id: string
  user_id: string
  name: string
}

export interface Task {
  id: string
  user_id: string
  project_id?: string
  title: string
  description?: string
  priority: 1 | 2 | 3 // 1=alta, 2=média, 3=baixa
  status: 'todo' | 'doing' | 'done'
  due_date?: string
  created_at: string
  updated_at: string
  project?: Project
}

export interface Event {
  id: string
  user_id: string
  project_id?: string
  title: string
  location?: string
  start_at: string
  end_at?: string
  notes?: string
  project?: Project
}

export interface Habit {
  id: string
  user_id: string
  name: string
  frequency: 'daily' | 'weekly' | 'monthly'
  target_per_period: number
  notes?: string
  created_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  done_at: string
}

export interface Lead {
  id: string
  user_id: string
  project_id: string
  name: string
  company?: string
  status: 'novo' | 'andamento' | 'proposta' | 'fechado' | 'perdido'
  last_touch?: string
  next_step?: string
  notes?: string
  created_at: string
  project?: Project
}

export interface Expense {
  id: string
  user_id: string
  amount: number
  category: string
  payment_method?: string
  note?: string
  spent_at: string
  created_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  title?: string
  content: string
  tags?: string[]
  created_at: string
}

export interface Goal {
  id: string
  user_id: string
  area: 'melancia' | 'preciosa' | 'pessoal'
  title: string
  description?: string
  due_date?: string
  created_at: string
  items?: GoalItem[]
}

export interface GoalItem {
  id: string
  goal_id: string
  title: string
  done: boolean
}
