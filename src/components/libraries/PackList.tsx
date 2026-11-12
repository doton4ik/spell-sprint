import { libraryPacks, wordsOfPack, type LibraryPack } from '../../data/libraryPacks'
import { isPackEnabled } from '../../services/libraryPrefs'
import { getEveryLibrary } from '../../services/libraryStorage'
import type { WordLibrary } from '../../types/library'

export function PackList({
  libraries,
  onToggle,
  onPreview,
}: {
  libraries: WordLibrary[]
  onToggle: (pack: LibraryPack, on: boolean) => void
  onPreview: (pack: LibraryPack) => void
}) {
  const every = getEveryLibrary()
  const activeNames = new Set(libraries.map((library) => library.name))
  return (
    <section className="pack-list">
      <p className="pack-list__intro">
        The base library covers everyday English. Add a pack when you need the words of a special field, or the rare words most learners
        leave for later: its words join practice, the daily plan and Topics. Removing a pack keeps your history.
      </p>
      {libraryPacks.map((pack) => {
        const words = wordsOfPack(pack, every)
        if (!words.length) return null
        // a pack of single words has no library of its own to look for: its switch says whether it is on
        const on = pack.wordIds ? isPackEnabled(pack.id) : pack.libraries.some((name) => activeNames.has(name))
        return (
          <article className={`pack-card${on ? ' pack-card--on' : ''}`} key={pack.id}>
            <div>
              <span className="pack-card__eyebrow">{on ? 'In your library' : 'Add-on pack'}</span>
              <h2>{pack.name}</h2>
              <p>{pack.description}</p>
              <div className="group-card__examples">
                {words.slice(0, 6).map((word) => (
                  <span key={word.wordId}>{word.word}</span>
                ))}
              </div>
            </div>
            <div className="pack-card__actions">
              <strong>
                {words.length}
                <small>words</small>
              </strong>
              <button className="template-button" type="button" onClick={() => onPreview(pack)}>
                Preview
              </button>
              {on ? (
                <button className="quiet-button" type="button" onClick={() => onToggle(pack, false)}>
                  Remove
                </button>
              ) : (
                <button className="check-button" type="button" onClick={() => onToggle(pack, true)}>
                  Add
                </button>
              )}
            </div>
          </article>
        )
      })}
    </section>
  )
}
