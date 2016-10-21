import dataDenormalizer from '../../src/helpers/dataDenormalizer';

describe('dataDenormalizer', function () {
  it('takes an array', function () {
    expect(dataDenormalizer([])).toEqual([]);
  });
  it('maps array by key values', function () {
    const start = [
      { date: '123', value: '345' },
      { date: '987', value: '765' },
    ];
    const denormalized = dataDenormalizer(start, 'date', 'value');
    expect(denormalized.count).toEqual(start.count);
    expect(denormalized[0].xValue).toEqual('123');
    expect(denormalized[0].yValue).toEqual('345');
    expect(denormalized[1].xValue).toEqual('987');
    expect(denormalized[1].yValue).toEqual('765');
  });
  it('maps array by and retains original', function () {
    const start = [
      { date: '123', value: '345' },
      { date: '987', value: '765' },
    ];
    const denormalized = dataDenormalizer(start, 'date', 'value');
    expect(denormalized.count).toEqual(start.count);
    expect(denormalized[0].original).toEqual(start[0]);
    expect(denormalized[1].original).toEqual(start[1]);
  });
});
