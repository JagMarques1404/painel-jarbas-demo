import { 
  Project, 
  Task, 
  Event, 
  Habit, 
  HabitLog, 
  Lead, 
  Expense, 
  JournalEntry, 
  Goal, 
  GoalItem 
} from './supabase'

// Projetos
export const mockProjects: Project[] = [
  { id: '1', user_id: 'demo-user', name: 'Melancia TV' },
  { id: '2', user_id: 'demo-user', name: 'Preciosa' },
  { id: '3', user_id: 'demo-user', name: 'Pessoal' }
]

// Tarefas
export const mockTasks: Task[] = [
  {
    id: '1',
    user_id: 'demo-user',
    project_id: '3',
    title: 'Alongar 10 min',
    priority: 2,
    status: 'todo',
    due_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: mockProjects[2]
  },
  {
    id: '2',
    user_id: 'demo-user',
    project_id: '3',
    title: 'Chá digestivo antes de dormir',
    priority: 3,
    status: 'todo',
    due_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: mockProjects[2]
  },
  {
    id: '3',
    user_id: 'demo-user',
    project_id: '1',
    title: 'Enviar proposta — Condomínio Atlântico',
    priority: 1,
    status: 'todo',
    due_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: mockProjects[0]
  },
  {
    id: '4',
    user_id: 'demo-user',
    project_id: '2',
    title: 'Responder DM do tênis',
    priority: 2,
    status: 'todo',
    due_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: mockProjects[1]
  }
]

// Eventos
export const mockEvents: Event[] = [
  {
    id: '1',
    user_id: 'demo-user',
    project_id: '1',
    title: 'Reunião com síndico (Atlântico)',
    location: 'BC',
    start_at: new Date(new Date().setHours(16, 0)).toISOString(),
    end_at: new Date(new Date().setHours(16, 30)).toISOString(),
    project: mockProjects[0]
  },
  {
    id: '2',
    user_id: 'demo-user',
    project_id: '2',
    title: 'Call Preciosa — material de venda',
    start_at: new Date(new Date(Date.now() + 86400000).setHours(10, 0)).toISOString(),
    end_at: new Date(new Date(Date.now() + 86400000).setHours(10, 30)).toISOString(),
    project: mockProjects[1]
  }
]

// Hábitos
export const mockHabits: Habit[] = [
  {
    id: '1',
    user_id: 'demo-user',
    name: 'Ler 1 capítulo da Bíblia',
    frequency: 'daily',
    target_per_period: 30,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'demo-user',
    name: 'Meditar 5 min (respiração)',
    frequency: 'daily',
    target_per_period: 30,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    user_id: 'demo-user',
    name: 'Alongamento',
    frequency: 'daily',
    target_per_period: 30,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    user_id: 'demo-user',
    name: 'Chá de noite',
    frequency: 'daily',
    target_per_period: 30,
    created_at: new Date().toISOString()
  }
]

// Logs de hábitos (alguns dias já marcados)
export const mockHabitLogs: HabitLog[] = [
  {
    id: '1',
    habit_id: '1',
    user_id: 'demo-user',
    done_at: new Date(Date.now() - 86400000).toISOString().split('T')[0] // ontem
  },
  {
    id: '2',
    habit_id: '2',
    user_id: 'demo-user',
    done_at: new Date(Date.now() - 86400000).toISOString().split('T')[0] // ontem
  },
  {
    id: '3',
    habit_id: '1',
    user_id: 'demo-user',
    done_at: new Date(Date.now() - 172800000).toISOString().split('T')[0] // anteontem
  }
]

// Leads
export const mockLeads: Lead[] = [
  {
    id: '1',
    user_id: 'demo-user',
    project_id: '1',
    name: 'Síndico Ed. Atlântico',
    status: 'andamento',
    last_touch: new Date(Date.now() - 259200000).toISOString().split('T')[0], // 3 dias atrás
    next_step: 'Enviar proposta',
    created_at: new Date().toISOString(),
    project: mockProjects[0]
  },
  {
    id: '2',
    user_id: 'demo-user',
    project_id: '1',
    name: 'Condomínio Brava Tower',
    status: 'novo',
    created_at: new Date().toISOString(),
    project: mockProjects[0]
  },
  {
    id: '3',
    user_id: 'demo-user',
    project_id: '2',
    name: 'Michel (piteira)',
    status: 'proposta',
    last_touch: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 dias atrás
    next_step: 'Follow-up amanhã',
    created_at: new Date().toISOString(),
    project: mockProjects[1]
  },
  {
    id: '4',
    user_id: 'demo-user',
    project_id: '2',
    name: 'Loja Street BC',
    status: 'novo',
    created_at: new Date().toISOString(),
    project: mockProjects[1]
  }
]

// Despesas
export const mockExpenses: Expense[] = [
  {
    id: '1',
    user_id: 'demo-user',
    amount: 22.00,
    category: 'alimentação',
    payment_method: 'pix',
    note: 'Café e pão',
    spent_at: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'demo-user',
    amount: 35.00,
    category: 'transporte',
    payment_method: 'crédito',
    note: 'Uber reunião',
    spent_at: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  }
]

// Entradas do diário
export const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    user_id: 'demo-user',
    title: 'Ideia viral Melancia TV',
    content: 'Pensei em criar uma série de vídeos mostrando os bastidores dos condomínios que atendemos. Seria interessante mostrar como funciona a gestão predial na prática.',
    tags: ['ideia', 'conteudo'],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'demo-user',
    title: 'Reflexão do dia',
    content: 'Hoje percebi que preciso ser mais organizado com os follow-ups dos leads. Vou implementar um sistema de lembretes.',
    tags: ['pessoal'],
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
]

// Itens das metas
export const mockGoalItems: GoalItem[] = [
  // Melancia TV - Meta 1
  { id: '1', goal_id: '1', title: 'Lista de 30 síndicos', done: false },
  { id: '2', goal_id: '1', title: '10 propostas enviadas', done: false },
  { id: '3', goal_id: '1', title: '3 contratos fechados', done: false },
  
  // Melancia TV - Meta 2
  { id: '4', goal_id: '2', title: 'Roteiro semanal', done: true },
  { id: '5', goal_id: '2', title: 'Calendário editorial', done: false },
  { id: '6', goal_id: '2', title: '1 case gravado', done: false },
  
  // Preciosa - Meta 1
  { id: '7', goal_id: '3', title: 'Parcerias 3 tabacarias', done: false },
  { id: '8', goal_id: '3', title: 'Campanha IG', done: true },
  { id: '9', goal_id: '3', title: 'Landing com calculadora de preço', done: false },
  
  // Preciosa - Meta 2
  { id: '10', goal_id: '4', title: 'Fotos catálogo', done: true },
  { id: '11', goal_id: '4', title: 'DM follow-ups', done: false },
  { id: '12', goal_id: '4', title: 'Checkout link', done: false },
  
  // Pessoal - Meta 1
  { id: '13', goal_id: '5', title: 'Ler 1 cap/dia', done: false },
  { id: '14', goal_id: '5', title: 'Revisar anotações', done: false },
  
  // Pessoal - Meta 2
  { id: '15', goal_id: '6', title: 'Alongar diariamente', done: false },
  { id: '16', goal_id: '6', title: 'Registrar no hábito', done: true }
]

// Metas
export const mockGoals: Goal[] = [
  {
    id: '1',
    user_id: 'demo-user',
    area: 'melancia',
    title: 'Chegar a 10 prédios em novembro',
    due_date: '2025-11-30',
    created_at: new Date().toISOString(),
    items: mockGoalItems.filter(item => item.goal_id === '1')
  },
  {
    id: '2',
    user_id: 'demo-user',
    area: 'melancia',
    title: '3 conteúdos virais/semana',
    due_date: '2025-11-30',
    created_at: new Date().toISOString(),
    items: mockGoalItems.filter(item => item.goal_id === '2')
  },
  {
    id: '3',
    user_id: 'demo-user',
    area: 'preciosa',
    title: 'Vender 120 cx de seda até nov',
    due_date: '2025-11-30',
    created_at: new Date().toISOString(),
    items: mockGoalItems.filter(item => item.goal_id === '3')
  },
  {
    id: '4',
    user_id: 'demo-user',
    area: 'preciosa',
    title: 'Vender 1 tênis, 1 casaco, 1 piteira',
    due_date: '2025-11-30',
    created_at: new Date().toISOString(),
    items: mockGoalItems.filter(item => item.goal_id === '4')
  },
  {
    id: '5',
    user_id: 'demo-user',
    area: 'pessoal',
    title: 'Ler 30 capítulos da Bíblia (mês)',
    due_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    items: mockGoalItems.filter(item => item.goal_id === '5')
  },
  {
    id: '6',
    user_id: 'demo-user',
    area: 'pessoal',
    title: 'Alongar 30x no mês',
    due_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    items: mockGoalItems.filter(item => item.goal_id === '6')
  }
]
