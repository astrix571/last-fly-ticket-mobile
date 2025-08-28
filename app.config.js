import 'dotenv/config';

export default {
  expo: {
    name: 'last-fly-ticket-mobile',
    slug: 'last-fly-ticket-mobile',
    version: '1.0.0',
    extra: {
      RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
    },
  },
};
