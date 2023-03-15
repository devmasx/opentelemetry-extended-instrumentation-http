## package-example

## Usage
```
npm install package-example
```

```ts
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { HttpInstrumentation } from 'opentelemetry-extended-instrumentation-http'

const instrumentations = getNodeAutoInstrumentations(HttpInstrumentation.withPayloadDetails())
```

#### Add new spans for all outcoming http request:

- http.request.body
- http.request.headers
- http.response.body
- http.response.headers
