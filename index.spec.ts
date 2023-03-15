import { InstrumentationsConfig } from './index';

const span = {
  setAttribute: jest.fn(),
};

describe('InstrumentationsConfig', () => {
  it(`#onRequestBody`, () => {
    // @ts-ignore
    InstrumentationsConfig.onRequestBody(span, {
      example: 'example',
    });
    expect(span.setAttribute.mock.calls).toHaveLength(1);
  });
});
