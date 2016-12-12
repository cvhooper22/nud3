import React from 'react';
import renderer from 'react-test-renderer';
import G from '../src/G';


describe('G.js', () => {
  it('should take proper SVG items and pass', () => {
    const Fake = (props) => {
      return <path mask={ props.notRealSVG } />;
    };
    const tree = renderer.create(
      <G mask="123" notRealSVG={ 436 }>
        <Fake />
      </G>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
