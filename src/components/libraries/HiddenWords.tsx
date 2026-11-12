import { Icon } from '../icons/Icon'
import { getHiddenWordIds } from '../../services/libraryPrefs'
import { getEveryWord } from '../../services/libraryStorage'
import type { LibraryWord, WordLibrary } from '../../types/library'

// The words the learner hid, as one card like a library: open it to see them and bring them back.
export function HiddenWords({
  libraries,
  onOpen,
  onRestoreAll,
}: {
  libraries: WordLibrary[]
  onOpen: (words: LibraryWord[]) => void
  onRestoreAll: (words: LibraryWord[]) => void
}) {
  void libraries // re-render after a change
  const hidden = getHiddenWordIds()
  const words = getEveryWord().filter((word) => hidden.has(word.wordId))
  if (!words.length) return null
  return (
    <section className="hidden-words">
      <div>
        <h2>
          Hidden words <small>{words.length}</small>
        </h2>
        <p>These words do not appear in practice or in your daily plan.</p>
      </div>
      <div className="hidden-words__actions">
        <button className="outline-action" type="button" onClick={() => onOpen(words)}>
          Open <Icon name="arrow" size={16} />
        </button>
        <button className="quiet-button" type="button" onClick={() => onRestoreAll(words)}>
          Restore all
        </button>
      </div>
    </section>
  )
}
