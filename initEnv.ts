import { expand } from 'dotenv-expand';
import { config } from 'dotenv-flow';

// set env at import-time

expand(config());
