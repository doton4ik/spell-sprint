import { Icon } from '../icons/Icon'
import { ImportLibraryPanel } from './ImportLibraryPanel'
import { hideKey } from '../../services/libraryPrefs'
import type { LibraryWord, WordLibrary } from '../../types/library'

export function MyLibraries({
  libraries,
  hiddenKeys,
  onSetHidden,
  onOpen,
  onPractice,
  onDelete,
  onImported,
}: {
  libraries: WordLibrary[]
  hiddenKeys: Set<string>
  onSetHidden: (library: WordLibrary, hide: boolean) => void
  onOpen: (library: WordLibrary) => void
  onPractice: (words: LibraryWord[], label: string) => void
  onDelete: (library: WordLibrary) => void
  onImported: () => void
}) {
  return (
    <section className="my-libraries">
      <ImportLibraryPanel onImported={onImported} />
      {libraries.length ? (
        <div className="personal-library-list">
          {libraries.map((library) => {
            const hidden = hiddenKeys.has(hideKey.library(library.name))
            return (
              <article className="personal-library" key={library.id}>
                <div>
                  <span>{hidden ? 'Hidden — not in practice' : 'Imported library'}</span>
                  <h2>{library.name}</h2>
                  <p>
                    {library.words.length} words · updated{' '}
                    {library.createdAt
                      ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(library.createdAt))
                      : 'recently'}
                  </p>
                </div>
                <div>
                  <button className="outline-action" type="button" onClick={() => onOpen(library)}>
                    Open
                  </button>
                  {hidden ? null : (
                    <button className="outline-action" type="button" onClick={() => onPractice(library.words, library.name)}>
                      Practise
                    </button>
                  )}
                  <button className="quiet-button" type="button" onClick={() => onSetHidden(library, !hidden)}>
                    {hidden ? 'Show' : 'Hide'}
                  </button>
                  <button className="quiet-button" type="button" onClick={() => onDelete(library)}>
                    Delete
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="libraries-empty">
          <Icon name="library" size={25} />
          <h2>You have no personal libraries yet.</h2>
          <p>Import a CSV library to keep your own vocabulary here.</p>
        </div>
      )}
    </section>
  )
}
