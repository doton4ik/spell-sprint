import { useState } from 'react'
import { Icon } from './icons/Icon'
import { WordReportPanel, type ReportedWord } from './WordReportPanel'
import { ModalOverlay } from './ui/ModalOverlay'
import { setWordHidden } from '../services/libraryPrefs'

// A small "Report" button for word lists (sprint results, review queue, my mistakes): opens the
// report panel over the page. Hiding works for any id, built-in, own or an older practice task.
export function ReportWordButton({
  word,
  className = 'quiet-action word-hide',
  size = 13,
  onHidden,
}: {
  word: ReportedWord
  className?: string
  size?: number
  onHidden?: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        className={className}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        title="Tell us this word is strange, not worth learning or wrong"
      >
        <Icon name="flag" size={size} /> Report
      </button>
      {open ? (
        <ModalOverlay label={`Report “${word.word}”`} onClose={() => setOpen(false)}>
          <WordReportPanel
            word={word}
            onCancel={() => setOpen(false)}
            onDone={(hide) => {
              setOpen(false)
              if (hide) {
                setWordHidden(word.wordId, true)
                onHidden?.()
              }
            }}
          />
        </ModalOverlay>
      ) : null}
    </>
  )
}
