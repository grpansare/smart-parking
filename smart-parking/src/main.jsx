import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import {Provider} from 'react-redux'

import { PersistGate } from 'redux-persist/integration/react'
import { persister, store } from './Store/store.js'




createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <PersistGate loading={null} persistor={persister}>
    <App />
    </PersistGate>
 </Provider>
)
