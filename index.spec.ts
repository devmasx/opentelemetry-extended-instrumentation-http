import { InstrumentationsConfig } from './index';

const span = {
  setAttribute: jest.fn(),
  setAttributes: jest.fn(),
};

describe('InstrumentationsConfig', () => {
  it(`#onRequestBody`, () => {
    // @ts-ignore
    InstrumentationsConfig.onRequestBody(span, '{"example": "example" }');
    expect(span.setAttribute).toHaveBeenLastCalledWith(
      'http.request.body',
      '{"example": "example" }',
    );
  });

  it(`#onRequestHeaders`, () => {
    // @ts-ignore
    InstrumentationsConfig.onRequestHeaders(span, { 'x-header': 'example' });
    expect(span.setAttributes).toHaveBeenLastCalledWith({
      'http.request.headers': '{"x-header":"example"}',
    });
  });
});
