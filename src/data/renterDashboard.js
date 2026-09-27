export function getRecommendedItems() {
  return items.filter((item) => item.featured).slice(0, 4)
}
