import React from 'react';
import MockStatesData from '../../data/MockStatesData.json';
import BasicStatesMap from '../../visualizations/BasicStatesMap';
import mockData from '../../helpers/mockData';

const metrics = [
  'population',
  'house seats',
  'electoral seats',
  'population per house seat',
  'population per electoral vote',
  'population per senator',
];

export default class BasicStatesMapView extends React.Component {

  constructor (...args) {
    super(...args);
    this.state = {
      data: MockStatesData,
      metric: metrics[0],
    };
  }

  onRandomizeClick = () => {
    const data = mockData(this.state.data);
    this.setState({ data });
  }

  onMetricChange = (evt) => {
    this.setState({
      metric: evt.target.value,
    });
  }

  render () {
    return (
      <div>
        <div style={{ height: '2000px', background: 'red' }} />
        <BasicStatesMap
          data={ this.state.data }
          valueKeys={ [this.state.metric] }
          xKey="state"
          metricName={ this.state.metric }
        />
        <button type="button" onClick={ this.onRandomizeClick }>
          Randomize Data
        </button>
        <select
          name="metric"
          value={ this.state.metric }
          onChange={ this.onMetricChange }
        >
          { this.renderOptions() }
        </select>
      </div>
    );
  }

  renderOptions () {
    return metrics.map((m, i) => {
      return (
        <option
          value={ m }
          key={ i }
        >
          { m }
        </option>
      );
    });
  }
}
