import 'babel-polyfill';
import express from 'express';
import proxy from 'express-http-proxy';

import { matchRoutes } from 'react-router-config';
import Routes from './client/Routes';

import renderer from './helpers/renderer';
import createStore from './helpers/createStore';

// router handler
const app = express();

app.use(
  '/api',
  proxy('http://react-ssr-api.herokuapp.com', {
    proxyReqOptDecorator(opts) {
      opts.headers['x-forwarded-host'] = 'localhost:3000';
      return opts;
    }
  })
);

app.use(express.static('public'));

app.get('*', (req, res) => {
  // logic to initialize and load data into the store
  const store = createStore(req);

  console.info(matchRoutes(Routes, req.path));
  const promises = matchRoutes(Routes, req.path).map(({ route }) => {
    return route.loadData ? route.loadData(store) : null;
  });
  console.info('promises', promises);
  Promise.all(promises).then(() => {
    // render the applications
    res.send(renderer(req, store));
  });
});

app.listen(3000, () => {
  console.log('Listening to port 3000');
});
