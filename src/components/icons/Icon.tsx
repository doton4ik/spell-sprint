import type { ReactNode } from 'react'
import type { IconName } from '../../types/dashboard'

type IconProps = {
  name: IconName
  size?: number
  strokeWidth?: number
}

const paths: Record<IconName, ReactNode> = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  practice: <><path d="M4 19.5V4.7a1.7 1.7 0 0 1 2.5-1.5l11.8 6.7a1.7 1.7 0 0 1 0 3L6.5 19.6A1.7 1.7 0 0 1 4 18.1Z" /></>,
  mistakes: <><circle cx="12" cy="12" r="8.5" /><path d="m9 9 6 6m0-6-6 6" /></>,
  rules: <><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17.5a2.5 2.5 0 0 0-2.5-2.5H5Z" /><path d="M5 4.5v15A2.5 2.5 0 0 0 7.5 22H20" /><path d="M9 7h7m-7 4h7" /></>,
  topics: <><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5c2.3 2.3 3.4 5.2 3.4 8.5S14.3 18.2 12 20.5c-2.3-2.3-3.4-5.2-3.4-8.5S9.7 5.8 12 3.5ZM3.8 12h16.4" /></>,
  analysis: <><path d="M4 19.5V4.5M4 19.5h16" /><path d="m7.5 15 3-4 3 2.1 4-6.1" /><circle cx="17.5" cy="7" r="1" fill="currentColor" stroke="none" /></>,
  library: <><path d="M5 3.5h10.5A2.5 2.5 0 0 1 18 6v14H7.5A2.5 2.5 0 0 1 5 17.5Z" /><path d="M5 17.5A2.5 2.5 0 0 1 7.5 15H18M8.5 7h6m-6 4h6" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.1 2.1-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-3v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.1-2.1.1-.1A1.7 1.7 0 0 0 7 15a1.7 1.7 0 0 0-1.5-1H5.3v-3h.2A1.7 1.7 0 0 0 7 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.1-2.1.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2h3v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.1 2.1-.1.1A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.5 1h.2v3h-.2a1.7 1.7 0 0 0-1.5 1Z" /></>,
  arrow: <path d="M5 12h13m-5-5 5 5-5 5" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18" /></>,
  bolt: <path d="m13 2-9 12h7l-1 8 9-12h-7Z" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  check: <path d="m5 12 4.2 4.2L19 6.5" />,
  eye: <><path d="M2.8 12s3.2-5 9.2-5 9.2 5 9.2 5-3.2 5-9.2 5-9.2-5-9.2-5Z" /><circle cx="12" cy="12" r="2" /></>,
  lightbulb: <><path d="M9 18h6m-5 3h4m4-11a6 6 0 1 0-12 0c0 2.2 1.2 3.4 2.4 4.5.7.7 1 1.4 1 2.5h5.2c0-1.1.3-1.8 1-2.5C16.8 13.4 18 12.2 18 10Z" /></>,
  shuffle: <><path d="m16 3 3 3-3 3M4 7h2c3.2 0 4.6 8 7.8 8H19" /><path d="m16 15 3 3-3 3M4 17h2c1.1 0 2.1-1 3-2.3" /></>,
  skip: <><path d="m5 5 9 7-9 7Z" /><path d="M18 5v14" /></>,
  refresh: <><path d="M20 12a8 8 0 1 1-2.3-5.7" /><path d="M20 4v5h-5" /></>,
  sliders: <><path d="M4 7h9m3 0h4M4 17h4m3 0h9" /><circle cx="14" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>,
  volume: <><path d="M4 10v4h4l5 4V6L8 10Z" /><path d="M16 9.2a4 4 0 0 1 0 5.6m2.5-8.1a7.5 7.5 0 0 1 0 10.6" /></>,
}

export function Icon({ name, size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}
