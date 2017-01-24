import React from 'react';
import renderer from 'react-test-renderer';
import { scaleBand } from 'd3';
import BarChart from '../../src/charts/BarChart';
import {
  chartData,
  yScale,
  xScale,
  valueKeys,
  originalData,
} from '../mockData/chartData';

const domain = chartData.map(d => d.xValue);
const barXScale = scaleBand().padding(0.1).range(xScale.range()).domain(domain);

describe('BarChart.js', () => {
  it('should take stubbed data and do basic rendering', () => {
    const tree = renderer.create(
      <BarChart
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
        xScale={ barXScale }
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should take stubbed data repositions based on padding', () => {
    const tree = renderer.create(
      <BarChart
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
        xScale={ barXScale }
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should render the clip path', () => {
    const tree = renderer.create(
      <BarChart
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
        xScale={ barXScale }
        clipPath="my-clip-path"
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('shouldnt throw an error when providing bad xScale without bandwidth', () => {
    const tree = renderer.create(
      <BarChart
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
