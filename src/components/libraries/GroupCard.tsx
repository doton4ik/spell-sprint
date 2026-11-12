import { Icon } from '../icons/Icon'
import { wordsForGroup, type LibraryGroup } from '../../services/libraryGroups'
import { getEveryLibrary, isBaseLibrary } from '../../services/libraryStorage'
import { filterShownWords, isViewFilterActive, type LibraryViewFilter } from '../../services/libraryViewFilter'
import type { LibraryWord, WordLibrary } from '../../types/library'

export function GroupCard({
  group,
  libraries,
  viewFilter,
  hidden,
  asTopic,
  onDeleteTopic,
  onSetHidden,
  onOpen,
  onPractice,
}: {
  group: LibraryGroup
  libraries: WordLibrary[]
  viewFilter: LibraryViewFilter
  hidden: boolean
  asTopic?: boolean // a card for one topic of a section: it has no Hide of its own
  onDeleteTopic?: () => void // takes the topic out of the Library lists (the words stay in the app)
  onSetHidden: (hide: boolean) => void
  onOpen: (group: LibraryGroup) => void
  onPractice: (words: LibraryWord[], label: string) => void
}) {
  // A hidden group has no words among the active libraries: count them from the base library.
  const allGroupWords = wordsForGroup(group, hidden ? getEveryLibrary().filter(isBaseLibrary) : libraries)
  const words = hidden ? allGroupWords : filterShownWords(allGroupWords, viewFilter)
  const topics = new Set(words.map((word) => word.topic))
  // Everything in this card is switched off in the view filter: leave the card out.
  if (!hidden && isViewFilterActive(viewFilter) && words.length === 0 && allGroupWords.length > 0) return null
  if (hidden)
    return (
      <article className="group-card group-card--hidden">
        <span className="group-card__eyebrow">Hidden — not in practice</span>
        <h2>{group.name}</h2>
        <p>{words.length} words are out of practice, the daily plan and Topics. Your history with them is kept.</p>
        <div className="group-card__actions">
          <button className="check-button" type="button" onClick={() => onSetHidden(false)}>
            Show this library
          </button>
        </div>
      </article>
    )
  return (
    <article className="group-card">
      <span className="group-card__eyebrow">{asTopic ? 'Topic' : 'Vocabulary group'}</span>
      <h2>{group.name}</h2>
      {asTopic ? null : <p>{group.description}</p>}
      <div className="group-card__stats">
        <strong>
          {words.length}
          <small>words</small>
        </strong>
        {asTopic ? null : (
          <strong>
            {topics.size}
            <small>topics</small>
          </strong>
        )}
      </div>
      <div className="group-card__actions">
        <button className="outline-action" type="button" onClick={() => onOpen(group)}>
          Open <Icon name="arrow" size={16} />
        </button>
        <button className="outline-action" type="button" onClick={() => onPractice(words, group.name)}>
          Practise
        </button>
        {asTopic && onDeleteTopic ? (
          <button className="quiet-button" type="button" onClick={onDeleteTopic}>
            Delete
          </button>
        ) : null}
        {group.id === 'professional' || asTopic ? null : (
          <button className="quiet-button" type="button" onClick={() => onSetHidden(true)}>
            Hide
          </button>
        )}
      </div>
    </article>
  )
}
