import React from 'react';
import renderer from 'react-test-renderer';
import LineChart from '../../src/charts/LineChart';
import {
  chartData,
  yScale,
  xScale,
  valueKeys,
  originalData,
} from '../mockData/chartData';

describe('LineChart.js', () => {
  it('should take stubbed data and do basic rendering', () => {
    const tree = renderer.create(
      <LineChart
        originalData={ originalData }
        chartData={ chartData }
        areaHeight={ 100 }
        areaWidth={ 100 }
        paddingTop={ 0 }
        paddingBottom={ 0 }
        paddingRight={ 0 }
        paddingLeft={ 0 }
        valueKeys={ valueKeys }
        yScale={ yScale }
        xScale={ xScale }
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should take stubbed data repositions based on padding', () => {
    const tree = renderer.create(
      <LineChart
        originalData={ originalData }
        chartData={ chartData }
        areaHeight={ 100 }
        areaWidth={ 100 }
        paddingTop={ 10 }
        paddingBottom={ 10 }
        paddingRight={ 10 }
        paddingLeft={ 10 }
        valueKeys={ valueKeys }
        yScale={ yScale }
        xScale={ xScale }
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should render the clip path', () => {
    const tree = renderer.create(
      <LineChart
        originalData={ originalData }
        chartData={ chartData }
        areaHeight={ 100 }
        areaWidth={ 100 }
        paddingTop={ 0 }
        paddingBottom={ 0 }
        paddingRight={ 0 }
        paddingLeft={ 0 }
        valueKeys={ valueKeys }
        yScale={ yScale }
        xScale={ xScale }
        clipPath="my-clip-path"
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
