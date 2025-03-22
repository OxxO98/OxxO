import React from 'react';
//import { BrowserRouter } from 'react-router-dom';

import App from 'shared/App';
import { ServerContext } from './MainContext.js';

const Root = () => (
  <ServerContext.Provider value={process.env.REACT_APP_API_URL}>
    <App/>
  </ServerContext.Provider>
);

/*
<BrowserRouter basename={process.env.PUBLIC_URL}>
  <ServerContext.Provider value='http://localhost:5000'>
    <App/>
  </ServerContext.Provider>
</BrowserRouter>
*/

export default Root;
