function mockDatum (datum) {
  const keys = Object.keys(datum);
  const newDatum = { ...datum };
  keys.forEach((key) => {
    if (typeof datum[key] === 'number') {
      const number = Math.max(datum[key], 3);
      const newValue = Math.max(0, number + ((Math.random() * number) - (number / 2)));
      newDatum[key] = Math.floor(newValue);
    }
  });
  return newDatum;
}

export default function mockData (data) {
  return data.map((datum) => {
    return mockDatum(datum);
  });
}
