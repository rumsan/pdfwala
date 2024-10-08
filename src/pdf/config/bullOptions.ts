import { JobOptions } from 'bull';

export const jobOptions: JobOptions = {
  attempts: 5,
  removeOnComplete: true,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
  removeOnFail: true,
};
