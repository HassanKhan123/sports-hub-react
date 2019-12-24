import { createStore,applyMiddleware,compose} from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import thunk from 'redux-thunk'
import storage from 'redux-persist/lib/storage'
import rootReducer from './rootReducer'
const persistConfig = {
    key: 'root',
    storage,
    whitelist:['vendorReducer','userReducer']
  }
  
const persistedReducer = persistReducer(persistConfig, rootReducer)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(persistedReducer,composeEnhancers(applyMiddleware(thunk)))
export let persistor = persistStore(store)

export default store