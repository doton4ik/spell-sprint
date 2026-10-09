import type { Metric } from '../../types/dashboard'
import { Icon } from '../icons/Icon'
import { InfoTip } from './InfoTip'

export function MetricCard({ metric }: { metric: Metric }) {
  return (
    <article className={`metric-card metric-card--${metric.tone}`}>
      <div className="metric-card__top">
        <span className="metric-card__label">
          {metric.label}
          <InfoTip label={`About “${metric.label}”`}>{metric.note}</InfoTip>
        </span>
        <span className="metric-card__icon">
          <Icon name={metric.icon} size={18} />
        </span>
      </div>
      <strong className="metric-card__value">{metric.value}</strong>
    </article>
  )
}
