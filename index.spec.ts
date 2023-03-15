import { HttpInstrumentation, HttpHandler } from './index';

const span = {
  setAttribute: jest.fn(),
  setAttributes: jest.fn(),
};

describe('HttpInstrumentation', () => {
  const httpHandler = new HttpHandler();
  it(`#onRequestBody`, () => {
    // @ts-ignore
    httpHandler.onRequestBody(span, '{"example": "example" }');
    expect(span.setAttributes).toHaveBeenLastCalledWith({
      'http.request.body': '{"example": "example" }',
    });
  });

  it(`#onResponseBody`, () => {
    // @ts-ignore
    httpHandler.onResponseBody(span, '{"example": "example" }');
    expect(span.setAttributes).toHaveBeenLastCalledWith({
      'http.response.body': '{"example": "example" }',
    });
  });

  it(`#onRequestHeaders`, () => {
    // @ts-ignore
    httpHandler.onRequestHeaders(span, { 'x-header': 'example' });
    expect(span.setAttributes).toHaveBeenLastCalledWith({
      'http.request.headers': '{"x-header":"example"}',
    });
  });

  it(`#onResponseHeaders`, () => {
    // @ts-ignore
    httpHandler.onResponseHeaders(span, { 'x-header': 'example' });
    expect(span.setAttributes).toHaveBeenLastCalledWith({
      'http.response.headers': '{"x-header":"example"}',
    });
  });

  describe('HttpInstrumentation', () => {
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
