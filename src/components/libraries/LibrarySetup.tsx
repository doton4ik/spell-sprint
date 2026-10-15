import { useState } from 'react'
import { Icon } from '../icons/Icon'
import { libraryPacks } from '../../data/libraryPacks'
import { libraryGroups, wordsForGroup } from '../../services/libraryGroups'
import { getHiddenWordIds, hideKey, isPackEnabled, markLibrarySetupDone, setPackEnabled, setWordHidden } from '../../services/libraryPrefs'
import { getEveryLibrary, isBaseLibrary } from '../../services/libraryStorage'
import '../../pages/libraries.css'

// The first-run (and later "tune my library") choice: which parts of the vocabulary this learner studies.
// Unchecked groups are hidden (not deleted), packs are switched on or off. Everything can be changed in Libraries.
const choosable = libraryGroups.filter((group) => !group.personal && group.id !== 'all' && group.id !== 'professional')

export function LibrarySetup({ onDone, title = 'Set up your library' }: { onDone: () => void; title?: string }) {
  const everyLibrary = getEveryLibrary()
  const hidden = getHiddenWordIds()
  const [groups, setGroups] = useState<Set<string>>(
    () => new Set(choosable.filter((group) => !hidden.has(hideKey.group(group.id))).map((group) => group.id)),
  )
  const [packs, setPacks] = useState(() => new Set(libraryPacks.filter((pack) => isPackEnabled(pack.id)).map((pack) => pack.id)))
  const flip = (set: Set<string>, id: string) => {
    const next = new Set(set)
    if (!next.delete(id)) next.add(id)
    return next
  }
  const [initial] = useState(() => ({ groups, packs }))
  const none = groups.size === 0 && packs.size === 0

  function save() {
    // Only what the learner changed in this panel is written: a new device may still be waiting for the cloud copy,
    // and a fresh timestamp on every flag would overwrite the choices already saved in the account.
    for (const group of choosable)
      if (groups.has(group.id) !== initial.groups.has(group.id)) setWordHidden(hideKey.group(group.id), !groups.has(group.id))
    for (const pack of libraryPacks) if (packs.has(pack.id) !== initial.packs.has(pack.id)) setPackEnabled(pack.id, packs.has(pack.id))
    markLibrarySetupDone()
    onDone()
  }
  function skip() {
    markLibrarySetupDone()
    onDone()
  }

  return (
    <section className="library-setup" aria-label={title}>
      <h2>{title}</h2>
      <p>
        Choose what you want to learn. Only these words appear in practice and in your daily plan. You can change this any time in
        Libraries.
      </p>
      <div className="library-setup__list">
        {choosable.map((group) => {
          const count = wordsForGroup(
            group,
            everyLibrary.filter((library) => isBaseLibrary(library)),
          ).length
          return (
            <label className="library-setup__option" key={group.id}>
              <input type="checkbox" checked={groups.has(group.id)} onChange={() => setGroups(flip(groups, group.id))} />
              <span>
                <strong>{group.name}</strong>
                <small>
                  {group.description} {count} words.
                </small>
              </span>
            </label>
          )
        })}
        {libraryPacks.map((pack) => {
          const count = new Set(
            everyLibrary
              .filter((library) => pack.libraries.includes(library.name))
              .flatMap((library) => library.words.map((word) => word.wordId)),
          ).size
          return (
            <label className="library-setup__option" key={pack.id}>
              <input type="checkbox" checked={packs.has(pack.id)} onChange={() => setPacks(flip(packs, pack.id))} />
              <span>
                <strong>{pack.name}</strong>
                <small>
                  {pack.description} {count} words.
                </small>
              </span>
            </label>
          )
        })}
      </div>
      <div className="library-setup__actions">
        <button className="check-button" type="button" disabled={none} onClick={save}>
          <Icon name="check" size={16} /> Save my library
        </button>
        <button className="quiet-button" type="button" onClick={skip}>
          Skip, keep everything as it is
        </button>
      </div>
    </section>
  )
}
