/* eslint-disable @typescript-eslint/ban-ts-comment */
// https://www.npmjs.com/package/@opentelemetry/instrumentation-http
// https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http

import {
  IncomingMessage,
  ServerResponse,
  ClientRequest,
  OutgoingHttpHeaders,
} from 'http';
import { Span } from '@opentelemetry/api';
import { HttpInstrumentationConfig } from '@opentelemetry/instrumentation-http';

export class InstrumentationsConfig {
  static onRequestBody(span: Span, body: any) {
    span.setAttributes({ 'http.request.body': body.toString() });
  }

  static onRequestHeaders(span: Span, headers: OutgoingHttpHeaders) {
    span.setAttributes({
      ['http.request.headers']: JSON.stringify(headers),
    });
  }

  static onResponseBody(span: Span, body: any) {
    span.setAttributes({
      ['http.response.body']: body,
    });
  }

  static onResponseHeaders(span: Span, headers: OutgoingHttpHeaders) {
    span.setAttributes({
      ['http.response.headers']: JSON.stringify(headers),
    });
  }

  static requestHook(span: Span, request: ClientRequest) {
    span.updateName(`HTTP ${request.method} - ${request.host}`);
    this.onRequestHeaders(span, request.getHeaders());
    const oldWrite = request.write.bind(request);
    request.write = (data: any) => {
      this.onRequestBody(span, data);
      return oldWrite(data);
    };
  }

  static responseHook(
    span: Span,
    response: IncomingMessage | ServerResponse<IncomingMessage>,
  ) {
    let body = '';
    response.on('data', (chunk) => (body += chunk));
    response.on('end', () => {
      this.onResponseBody(span, body);
      // @ts-ignore
      this.onResponseHeaders(span, response.headers);
    });
  }

  static instrumentationConfig(
    config: HttpInstrumentationConfig = {},
  ): HttpInstrumentationConfig {
    return {
      responseHook: this.responseHook.bind(this),
      requestHook: this.requestHook.bind(this),
      ...config,
    };
  }

  static withHttpTags() {
    return {
      '@opentelemetry/instrumentation-http': this.instrumentationConfig(),
    };
  }
}
