'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Target, 
  Tv, 
  Gem, 
  DollarSign, 
  BookOpen, 
  Trophy,
  Search,
  Plus
} from 'lucide-react'

const navigation = [
  { name: 'Início', href: '/', icon: Home },
  { name: 'Hábitos', href: '/habitos', icon: Target },
  { name: 'Melancia TV', href: '/melancia', icon: Tv },
  { name: 'Preciosa', href: '/preciosa', icon: Gem },
  { name: 'Gastos', href: '/gastos', icon: DollarSign },
  { name: 'Insights', href: '/insights', icon: BookOpen },
  { name: 'Metas', href: '/metas', icon: Trophy },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="font-semibold text-gray-900">Painel Jarbas</span>
            </Link>
          </div>

          {/* Navegação principal */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Ações rápidas */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center space-x-1"
            >
              <Search className="h-4 w-4" />
              <span className="text-xs text-gray-500">⌘K</span>
            </Button>
            
            <Button size="sm" className="flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Novo</span>
            </Button>
          </div>
        </div>

        {/* Navegação mobile */}
        <div className="md:hidden border-t pt-2 pb-3">
          <div className="flex space-x-1 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center space-y-1 px-3 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
