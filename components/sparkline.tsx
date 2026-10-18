import { useId } from 'react'
import { cn } from '@/lib/utils'

interface SparklineProps {
  data: number[]
  positive: boolean
  className?: string
}

const WIDTH = 96
const HEIGHT = 32

export function Sparkline({ data, positive, className }: SparklineProps) {
  const gradientId = `spark-${useId().replace(/:/g, '')}`
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * WIDTH
      const y = HEIGHT - 2 - ((value - min) / range) * (HEIGHT - 4)
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      aria-hidden="true"
      className={cn(positive ? 'text-gain' : 'text-loss', className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${HEIGHT} ${points} ${WIDTH},${HEIGHT}`} fill={`url(#${gradientId})`} />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
