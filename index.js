"use strict";
/* eslint-disable @typescript-eslint/ban-ts-comment */
// https://www.npmjs.com/package/@opentelemetry/instrumentation-http
// https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.InstrumentationsConfig = void 0;
var InstrumentationsConfig = /** @class */ (function () {
    function InstrumentationsConfig() {
    }
    InstrumentationsConfig.onRequestBody = function (span, body) {
        span.setAttribute('http.request.body', body.toString());
    };
    InstrumentationsConfig.onRequestHeaders = function (span, headers) {
        var _a;
        span.setAttributes((_a = {},
            _a['http.request.headers'] = JSON.stringify(headers),
            _a));
    };
    InstrumentationsConfig.onResponseBody = function (span, body) {
        var _a;
        span.setAttributes((_a = {},
            _a['http.response.body'] = body,
            _a));
    };
    InstrumentationsConfig.onResponseHeaders = function (span, headers) {
        var _a;
        span.setAttributes((_a = {},
            _a['http.response.headers'] = JSON.stringify(headers),
            _a));
    };
    InstrumentationsConfig.requestHook = function (span, request) {
        var _this = this;
        span.updateName("HTTP ".concat(request.method, " - ").concat(request.host));
        this.onRequestHeaders(span, request.getHeaders());
        var oldWrite = request.write.bind(request);
        request.write = function (data) {
            _this.onRequestBody(span, data);
            return oldWrite(data);
        };
    };
    InstrumentationsConfig.responseHook = function (span, response) {
        var _this = this;
        var body = '';
        response.on('data', function (chunk) { return (body += chunk); });
        response.on('end', function () {
            _this.onResponseBody(span, body);
            // @ts-ignore
            _this.onResponseHeaders(span, response.headers);
        });
    };
    InstrumentationsConfig.instrumentationConfig = function (config) {
        if (config === void 0) { config = {}; }
        return __assign({ responseHook: this.responseHook.bind(this), requestHook: this.requestHook.bind(this) }, config);
    };
    InstrumentationsConfig.withHttpTags = function () {
        return {
            '@opentelemetry/instrumentation-http': this.instrumentationConfig()
        };
    };
    return InstrumentationsConfig;
}());
exports.InstrumentationsConfig = InstrumentationsConfig;
