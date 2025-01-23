import type { AxiosRequestConfig } from 'axios';

import type { SchemaZod } from './providers/ZodProvider';

export type Schema = SchemaZod;

export type RouteDefinition = {
  method: AxiosRequestConfig['method'];
  url: string | (({ params }: { params: { [s: string]: string } }) => string);
  okCode?: number;
  schema: Schema;
};
