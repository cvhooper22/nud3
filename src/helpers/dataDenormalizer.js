export default function dataDenormalizer (data, xKey, yKey) {
  return (data || []).map((datum) => {
    return {
      xKey,
      yKey,
      xValue: datum[xKey],
      yValue: datum[yKey],
      original: datum,
    };
  });
}
