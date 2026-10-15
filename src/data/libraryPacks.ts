// Optional add-on packs. Every built-in library that is not listed here belongs to the base library,
// which everyone gets. A pack is switched on per learner in Libraries → Add-on packs.
export type LibraryPack = {
  id: string
  name: string
  description: string
  libraries: string[] // built-in library names, as in the "library" column of the CSV
}

// Business, office and sport are ordinary topics now; only the narrow professional vocabulary stays an add-on.
export const libraryPacks: LibraryPack[] = [
  {
    id: 'logistics',
    name: 'Logistics and Trade',
    description: 'Warehouse, stock, shipping, supply chain, import, export and freight.',
    libraries: ['Logistics and Trade'],
  },
]

export function packForLibrary(libraryName: string) {
  return libraryPacks.find((pack) => pack.libraries.includes(libraryName))
}
