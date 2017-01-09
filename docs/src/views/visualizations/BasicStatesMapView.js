import React from 'react';
import MockStatesData from '../../data/MockStatesData.json';
import BasicStatesMap from '../../visualizations/BasicStatesMap';

export default function BasicStatesMapView () {
  return (
    <BasicStatesMap
      data={ MockStatesData }
      valueKeys={ ['population'] }
      xKey="state"
    />
  );
}
