import React from 'react';
import { Link } from 'react-router';
import DocumentTitle from '../DocumentTitle';
import MockSeriesData from '../data/MockSeriesData.json';
import FancyLineChart from '../visualizations/FancyLineChart';

export default function Home () {
  return (
    <div className="home">
      <DocumentTitle title="Nud3 Documentation - React D3 Visualization Library" />
      <h1>Nud3.js</h1>
      <section className="description">
        <p>Nud3 is a composable d3 library for react.</p>
        <p>These examples will show you how we create and use NUD3.</p>
        <p>NUD3 is pronounced &quot;new dee three&quot; or nude.</p>
      </section>
      <h2>Everything is Composed Of Nicely Nested React Components</h2>
      <section className="description">
        Here is an example of a <Link to="/FancyLineChart">FancyLineChart</Link>&nbsp;
        which is composed of an AreaChart, LineChart, BottomAxis, and LeftAxis.<br />
        You can view the composed source of any of our examples on the side on their respective pages.
      </section>
      <FancyLineChart
        data={ MockSeriesData }
        valueKeys={ ['mentions_total', 'sentiment_negative', 'sentiment_positive'] }
        titleKeys={ ['Mentions', 'Negative Sentiment', 'Positive Sentiment'] }
      />
    </div>
  );
}
