import storage from 'redux-persist/lib/storage';
import {persistReducer} from 'redux-persist';

export default reducers => {
  const persitedReducer = persistReducer(
    {
      key: 'gympoint_web',
      storage,
      whitelist: ['auth', 'user'],
    },
    reducers
  );
  return persitedReducer;
};
