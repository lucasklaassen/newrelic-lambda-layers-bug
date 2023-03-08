import { Client } from "pg";
const middy = require('middy');

const logging = () => ({
  before: (handler: any, next: Function) => {
    console.log('before', handler);

    return next();
  },
  after: (handler: any, next: Function) => {
    console.log('after', handler);

    return next();
  },
  onError: (handler: any, next: Function) => {
    console.log('onError', handler);

    return next();
  },
});

const main = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let results;
  const text = `
    SELECT 1
  `
  const values: any[] = [];
  try {
    const configurations: any = {
      user: process.env.POSTGRES_USERNAME,
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DATABASE,
      password: process.env.POSTGRES_PASSWORD,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      max: 10,
      ssl: {
        rejectUnauthorized: true,
      },
      allowExitOnIdle: true,
    };
    const client = new Client(configurations);
    await client.connect();
    results = await client.query(text, values);
  } catch(error) {
    console.log('ERROR', error);
  }

  console.log('RESULTS', results);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v3.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
};

const mainHandler = middy(main)
  .use(logging())

module.exports.handler = mainHandler;