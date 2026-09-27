import type { PropsWithChildren } from 'react'

type SectionHeaderProps = PropsWithChildren<{
  eyebrow?: string
  title: string
  action?: string
  actionHref?: string
}>

export function SectionHeader({ eyebrow, title, action, actionHref = '#dashboard', children }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {action ? <a className="text-action" href={actionHref}>{action}</a> : children}
    </div>
  )
}

