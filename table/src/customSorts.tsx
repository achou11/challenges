import { Row } from './Table/types'

export const customDateSort = (rows: Row[], field: string, direction: 'asc' | 'desc') => {
  return rows.sort((prev: Row, next: Row) => {
    const prevValue = prev.data[field]
    const nextValue = next.data[field]
    if (prevValue && nextValue) {
      const prevDate = new Date(prevValue)
      const nextDate = new Date(nextValue)
      if (direction === 'asc') {
        return prevDate <= nextDate ? -1 : 1
      }
      return nextDate <= prevDate ? -1 : 1
    }
    return 0
  })
}
