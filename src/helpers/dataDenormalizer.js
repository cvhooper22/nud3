export default function dataDenormalizer (data, xKey, yKey) {
  return (data || []).map((datum) => {
    return {
      xValue: datum[xKey],
      yValue: datum[yKey],
    };
  });
}
