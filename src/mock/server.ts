import { setupServer } from 'msw/node';
import 'server-only';

import { handlers } from './handlers';

export const server = setupServer(...handlers);
