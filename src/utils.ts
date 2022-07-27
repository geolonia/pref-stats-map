export const formatPref = (records: Array<any>) => {

  records = Object.entries(records[0]).map(([key, value]) => {
    return {
      name: key,
      // @ts-ignore
      data: parseInt(value.replace(/,/g, '')),
    }
  })

  // データの小さい順に並び替え
  // @ts-ignore
  records.sort((a, b) => {

    if (a.data > b.data) {
      return 1
    }
    if (a.data < b.data) {
      return -1
    }
    return 0
  })

  return records;
}

// get max and min and 75% and 50%, and 25%
export const getPercentage = (max: number, min: number) => {
  const diff = max - min;
  const quarter = diff / 4;
  const half = diff / 2;
  const threeQuarter = 3 * quarter;
  return {
    min: Math.round(min),
    quarter: Math.round(min + quarter),
    half: Math.round(min + half),
    threeQuarter: Math.round(min + threeQuarter),
    max: Math.round(max),
  }
}

export const getColor = (data: number, { min, quarter, half, threeQuarter, max }: any, colorPalette: Array<string>) => {

  if (data < quarter) {
    return colorPalette[3];
  }
  if (data < half) {
    return colorPalette[2];
  }
  if (data < threeQuarter) {
    return colorPalette[1];
  }

  return colorPalette[0];
}
