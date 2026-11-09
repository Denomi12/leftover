export function scrollWithin(element: Element | null, containerSelector: string, axis: 'x' | 'y') {
  const container = element?.parentElement?.closest(containerSelector);
  if (!element || !container) return;

  const itemRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  if (axis === 'x') {
    const offset = itemRect.left - containerRect.left - (containerRect.width - itemRect.width) / 2;
    container.scrollBy({ left: offset, behavior: 'smooth' });
    return;
  }

  if (itemRect.top < containerRect.top) {
    container.scrollBy({ top: itemRect.top - containerRect.top - 8, behavior: 'smooth' });
  } else if (itemRect.bottom > containerRect.bottom) {
    container.scrollBy({ top: itemRect.bottom - containerRect.bottom + 8, behavior: 'smooth' });
  }
}
