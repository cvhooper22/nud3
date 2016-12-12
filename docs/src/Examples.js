import React from 'react';
import DocumentTitle from './DocumentTitle';
import CodeViewer from './CodeViewer';
import BasicAreaChart from './visualizations/BasicAreaChart';
import BasicBarChart from './visualizations/BasicBarChart';
import BasicBubbleChart from './visualizations/BasicBubbleChart';
import BasicLineChart from './visualizations/BasicLineChart';
import BasicPieChart from './visualizations/BasicPieChart';
import BasicStatesMap from './visualizations/BasicStatesMap';
import FancyLineChart from './visualizations/FancyLineChart';
import ScatterLineChart from './visualizations/ScatterLineChart';
import MockSeriesData from './data/MockSeriesData.json';
import MockStatesData from './data/MockStatesData.json';
import RangeSelectorChart from './visualizations/RangeSelectorChart';

export default class Examples extends React.Component {
  render () {
    return (
      <div className="examples">
        <DocumentTitle title="Nud3 Examples" />
        <h1>
          Nud3 Examples
          <img src="https://travis-ci.org/inlineblock/nud3.svg?branch=master" role="presentation" />
        </h1>
        <section className="description">
          <p>Nud3 is a composable d3 library for react.</p>
          <p>These examples will show you how we create and use NUD3.</p>
          <p>NUD3 is pronounced &quot;new dee three&quot; or nude.</p>
        </section>
        <section className="visualizations">
          <h1>Basic Line Chart</h1>
          <BasicLineChart
            data={ MockSeriesData }
            valueKeys={ ['mentions_total', 'sentiment_negative', 'sentiment_positive'] }
            titleKeys={ ['Mentions', 'Negative Sentiment', 'Positive Sentiment'] }
          />
          <CodeViewer filename="BasicLineChart.js" />
        </section>
        <section className="visualizations">
          <h1>Basic Area Chart</h1>
          <BasicAreaChart
            data={ MockSeriesData }
            valueKeys={ ['mentions_total'] }
          />
          <CodeViewer filename="BasicAreaChart.js" />
        </section>
        <section className="visualizations">
          <h1>Basic Pie Chart</h1>
          <BasicPieChart
            data={ MockSeriesData }
            valueKeys={ ['sentiment_positive'] }
            height={ 500 }
          />
          <CodeViewer filename="BasicPieChart.js" />
        </section>
        <section className="visualizations">
          <h1>Basic Bar Chart</h1>
          <BasicBarChart
            data={ MockSeriesData }
            valueKeys={ ['mentions_total'] }
          />
          <CodeViewer filename="BasicBarChart.js" />
        </section>
        <section className="visualizations">
          <h1>Basic Bubble Chart</h1>
          <BasicBubbleChart
            data={ MockSeriesData }
            valueKeys={ ['mentions_total'] }
          />
          <CodeViewer filename="BasicBubbleChart.js" />
        </section>
        <section className="visualizations">
          <h1>Basic United States Map</h1>
          <BasicStatesMap
            data={ MockStatesData }
            valueKeys={ ['population'] }
            xKey="state"
          />
          <CodeViewer filename="BasicStatesMap.js" />
        </section>
        <section className="visualizations">
          <h1>Fancy Line Chart</h1>
          <FancyLineChart
            data={ MockSeriesData }
            valueKeys={ ['mentions_total', 'sentiment_positive', 'sentiment_negative'] }
          />
          <CodeViewer filename="FancyLineChart.js" />
        </section>
        <section className="visualizations">
          <h1>Scatter Line Chart</h1>
          <ScatterLineChart
            data={ MockSeriesData }
            valueKeys={ ['mentions_total'] }
            titleKeys={ ['Mentions'] }
          />
          <CodeViewer filename="ScatterLineChart.js" />
        </section>
        <section className="visualizations">
          <h1>Clip Chart</h1>
          <RangeSelectorChart
            data={ MockSeriesData }
            valueKeys={ ['mentions_total', 'sentiment_negative', 'sentiment_positive'] }
            titleKeys={ ['Mentions', 'Negative Sentiment', 'Positive Sentiment'] }
          />
          <CodeViewer filename="ScatterLineChart.js" />
        </section>
      </div>
    );
  }
}
