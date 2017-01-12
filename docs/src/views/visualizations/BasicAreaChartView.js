import React from 'react';
import MockSeriesData from '../../data/MockSeriesData.json';
import BasicAreaChart from '../../visualizations/BasicAreaChart';
import mockData from '../../helpers/mockData';


const availableSeries = ['mentions_total', 'reach_total', 'spread_total', 'sentiment_positive', 'sentiment_negative'];

export default class BasicAreaChartView extends React.Component {

  constructor (...args) {
    super(...args);
    this.state = {
      data: MockSeriesData,
      seriesCount: 1,
    };
  }

  onRandomizeClick = () => {
    const data = mockData(this.state.data);
    this.setState({ data });
  }

  onRemoveSeriesClick = () => {
    this.setState({
      seriesCount: this.state.seriesCount - 1,
    });
  }

  onAddSeriesClick = () => {
    this.setState({
      seriesCount: this.state.seriesCount + 1,
    });
  }

  render () {
    return (
      <div>
        <BasicAreaChart
          data={ this.state.data }
          valueKeys={ availableSeries.slice(0, this.state.seriesCount) }
        />
        <button type="button" onClick={ this.onRandomizeClick }>
          Randomize Data
        </button>
        <button
          type="button"
          onClick={ this.onRemoveSeriesClick }
          disabled={ this.state.seriesCount === 1 }
        >
          Remove Series Data
        </button>
        <button
          type="button"
          onClick={ this.onAddSeriesClick }
          disabled={ this.state.seriesCount === (availableSeries.length - 1) }
        >
          Add Series Data
        </button>
      </div>
    );
  }
}
