import dataDenormalizer from '../../src/helpers/dataDenormalizer';

it('takes an array', function () {
  expect(dataDenormalizer([])).toEqual([]);
});
