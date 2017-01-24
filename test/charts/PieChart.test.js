import React from 'react';
import renderer from 'react-test-renderer';
import PieChart from '../../src/charts/PieChart';
import {
  chartData,
  yScale,
  xScale,
  valueKeys,
  originalData,
} from '../mockData/chartData';

describe('PieChart.js', () => {
  it('should take stubbed data and do basic rendering', () => {
    const tree = renderer.create(
      <PieChart
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
      <PieChart
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
      <PieChart
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
