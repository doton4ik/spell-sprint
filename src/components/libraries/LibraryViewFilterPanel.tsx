import { cefrLevels, librarySections, libraryTopics } from '../../data/libraryTopics'
import { emptyViewFilter, isViewFilterActive, toggleInList, type LibraryViewFilter } from '../../services/libraryViewFilter'

// Switches levels, sections and topics on and off for the Library lists. Checked = shown.
export function ViewFilterToggle({ filter, open, onToggle }: { filter: LibraryViewFilter; open: boolean; onToggle: () => void }) {
  return (
    <button className="template-button" type="button" aria-expanded={open} onClick={onToggle}>
      Levels and topics{isViewFilterActive(filter) ? ' · on' : ''}
    </button>
  )
}

export function LibraryViewFilterPanel({ filter, onChange }: { filter: LibraryViewFilter; onChange: (filter: LibraryViewFilter) => void }) {
  const active = isViewFilterActive(filter)
  return (
    <section className="view-filter" aria-label="Show or hide levels and topics">
      <h2 className="view-filter__title">Show or hide levels and topics</h2>
      <div className="view-filter__body">
        <div className="view-filter__row">
          <span className="view-filter__label">Levels</span>
          {cefrLevels.map((level) => {
            const shown = !filter.levels.includes(level)
            return (
              <button
                type="button"
                className={`view-filter__chip${shown ? ' view-filter__chip--on' : ''}`}
                aria-pressed={shown}
                onClick={() => onChange({ ...filter, levels: toggleInList(filter.levels, level) })}
                key={level}
              >
                {shown ? '✓ ' : ''}
                {level}
              </button>
            )
          })}
        </div>
        {librarySections.map((section) => {
          const sectionShown = !filter.sections.includes(section.id)
          return (
            <fieldset className="view-filter__section" key={section.id}>
              <label className="view-filter__check view-filter__check--section">
                <input
                  type="checkbox"
                  checked={sectionShown}
                  onChange={() => onChange({ ...filter, sections: toggleInList(filter.sections, section.id) })}
                />
                {section.name}
              </label>
              <div className="view-filter__topics">
                {libraryTopics
                  .filter((topic) => topic.section === section.id)
                  .map((topic) => (
                    <label className="view-filter__check" key={topic.id}>
                      <input
                        type="checkbox"
                        checked={sectionShown && !filter.topics.includes(topic.name)}
                        disabled={!sectionShown}
                        onChange={() => onChange({ ...filter, topics: toggleInList(filter.topics, topic.name) })}
                      />
                      {topic.name}
                    </label>
                  ))}
              </div>
            </fieldset>
          )
        })}
        <button type="button" className="quiet-button" disabled={!active} onClick={() => onChange(emptyViewFilter())}>
          Show everything again
        </button>
      </div>
    </section>
  )
}
