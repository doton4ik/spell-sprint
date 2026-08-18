import type { WordLibrary } from '../../types/library'
import { Icon } from '../icons/Icon'

export function LibraryCard({ library }: { library: WordLibrary }) {
  const examples = library.words.slice(0, 4)
  return (
    <article className="library-card">
      <div className="library-card__top"><span className="library-icon"><Icon name="library" size={18} /></span><span className={`library-source library-source--${library.source}`}>{library.source === 'built-in' ? 'Built in' : 'Imported'}</span></div>
      <span className="library-topic">{library.topic}</span><h2>{library.name}</h2><p>{library.words.length} words · priority vocabulary for active recall</p>
      <div className="library-word-list">{examples.map((word) => <span key={word.id}><strong>{word.word}</strong><small>{word.translation}</small></span>)}</div>
      <a href="#practice">Practice this library <Icon name="arrow" size={16} /></a>
    </article>
  )
}
