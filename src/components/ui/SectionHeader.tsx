import type { PropsWithChildren } from 'react'

type SectionHeaderProps = PropsWithChildren<{
  eyebrow?: string
  title: string
  action?: string
}>

export function SectionHeader({ eyebrow, title, action, children }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {action ? <a className="text-action" href="#dashboard">{action}</a> : children}
    </div>
  )
}

