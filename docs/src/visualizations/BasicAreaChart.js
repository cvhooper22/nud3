import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Chart, AreaChart, AxisBottom, AxisLeft, PadDataBetweenDates,
  HorizontalHoverBar,
  VerticalHoverBar,
} from 'nud3';
import LineTooltip from '../tooltips/LineTooltip';

export default function BasicAreaChart (props) {
  const startDate = moment(_.first(props.data).date).toDate();
  const endDate = moment(_.last(props.data).date).toDate();
  return (
    <Chart
      className="basic-area-chart"
      data={ props.data }
      xKey="date"
      valueKeys={ props.valueKeys }
      height={ 300 }
      paddingLeft={ 30 }
      paddingBottom={ 50 }
    >
      <AxisLeft />
      <PadDataBetweenDates startDate={ startDate } endDate={ endDate }>
        <AxisBottom textTransform="rotate(-45)" textDy="-0.25em" textDx="-0.75em" />
        <AreaChart transitionDuration={ 400 } transitionDelay={ 100 } />
        <VerticalHoverBar barWidth={ 2 } />
      </PadDataBetweenDates>
    </Chart>
  );
}
BasicAreaChart.propTypes = {
  data: React.PropTypes.array,
  valueKeys: React.PropTypes.array,
};
