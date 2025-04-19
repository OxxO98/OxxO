import React from 'react';

import App from 'shared/App';
import { ServerContext } from './MainContext.js';

const Root = () => (
  <ServerContext.Provider value={process.env.REACT_APP_API_URL}>
    <App/>
  </ServerContext.Provider>
);

export default Root;
