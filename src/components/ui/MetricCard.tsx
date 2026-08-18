import type { Metric } from '../../types/dashboard'
import { Icon } from '../icons/Icon'

export function MetricCard({ metric }: { metric: Metric }) {
  return (
    <article className={`metric-card metric-card--${metric.tone}`}>
      <div className="metric-card__top">
        <span>{metric.label}</span>
        <span className="metric-card__icon"><Icon name={metric.icon} size={18} /></span>
      </div>
      <strong className="metric-card__value">{metric.value}</strong>
      <p>{metric.note}</p>
    </article>
  )
}

