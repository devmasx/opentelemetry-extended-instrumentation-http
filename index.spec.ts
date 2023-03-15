import { HttpInstrumentation, HttpHandler } from './index';

const span = {
  setAttribute: jest.fn(),
  setAttributes: jest.fn(),
};

describe('HttpInstrumentation', () => {
  it(`#onRequestBody`, () => {
    // @ts-ignore
    HttpInstrumentation.onRequestBody(span, '{"example": "example" }');
    expect(span.setAttributes).toHaveBeenLastCalledWith({
      'http.request.body': '{"example": "example" }',
    });
  });

  it(`#onResponseBody`, () => {
    // @ts-ignore
    HttpInstrumentation.onResponseBody(span, '{"example": "example" }');
    expect(span.setAttributes).toHaveBeenLastCalledWith({
      'http.response.body': '{"example": "example" }',
    });
  });

  it(`#onRequestHeaders`, () => {
    // @ts-ignore
    HttpInstrumentation.onRequestHeaders(span, { 'x-header': 'example' });
    expect(span.setAttributes).toHaveBeenLastCalledWith({
      'http.request.headers': '{"x-header":"example"}',
    });
  });

  it(`#onResponseHeaders`, () => {
    // @ts-ignore
    HttpInstrumentation.onResponseHeaders(span, { 'x-header': 'example' });
    expect(span.setAttributes).toHaveBeenLastCalledWith({
      'http.response.headers': '{"x-header":"example"}',
    });
  });

  describe.only('HttpInstrumentation', () => {
    it('mask secrets values', () => {
      const httpHandler = new HttpHandler(['my-password']);

      // @ts-ignore
      httpHandler.onRequestBody(span, '{"password": "my-password" }');
      expect(span.setAttributes).toHaveBeenLastCalledWith({
        'http.request.body': '{"password": "*****" }',
      });
    });
  });
});
