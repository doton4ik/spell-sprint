import { useState, type FormEvent } from 'react'
import { Icon } from '../icons/Icon'
import { addMyWord, getEveryWord, getAllWords, MY_WORDS, myWordId } from '../../services/libraryStorage'
import { guessDifficulty, lookupWord, type LookupSense } from '../../services/wordLookup'
import { partOfSpeechOptions } from '../../types/library'

type Step =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'senses'; senses: LookupSense[] }
  | { kind: 'missing'; message: string }
type Draft = { word: string; translation: string; partOfSpeech: string; definition: string; example: string }

// Type a word → pick the meaning you want → check the translation and example → it joins "My words".
// The learner always chooses the meaning: "fortune" is luck, fate or wealth, and practice shows the
// Russian word, so a silently chosen meaning would teach the wrong thing.
export function AddWordPanel({ onAdded, onPractise }: { onAdded: () => void; onPractise: (wordId: string, word: string) => void }) {
  const [query, setQuery] = useState('')
  const [step, setStep] = useState<Step>({ kind: 'idle' })
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saved, setSaved] = useState<{ wordId: string; word: string; updated: boolean } | null>(null)

  async function search(event: FormEvent) {
    event.preventDefault()
    const word = query.trim()
    if (!word) return
    setDraft(null); setSaved(null); setStep({ kind: 'loading' })
    const result = await lookupWord(word)
    if (result.status === 'found') setStep({ kind: 'senses', senses: result.senses })
    else setStep({ kind: 'missing', message: result.status === 'unavailable' ? `${result.message} You can still add the word yourself.` : `The dictionary has no Russian translation for “${word}”. You can add it yourself.` })
  }

  const choose = (sense: LookupSense | null) => setDraft({
    word: query.trim().toLocaleLowerCase(), translation: sense ? sense.translations.slice(0, 3).join(', ') : '', partOfSpeech: sense?.partOfSpeech || 'noun',
    definition: sense?.definition ?? '', example: sense?.example ?? '',
  })

  function save(event: FormEvent) {
    event.preventDefault()
    if (!draft || !draft.word.trim() || !draft.translation.trim()) return
    const result = addMyWord({ ...draft, ...guessDifficulty(draft.word.trim().toLocaleLowerCase()) })
    setSaved({ wordId: result.wordId, word: draft.word.trim(), updated: result.updated })
    setDraft(null); setStep({ kind: 'idle' }); setQuery('')
    onAdded()
  }

  // The same spelling already in another library: say where, so the learner can decide.
  const typed = query.trim().toLocaleLowerCase()
  const elsewhere = typed ? getEveryWord().find((word) => word.word.toLocaleLowerCase() === typed && word.wordId !== myWordId(typed)) : undefined
  const elsewhereActive = elsewhere ? getAllWords().some((word) => word.wordId === elsewhere.wordId) : false

  return <section className="add-word">
    <div className="add-word__head"><span><Icon name="search" size={15} /> Add a word</span><h2>Learn any English word</h2><p>Type a word — the dictionary suggests its meanings with Russian translations. Pick the one you need; it goes to “{MY_WORDS}” and into practice.</p></div>
    <form className="add-word__search" onSubmit={search}>
      <input value={query} onChange={(event) => { setQuery(event.target.value); if (step.kind !== 'loading') setStep({ kind: 'idle' }); setDraft(null) }} placeholder="e.g. fortune" autoCapitalize="off" autoCorrect="off" spellCheck={false} aria-label="English word" />
      <button className="check-button" type="submit" disabled={!query.trim() || step.kind === 'loading'}>{step.kind === 'loading' ? 'Looking up…' : 'Look up'}</button>
    </form>
    {elsewhere && step.kind !== 'loading' ? <p className="add-word__note">“{elsewhere.word}” is already in {elsewhere.library}{elsewhereActive ? '' : ' (hidden or in a pack that is switched off)'} as “{elsewhere.translation}”. You can still add your own meaning.</p> : null}
    {saved ? <p className="add-word__saved" role="status"><Icon name="check" size={15} /> “{saved.word}” {saved.updated ? 'updated' : 'added'} in {MY_WORDS}. It will appear in practice and in your daily plan.<button type="button" onClick={() => onPractise(saved.wordId, saved.word)}>Practise it now</button></p> : null}

    {step.kind === 'senses' && !draft ? <div className="add-word__senses">
      <p className="add-word__label">Which meaning do you want to learn?</p>
      {step.senses.map((sense, index) => <button type="button" className="add-word__sense" onClick={() => choose(sense)} key={index}>
        <small>{sense.partOfSpeech || 'meaning'} · {sense.gloss}</small>
        <strong>{sense.translations.slice(0, 4).join(', ')}</strong>
        {sense.definition && sense.definition.toLocaleLowerCase() !== sense.gloss.toLocaleLowerCase() ? <span>{sense.definition}</span> : null}
      </button>)}
      <button type="button" className="add-word__manual" onClick={() => choose(null)}>None of these — I will write it myself</button>
      <p className="add-word__credit">Translations and definitions: Wiktionary (CC BY-SA).</p>
    </div> : null}

    {step.kind === 'missing' && !draft ? <div className="add-word__missing"><p>{step.message}</p><button className="outline-action add-word__text-button" type="button" onClick={() => choose(null)}>Enter it myself</button></div> : null}

    {draft ? <form className="add-word__form" onSubmit={save}>
      <label>English<input required value={draft.word} onChange={(event) => setDraft({ ...draft, word: event.target.value })} autoCapitalize="off" spellCheck={false} /></label>
      <label>Russian (what practice will show you)<input required value={draft.translation} onChange={(event) => setDraft({ ...draft, translation: event.target.value })} /></label>
      <label>Part of speech<select value={draft.partOfSpeech} onChange={(event) => setDraft({ ...draft, partOfSpeech: event.target.value })}>{partOfSpeechOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
      <label>Meaning in English (optional)<input value={draft.definition} onChange={(event) => setDraft({ ...draft, definition: event.target.value })} /></label>
      <label>Example sentence (optional)<input value={draft.example} onChange={(event) => setDraft({ ...draft, example: event.target.value })} placeholder="A sentence that uses the word" /></label>
      <div className="add-word__actions"><button className="check-button" type="submit" disabled={!draft.word.trim() || !draft.translation.trim()}><Icon name="check" size={15} /> Add to {MY_WORDS}</button><button className="quiet-button" type="button" onClick={() => setDraft(null)}>Back</button></div>
    </form> : null}
  </section>
}
