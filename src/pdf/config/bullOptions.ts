import { JobOptions } from 'bull';

export const jobOptions: JobOptions = {
  attempts: 1,
  removeOnComplete: 20,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
};