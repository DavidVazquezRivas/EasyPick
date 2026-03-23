export const toRgba = (hex: string, alpha: number) => {
  const normalizedHex = hex.replace('#', '')
  const isShortHex = normalizedHex.length === 3

  if (!(normalizedHex.length === 6 || isShortHex)) {
    return hex
  }

  const fullHex =
    isShortHex ?
      normalizedHex
        .split('')
        .map((char) => `${char}${char}`)
        .join('')
    : normalizedHex

  const red = Number.parseInt(fullHex.slice(0, 2), 16)
  const green = Number.parseInt(fullHex.slice(2, 4), 16)
  const blue = Number.parseInt(fullHex.slice(4, 6), 16)

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}
