// What the Library page shows. Only the Library lists and counts use it: practice, the daily plan and
// "Hide word" are separate (see libraryPrefs.ts). It lives on this device only.
import { libraryTopics, type CefrLevel, type LibrarySectionId } from '../data/libraryTopics'
import type { LibraryWord } from '../types/library'

const KEY = 'spell-sprint.library-view-filter'

export type LibraryViewFilter = { levels: CefrLevel[]; sections: LibrarySectionId[]; topics: string[] } // what is hidden

export const emptyViewFilter = (): LibraryViewFilter => ({ levels: [], sections: [], topics: [] })

const sectionOfTopic = new Map<string, LibrarySectionId>(libraryTopics.map((topic) => [topic.name, topic.section]))

export function isViewFilterActive(filter: LibraryViewFilter) {
  return filter.levels.length + filter.sections.length + filter.topics.length > 0
}

export function isWordShown(word: LibraryWord, filter: LibraryViewFilter) {
  if (word.level && filter.levels.includes(word.level)) return false
  if (filter.topics.includes(word.topic)) return false
  const section = sectionOfTopic.get(word.topic)
  return !(section && filter.sections.includes(section))
}

export const filterShownWords = (words: LibraryWord[], filter: LibraryViewFilter) =>
  isViewFilterActive(filter) ? words.filter((word) => isWordShown(word, filter)) : words

export function toggleInList<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item]
}

const strings = (value: unknown): string[] => (Array.isArray(value) ? value.filter((item) => typeof item === 'string') : [])

export function getViewFilter(): LibraryViewFilter {
  try {
    const stored = JSON.parse(window.localStorage.getItem(KEY) ?? 'null') as Partial<Record<keyof LibraryViewFilter, unknown>> | null
    if (!stored) return emptyViewFilter()
    return {
      levels: strings(stored.levels) as CefrLevel[],
      sections: strings(stored.sections) as LibrarySectionId[],
      topics: strings(stored.topics),
    }
  } catch {
    return emptyViewFilter()
  }
}

export function saveViewFilter(filter: LibraryViewFilter) {
  try {
    if (isViewFilterActive(filter)) window.localStorage.setItem(KEY, JSON.stringify(filter))
    else window.localStorage.removeItem(KEY)
  } catch {
    // storage full or blocked: the filter still works until the page is closed
  }
}
