NUD3
====

Nud3 is a composable charting/graph library for React utilizing D3.
It is super opinionated and not very opinionated at the same time.


It utilizes React's cloneElement for prop injection, that way you don't need to pass the data to each component for your graph.
We do this, so composing charts is declarative and obvious. You say what you want and nothing more.

Nud3's base render is called "Chart" (super clever we know). It makes some assumptions about your data and scales then renders its children, by injecting the 
denormalized data into each child, which should all have one purpose. An x-axis, y-axis, and line chart renderer should all be separate components making your
"BasicLineChart".

##### BasicLineChart.js
You'll notice in this example, attributes that belong to only the AxisBottom, are the only to receive those options.
```jsx
import React from 'react';
import {
  Chart,
  LineChart,
  AxisBottom,
  AxisLeft,
} from 'nud3';

export default function BasicLineChart (props) {
  return (
    <Chart
      className="basic-line-chart"
      data={ props.data }
      xKey="date"
      valueKeys={ props.valueKeys }
      height={ 300 }
      paddingLeft={ 30 }
      paddingBottom={ 50 }
    >
      <AxisLeft />
      <AxisBottom textTransform="rotate(-45)" textDy="-0.25em" textDx="-0.75em" />
      <LineChart transitionDuration={ 400 } transitionDelay={ 100 } />
    </Chart>
  );
}
BasicLineChart.propTypes = {
  data: React.PropTypes.array,
  valueKeys: React.PropTypes.array,
};

```


## What does Nud3 have?
We try to include plenty of the basic to setup your own charts without much work, while not doing it all for you. Here are some of the charts we have.

#### Charts
* AreaChart
* LineChart
* BubbleChart
* ChoroplethMap
* LineChart
* PieChart

#### Axes
* AxesBottom
* AxesLeft
* HorizontalHoverBar
    * Nested child becomes Tooltip
* VerticalHoverBar
    * Nested child becomes Tooltip

#### Data Manipulators
* PadDataBetweenDates
    * startDate - (Date) Beginning Date to Start Padding
    * endDate - (Date) End Date to pad to
    * dateInterval - (String) hour, day, month, year - A moment.js compatible interval
    * padWith - (Any) object to pad the data with, defaults to `{}`

#### Animators
* HorizontalCurtain
* VerticalCurtain




## Run the examples locally


`$ npm install`
`$ npm start`
`open browser to http://localhost:8000`


If the package isn't published yet, then do this first, then install and start.
`npm link`
`npm link nud3`
