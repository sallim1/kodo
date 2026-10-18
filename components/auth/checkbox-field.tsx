'use client'

import { AlertCircle } from 'lucide-react'
import { useId, type ReactNode } from 'react'

type CheckboxFieldProps = {
  name: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  error?: string
  children: ReactNode
}

export function CheckboxField({ name, checked, onCheckedChange, error, children }: CheckboxFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-0.5 size-4 shrink-0 cursor-pointer rounded accent-brand-violet outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
        <label htmlFor={id} className="text-sm leading-snug text-muted-foreground">
          {children}
        </label>
      </div>
      {error ? (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  )
}
