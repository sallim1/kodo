import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

export function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <Button
      type="submit"
      className="h-11 w-full bg-linear-to-r from-brand-blue to-brand-violet text-base font-semibold text-white shadow-lg shadow-brand-violet/25 hover:brightness-110"
    >
      {children}
    </Button>
  )
}
