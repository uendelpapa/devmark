import { Link } from '@tanstack/react-router'
import { ArrowLeft } from '@gravity-ui/icons'

export function NotFound() {
  return (
    <div className="min-h-screen w-full bg-backpage flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm max-w-md w-full flex flex-col items-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl font-black text-gray-300">404</span>
        </div>
        
        <h1 className="text-2xl font-bold text-secondary mb-2">Página não encontrada</h1>
        <p className="text-gray-500 mb-8">
          A página que você está procurando não existe, foi movida ou está temporariamente indisponível.
        </p>
        
        <Link 
          to="/" 
          className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-full font-medium hover:bg-secondary-light transition-colors"
        >
          <ArrowLeft width={16} height={16} />
          Voltar para o Início
        </Link>
      </div>
    </div>
  )
}
