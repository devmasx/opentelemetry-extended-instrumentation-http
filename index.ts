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

export class HttpHandler {
  constructor(private secretValues: string[]) {}

  maskSecrets(value: string, secretValues: string[] = this.secretValues) {
    try {
      const regexp = new RegExp(secretValues.join('|'), 'g');
      return value.replace(regexp, '*****');
    } catch {
      console.warn('Imposible to mask', value);
    }
  }

  onRequestBody(span: Span, body: any) {
    span.setAttributes({
      'http.request.body': this.maskSecrets(body.toString()),
    });
  }

  onRequestHeaders(span: Span, headers: OutgoingHttpHeaders) {
    span.setAttributes({
      ['http.request.headers']: this.maskSecrets(JSON.stringify(headers)),
    });
  }

  onResponseBody(span: Span, body: any) {
    span.setAttributes({
      ['http.response.body']: this.maskSecrets(body),
    });
  }

  onResponseHeaders(span: Span, headers: OutgoingHttpHeaders) {
    span.setAttributes({
      ['http.response.headers']: this.maskSecrets(JSON.stringify(headers)),
    });
  }

  requestHook(span: Span, request: ClientRequest) {
    span.updateName(`HTTP ${request.method} - ${request.host}`);
    this.onRequestHeaders(span, request.getHeaders());
    const oldWrite = request.write.bind(request);
    request.write = (data: any) => {
      this.onRequestBody(span, data);
      return oldWrite(data);
    };
  }

  responseHook(
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
}

export class HttpInstrumentation {
  static withPayloadDetails(
    config: HttpInstrumentationConfig = {},
    secretValues?: string[],
    httpHandler?: HttpHandler,
  ): {
    '@opentelemetry/instrumentation-http': HttpInstrumentationConfig;
  } {
    const httpInstrumentation = httpHandler || new HttpHandler(secretValues);
    return {
      '@opentelemetry/instrumentation-http': {
        responseHook:
          httpInstrumentation.responseHook.bind(httpInstrumentation),
        requestHook: httpInstrumentation.requestHook.bind(httpInstrumentation),
        ...config,
      },
    };
  }
}
