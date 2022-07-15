import colorContrast from 'color-contrast';

export const getHighestContrast = (baseColor: string, comparisonColors: string[]) => {
  let maxContrast = -1;
  let maxContrastIndex = 0;
  comparisonColors.map((color, index) => {
    let currentContrast = colorContrast(baseColor, color);
    if (currentContrast > maxContrast) {
      maxContrast = currentContrast;
      maxContrastIndex = index;
    }
  })

  return comparisonColors[maxContrastIndex];
}