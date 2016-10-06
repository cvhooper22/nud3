import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import {
  Chart,
  LineChart,
  AreaChart,
  AxisBottom,
  AxisLeft,
  PadDataBetweenDates,
  VerticalCurtain,
} from 'nud3';
import * as d3 from 'd3';
import BlurFilter from './BlurFilter';
import GradientFilters from './GradientFilters';

export default function FancyLineChart (props) {
  const startDate = moment(_.first(props.data).date).toDate();
  const endDate = moment(_.last(props.data).date).toDate();
  const colorPalette = d3.scaleOrdinal(d3.schemeCategory10);
  const gradients = props.valueKeys.map(vk => `url(#gradient-${vk})`);
  const gradientPalette = d3.scaleOrdinal(gradients);

  return (
    <Chart
      className="fancy-line-chart"
      data={ props.data }
      xKey="date"
      valueKeys={ props.valueKeys }
      height={ 300 }
      paddingLeft={ 30 }
      paddingBottom={ 50 }
    >
      <VerticalCurtain id="vertical-curtain" delay={ 250 } duration={ 1200 } />
      <BlurFilter id="blur" />
      <GradientFilters colorPalette={ colorPalette } idPrefix="gradient-" />
      <AxisLeft />
      <PadDataBetweenDates startDate={ startDate } endDate={ endDate }>
        <AxisBottom textTransform="rotate(-45)" textDy="-0.25em" textDx="-0.75em" />
        <AreaChart colorPalette={ gradientPalette } clipPath="url(#vertical-curtain)" />
        <LineChart colorPalette={ colorPalette } filter="blur" clipPath="url(#vertical-curtain)" />
        <LineChart colorPalette={ colorPalette } clipPath="url(#vertical-curtain)" />
      </PadDataBetweenDates>
    </Chart>
  );
}
FancyLineChart.propTypes = {
  data: React.PropTypes.array,
  valueKeys: React.PropTypes.array,
};
