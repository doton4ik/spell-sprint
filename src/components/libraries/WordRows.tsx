import { useState } from 'react'
import { Icon } from '../icons/Icon'
import { ModalOverlay } from '../ui/ModalOverlay'
import { WordReportPanel } from '../WordReportPanel'
import { getWordNote } from '../../services/libraryPrefs'
import { isWordShown, type LibraryViewFilter } from '../../services/libraryViewFilter'
import { setPendingRuleFocus } from '../../services/rulesService'
import type { WordHit } from '../../services/wordSearch'
import type { LibraryWord } from '../../types/library'
import type { Rule } from '../../types/rules'

export function HideButton({ word, onHide }: { word: LibraryWord; onHide: (word: LibraryWord) => void }) {
  const [reporting, setReporting] = useState(false)
  return (
    <>
      <button
        className="quiet-action word-hide"
        type="button"
        onClick={() => onHide(word)}
        title="Remove this word from your practice. You can restore it in My Libraries."
      >
        <Icon name="eye" size={13} /> Hide
      </button>
      <button
        className="quiet-action word-hide"
        type="button"
        onClick={() => setReporting(!reporting)}
        aria-expanded={reporting}
        title="Tell us this word is strange, not worth learning or wrong"
      >
        <Icon name="flag" size={13} /> Report
      </button>
      {reporting ? (
        <ModalOverlay label={`Report “${word.word}”`} onClose={() => setReporting(false)}>
          <WordReportPanel
            word={{ wordId: word.wordId, word: word.word, translation: word.translation, library: word.library }}
            onCancel={() => setReporting(false)}
            onDone={(hide) => {
              setReporting(false)
              if (hide) onHide(word)
            }}
          />
        </ModalOverlay>
      ) : null}
    </>
  )
}

export function WordNoteLine({ wordId }: { wordId: string }) {
  const note = getWordNote(wordId)
  return note ? (
    <small className="word-note-line">
      <strong>Your tip:</strong> {note}
    </small>
  ) : null
}

function goToRule(rule: Rule) {
  setPendingRuleFocus(rule.id)
  window.location.hash = 'rules'
}

export function RuleChips({ rules }: { rules?: Rule[] }) {
  if (!rules?.length) return null
  return (
    <div className="word-rule-chips">
      {rules.map((rule) => (
        <button type="button" className="word-rule-chip" onClick={() => goToRule(rule)} key={rule.id}>
          <Icon name="rules" size={12} /> {rule.title}
        </button>
      ))}
    </div>
  )
}

export function SearchRow({
  hit,
  filter,
  ruleMap,
  onOpen,
  onPractise,
  onHide,
}: {
  hit: WordHit
  filter: LibraryViewFilter
  ruleMap: Map<string, Rule[]>
  onOpen: (word: LibraryWord) => void
  onPractise: (words: LibraryWord[], label: string) => void
  onHide: (word: LibraryWord) => void
}) {
  const word = hit.word
  return (
    <article className="word-row">
      <div>
        <h3>{word.word}</h3>
        <p>{word.translation}</p>
        {word.example ? <small>{word.example}</small> : null}
        <WordNoteLine wordId={word.wordId} />
        <RuleChips rules={ruleMap.get(word.wordId)} />
      </div>
      <aside>
        <span>{word.topic}</span>
        {word.subtopic ? <span>{word.subtopic}</span> : null}
        {isWordShown(word, filter) ? null : <span className="word-row__filtered">hidden in the lists by your filter</span>}
        <div className="word-row__actions">
          <button className="quiet-action" type="button" onClick={() => onOpen(word)}>
            Open library
          </button>
          <button className="quiet-action" type="button" onClick={() => onPractise([word], word.word)}>
            <Icon name="practice" size={13} /> Practise
          </button>
          <HideButton word={word} onHide={onHide} />
        </div>
      </aside>
    </article>
  )
}
