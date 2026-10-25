import { useCallback, useState, type ReactNode } from 'react'
import { ConfirmDialog, type ConfirmOptions } from '../components/ui/ConfirmDialog'

type Pending = ConfirmOptions & { resolve: (yes: boolean) => void }

// `const { ask, dialog } = useConfirm()`: render `{dialog}` once, then `if (await ask({ ... })) ...` where window.confirm was.
export function useConfirm(): { ask: (options: ConfirmOptions) => Promise<boolean>; dialog: ReactNode } {
  const [pending, setPending] = useState<Pending | null>(null)
  const ask = useCallback((options: ConfirmOptions) => new Promise<boolean>((resolve) => setPending({ ...options, resolve })), [])
  const dialog = pending ? (
    <ConfirmDialog
      {...pending}
      onAnswer={(yes) => {
        pending.resolve(yes)
        setPending(null)
      }}
    />
  ) : null
  return { ask, dialog }
}
