import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import getArticleReducer from './getArticleReducer';
import loginUserReducer from './loginUserReducer';
import createArticleReducer from './createArticleReducer';

const rootReducer = combineReducers({
  getArticleReducer: getArticleReducer,
  loginUserReducer: loginUserReducer,
  createArticleReducer: createArticleReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['loginUserReducer'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
