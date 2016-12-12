import React from 'react';
import renderer from 'react-test-renderer';
import Chart from '../src/Chart';


describe('Chart.js', () => {
  it('should take proper html items and render them out', () => {
    const Fake = (props) => {
      return <path mask={ props.chartData } />;
    };
    const tree = renderer.create(
      <Chart data={ [] } style={{ backgroundColor: 'red' }} className="my-class">
        <Fake />
      </Chart>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should convert width and height to styles', () => {
    const tree = renderer.create(
      <Chart data={ [] } style={{ backgroundColor: 'red' }} width={ 999 } height={ 555 } />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should convert width and height percentages when strings', () => {
    const tree = renderer.create(
      <Chart data={ [] } style={{ backgroundColor: 'red' }} width="100%" height="55%" />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
