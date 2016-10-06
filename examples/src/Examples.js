import React from 'react';
import DocumentTitle from './DocumentTitle';
import BasicLineChart from './visualizations/BasicLineChart';
import FancyLineChart from './visualizations/FancyLineChart';
import BasicBarChart from './visualizations/BasicBarChart';
import BasicPieChart from './visualizations/BasicPieChart';
import MockSeriesData from './data/MockSeriesData.json';

export default class Examples extends React.Component {
  render () {
    return (
      <div className="examples">
        <DocumentTitle title="Nud3 Examples" />
        <h1>Nud3 Examples</h1>
        <section className="description">
          <p>Nud3 is a composable d3 library for react.</p>
          <p>These examples will show you how we create and use NUD3.</p>
          <p>NUD3 is pronounced &quote;new dee three&quote; or nude.</p>
        </section>
        <section className="visualizations">
          <h1>Basic Line Chart</h1>
          <BasicLineChart
            data={ MockSeriesData }
            valueKeys={ ['mentions_total'] }
          />
        </section>
        <section className="visualizations">
          <h1>Fancy Line Chart</h1>
          <FancyLineChart
            data={ MockSeriesData }
            valueKeys={ ['mentions_total', 'sentiment_positive', 'sentiment_negative'] }
          />
        </section>
        <section className="visualizations">
          <h1>Basic Pie Chart</h1>
          <BasicPieChart
            data={ MockSeriesData }
            valueKeys={ ['mentions_total'] }
            height={ 400 }
          />
        </section>
        <section className="visualizations">
          <h1>Basic Bar Chart</h1>
          <BasicBarChart
            data={ MockSeriesData }
            valueKeys={ ['mentions_total'] }
          />
        </section>
      </div>
    );
  }
}
