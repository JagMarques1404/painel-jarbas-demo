'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Target, 
  Users, 
  Calendar, 
  Phone,
  Mail,
  Clock,
  AlertCircle,
  TrendingUp,
  Building,
  MessageSquare
} from 'lucide-react'
import { mockLeads, mockEvents, mockProjects } from '@/lib/mock-data'
import { formatDate, getStatusColor, getStatusText, daysDifference } from '@/lib/utils'
import { toast } from 'sonner'

export default function MelanciaPage() {
  const [newNote, setNewNote] = useState<{ [key: string]: string }>({})
  
  // Filtrar dados específicos da Melancia TV
  const melanciaProject = mockProjects.find(p => p.name === 'Melancia TV')
  const melanciaLeads = mockLeads.filter(lead => lead.project_id === melanciaProject?.id)
  const melanciaEvents = mockEvents.filter(event => event.project_id === melanciaProject?.id)
  
  // Estatísticas
  const totalLeads = melanciaLeads.length
  const newLeads = melanciaLeads.filter(lead => lead.status === 'novo').length
  const activeLeads = melanciaLeads.filter(lead => lead.status === 'andamento').length
  const proposalLeads = melanciaLeads.filter(lead => lead.status === 'proposta').length
  const closedLeads = melanciaLeads.filter(lead => lead.status === 'fechado').length
  
  // Leads que precisam de follow-up (sem contato há 7+ dias)
  const leadsNeedingFollowup = melanciaLeads.filter(lead => {
    if (!lead.last_touch) return true
    return daysDifference(lead.last_touch, new Date()) >= 7
  })

  const handleRegisterContact = (leadId: string) => {
    toast.success('Contato registrado! Data atualizada para hoje.')
  }

  const handleAddNote = (leadId: string) => {
    const note = newNote[leadId]
    if (!note?.trim()) return
    
    toast.success('Nota adicionada ao lead')
    setNewNote(prev => ({ ...prev, [leadId]: '' }))
  }

  const handleCreateLead = () => {
    toast.success('Novo lead criado!')
  }

  const handleSendProposal = (leadId: string) => {
    toast.success('Proposta enviada!')
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span>Melancia TV</span>
          </h1>
          <p className="text-gray-600 mt-1">
            CRM para gestão de condomínios e leads
          </p>
        </div>
        <Button onClick={handleCreateLead}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      {/* Metas do dia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleCreateLead}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novo Lead</CardTitle>
            <Plus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{newLeads}</div>
            <p className="text-xs text-muted-foreground">
              Clique para adicionar novo
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reforçar Lead Antigo</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{leadsNeedingFollowup.length}</div>
            <p className="text-xs text-muted-foreground">
              Sem contato há 7+ dias
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviar Proposta</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeLeads}</div>
            <p className="text-xs text-muted-foreground">
              Em andamento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalLeads}</div>
            <div className="text-sm text-gray-600">Total de Leads</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{activeLeads}</div>
            <div className="text-sm text-gray-600">Em Andamento</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{proposalLeads}</div>
            <div className="text-sm text-gray-600">Propostas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{closedLeads}</div>
            <div className="text-sm text-gray-600">Fechados</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="agenda">Agenda da Semana</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-6">
          {/* Leads que precisam de atenção */}
          {leadsNeedingFollowup.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Leads Precisando de Follow-up</span>
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Estes leads não têm contato há 7 ou mais dias
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {leadsNeedingFollowup.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                      <h4 className="font-medium">{lead.name}</h4>
                      <p className="text-sm text-gray-600">
                        {lead.company && `${lead.company} • `}
                        Último contato: {lead.last_touch ? formatDate(lead.last_touch) : 'Nunca'}
                      </p>
                    </div>
                    <Button size="sm" onClick={() => handleRegisterContact(lead.id)}>
                      <Phone className="h-4 w-4 mr-1" />
                      Registrar Contato
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Lista de leads por status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {['novo', 'andamento', 'proposta', 'fechado'].map((status) => {
              const statusLeads = melanciaLeads.filter(lead => lead.status === status)
              
              return (
                <Card key={status}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <Badge className={getStatusColor(status)}>
                          {getStatusText(status)}
                        </Badge>
                        <span>({statusLeads.length})</span>
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {statusLeads.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        Nenhum lead neste status
                      </p>
                    ) : (
                      statusLeads.map((lead) => (
                        <div key={lead.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium flex items-center space-x-2">
                                <Building className="h-4 w-4 text-gray-400" />
                                <span>{lead.name}</span>
                              </h4>
                              {lead.company && (
                                <p className="text-sm text-gray-600">{lead.company}</p>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRegisterContact(lead.id)}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                              {status === 'andamento' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleSendProposal(lead.id)}
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Último contato:</span>
                              <p className="font-medium">
                                {lead.last_touch ? formatDate(lead.last_touch) : 'Nunca'}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">Próximo passo:</span>
                              <p className="font-medium">
                                {lead.next_step || 'Não definido'}
                              </p>
                            </div>
                          </div>

                          {lead.notes && (
                            <div className="bg-gray-50 p-3 rounded text-sm">
                              <span className="text-gray-500">Notas:</span>
                              <p>{lead.notes}</p>
                            </div>
                          )}

                          {/* Campo para nova nota */}
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Adicionar nota rápida..."
                              value={newNote[lead.id] || ''}
                              onChange={(e) => setNewNote(prev => ({ 
                                ...prev, 
                                [lead.id]: e.target.value 
                              }))}
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleAddNote(lead.id)}
                              disabled={!newNote[lead.id]?.trim()}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="agenda" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Reuniões da Semana</span>
              </CardTitle>
              <CardDescription>
                Eventos e reuniões agendados para a Melancia TV
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {melanciaEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma reunião agendada</p>
                </div>
              ) : (
                melanciaEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{formatDate(event.start_at, 'long')}</span>
                          <span>•</span>
                          <span>{formatDate(event.start_at, 'time')}</span>
                          {event.location && (
                            <>
                              <span>•</span>
                              <span>📍 {event.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      Detalhes
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
