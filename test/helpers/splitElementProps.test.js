import splitElementProps from '../../src/helpers/splitElementProps';

describe('splitElementProps', function () {
  it('takes an object, generates a function', function () {
    expect(typeof splitElementProps({})).toBe('function');
  });

  it('generatored function can split props', function () {
    const domPropertiesObject = {
      Properties: {
        element: 1,
        anotherElement: 1,
      },
    };

    const generatedProps = splitElementProps(domPropertiesObject);
    const byRef = { iGotThe: 'keys' };
    const props = {
      element: 'tag',
      anotherElement: byRef,
      notElement: 123,
      differentType: [],
    };

    const [elementProps, otherProps] = generatedProps(props);
    expect(elementProps).toEqual({ element: 'tag', anotherElement: byRef });
    expect(otherProps).toEqual({ notElement: 123, differentType: [] });
  });
});
