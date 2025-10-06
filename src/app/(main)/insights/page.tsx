'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  BookOpen, 
  Search,
  Calendar,
  Tag,
  Edit,
  Trash2,
  Lightbulb,
  Heart,
  Briefcase,
  User
} from 'lucide-react'
import { mockJournalEntries } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function InsightsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  })
  const [newTag, setNewTag] = useState('')

  // Filtrar entradas
  const filteredEntries = mockJournalEntries.filter(entry => {
    const matchesSearch = !searchTerm || 
      entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTag = !selectedTag || 
      (entry.tags && entry.tags.includes(selectedTag))
    
    return matchesSearch && matchesTag
  })

  // Obter todas as tags únicas
  const allTags = Array.from(
    new Set(
      mockJournalEntries
        .flatMap(entry => entry.tags || [])
        .filter(Boolean)
    )
  )

  const handleSaveEntry = () => {
    if (!newEntry.content.trim()) {
      toast.error('O conteúdo não pode estar vazio')
      return
    }

    toast.success('Insight salvo com sucesso!')
    setNewEntry({ title: '', content: '', tags: [] })
    setIsDialogOpen(false)
  }

  const handleAddTag = () => {
    if (!newTag.trim() || newEntry.tags.includes(newTag.trim())) return
    
    setNewEntry(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }))
    setNewTag('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const getTagIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'ideia': return <Lightbulb className="h-3 w-3" />
      case 'pessoal': return <User className="h-3 w-3" />
      case 'trabalho': return <Briefcase className="h-3 w-3" />
      case 'conteudo': return <BookOpen className="h-3 w-3" />
      default: return <Tag className="h-3 w-3" />
    }
  }

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'ideia': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'pessoal': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'trabalho': return 'bg-green-100 text-green-800 border-green-200'
      case 'conteudo': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pensamentos & Insights</h1>
          <p className="text-gray-600 mt-1">
            Capture suas ideias, reflexões e aprendizados
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Insight
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Capturar Novo Insight</DialogTitle>
              <DialogDescription>
                Registre uma nova ideia, reflexão ou aprendizado
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Título (opcional)
                </label>
                <Input
                  placeholder="Ex: Ideia para novo conteúdo..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Conteúdo *
                </label>
                <Textarea
                  placeholder="Descreva seu insight, ideia ou reflexão..."
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Tags
                </label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Adicionar tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {newEntry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newEntry.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        {getTagIcon(tag)}
                        <span>{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEntry}>
                Salvar Insight
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por título ou conteúdo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(null)}
              >
                Todas
              </Button>
              {allTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className="flex items-center space-x-1"
                >
                  {getTagIcon(tag)}
                  <span>{tag}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Insights</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockJournalEntries.length}</div>
            <p className="text-xs text-muted-foreground">
              registros salvos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tags Únicas</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allTags.length}</div>
            <p className="text-xs text-muted-foreground">
              categorias diferentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockJournalEntries.filter(entry => {
                const entryDate = new Date(entry.created_at)
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return entryDate >= weekAgo
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              novos insights
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de insights */}
      <div className="space-y-6">
        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || selectedTag ? 'Nenhum insight encontrado' : 'Nenhum insight registrado'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedTag 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece capturando seu primeiro insight ou reflexão'
                }
              </p>
              {!searchTerm && !selectedTag && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeiro insight
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredEntries
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {entry.title && (
                        <CardTitle className="text-lg mb-2">{entry.title}</CardTitle>
                      )}
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(entry.created_at, 'long')}</span>
                        <span>•</span>
                        <span>{formatDate(entry.created_at, 'time')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="prose prose-sm max-w-none mb-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>
                  
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className={`flex items-center space-x-1 ${getTagColor(tag)}`}
                          variant="outline"
                        >
                          {getTagIcon(tag)}
                          <span>{tag}</span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  )
}
