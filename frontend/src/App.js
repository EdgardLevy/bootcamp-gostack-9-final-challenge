import React from 'react';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {ToastContainer} from 'react-toastify';
import {Router} from 'react-router-dom';
import './config/ReactotronConfig';
import Routes from './routes';
import history from './services/history';
import {store, persistor} from './store';
import GlolbalStyle from './styles/global';

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router history={history}>
          <Routes />
          <GlolbalStyle />
        </Router>
        <ToastContainer autoClose={3000} />
      </PersistGate>
    </Provider>
  );
}

export default App;
