import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

// COMPONENTS
import { NewMemoryForm } from '@/components/NewMemoryForm'

// NEW MEMORY PAGE
export default function NewMemory() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-16">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar à timeline
      </Link>

      <NewMemoryForm />
    </div>
  )
}
