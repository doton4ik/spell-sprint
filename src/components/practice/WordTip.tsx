import { useState } from 'react'
import { getWordNote, NOTE_LIMIT, setWordNote } from '../../services/libraryPrefs'
import { Icon } from '../icons/Icon'

// The learner's own memory tip for a word, shown after each answer. Written by the learner, because
// a trick you invent yourself sticks better than a ready-made one.
export function WordTip({ wordId, wrong }: { wordId: string; wrong: boolean }) {
  const [note, setNote] = useState(() => getWordNote(wordId))
  const [draft, setDraft] = useState(note)
  const [editing, setEditing] = useState(false)

  // Not a <form>: the tip sits inside the answer form, and a nested form would submit the answer.
  function save() {
    setWordNote(wordId, draft); setNote(draft.trim().slice(0, NOTE_LIMIT)); setEditing(false)
  }

  if (editing) {
    return <div className="word-tip word-tip--editing">
      <label>How will you remember it?<input autoFocus value={draft} maxLength={NOTE_LIMIT} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); save() } }} placeholder="e.g. accoMModation — two Cots, two Mattresses" /></label>
      <div><button className="check-button" type="button" onClick={save}>Save tip</button><button className="quiet-button" type="button" onClick={() => { setDraft(note); setEditing(false) }}>Cancel</button>{note ? <button className="quiet-button" type="button" onClick={() => { setWordNote(wordId, ''); setNote(''); setDraft(''); setEditing(false) }}>Delete</button> : null}<small>{draft.length}/{NOTE_LIMIT}</small></div>
    </div>
  }
  if (note) return <p className="word-tip"><Icon name="lightbulb" size={15} /><span><strong>Your tip:</strong> {note}</span><button type="button" onClick={() => setEditing(true)}>Edit</button></p>
  // Offered after a mistake; after a right answer only as a quiet link.
  return <button className={wrong ? 'word-tip-add word-tip-add--wrong' : 'word-tip-add'} type="button" onClick={() => setEditing(true)}><Icon name="lightbulb" size={14} /> {wrong ? 'Write a tip to remember this word' : 'Add a memory tip'}</button>
}
