import React from 'react';
import { geoAlbersUsa, scaleQuantize, max } from 'd3';
import { Chart, ChoroplethMap } from 'nud3';
import StatesTopology from '../data/StatesTopology.json';
import MapTooltip from '../tooltips/MapTooltip';

const colors = [
  '#ffffff',
  '#f2f0f7',
  '#cbc9e2',
  '#9e9ac8',
  '#756bb1',
  '#54278f',
];
const colorScale = scaleQuantize().range(colors);
const fillColor = (d) => {
  const data = d.data || {};
  const value = data.yValue || 0;
  return colorScale(value);
};

export default function BasicStatesMap (props) {
  const projection = (options) => {
    return geoAlbersUsa().fitSize([options.areaWidth, options.areaHeight], StatesTopology);
  };
  const valueKey = props.valueKeys[0];
  const maxValue = max(props.data, d => d[valueKey]);
  colorScale.domain([0, maxValue]);
  return (
    <Chart
      className="basic-states-map"
      data={ props.data }
      xKey={ props.xKey }
      valueKeys={ props.valueKeys }
      height={ 500 }
    >
      <ChoroplethMap
        topology={ StatesTopology }
        projection={ projection }
        topologyMatcher="properties.name"
        fillColor={ fillColor }
        tooltip={ MapTooltip }
      />
    </Chart>
  );
}
BasicStatesMap.propTypes = {
  data: React.PropTypes.array,
  valueKeys: React.PropTypes.array,
  xKey: React.PropTypes.string,
};
