// Optional add-on packs. Every built-in library that is not listed here belongs to the base library,
// which everyone gets. A pack is switched on per learner in Libraries → Add-on packs.
export type LibraryPack = {
  id: string
  name: string
  description: string
  libraries: string[] // built-in library names, as in the "library" column of the CSV
}

export const libraryPacks: LibraryPack[] = [
  {
    id: 'logistics',
    name: 'Logistics and Warehouse',
    description: 'Supply chain, inventory, SAP warehouse processes and road freight.',
    libraries: ['Supply Chain Core', 'Warehouse Operations — SAP', 'Transport and Trade — Road Freight', 'Shared — Inventory Fundamentals'],
  },
  {
    id: 'business-office',
    name: 'Business and Office',
    description: 'Finance, planning, meetings and negotiation at work.',
    libraries: ['Business and Office Core'],
  },
  {
    id: 'sport-fitness',
    name: 'Sport and Fitness',
    description: 'Training, competitions, health and recovery.',
    libraries: ['Sport and Fitness Core'],
  },
]

export function packForLibrary(libraryName: string) {
  return libraryPacks.find((pack) => pack.libraries.includes(libraryName))
}
