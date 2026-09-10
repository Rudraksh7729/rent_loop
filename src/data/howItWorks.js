import { Search, CalendarCheck, RefreshCcw, PackagePlus } from 'lucide-react'

export const renterSteps = [
  {
    id: 'find',
    title: 'Find nearby',
    description: 'Search cameras, tools, and gear listed by people around you.',
    icon: Search,
  },
  {
    id: 'book',
    title: 'Book & pick up',
    description: 'Choose dates, confirm with the owner, and collect the item.',
    icon: CalendarCheck,
  },
  {
    id: 'return',
    title: 'Use & return',
    description: 'Enjoy the rental, return on time, and leave a quick review.',
    icon: RefreshCcw,
  },
]

export const ownerSteps = [
  {
    id: 'list',
    title: 'List an item',
    description: 'Add photos, set a daily price, and mark when it is free.',
    icon: PackagePlus,
  },
]
