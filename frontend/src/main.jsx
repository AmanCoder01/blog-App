import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { store, persistor } from './redux/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import ThemeProvider from "./components/ThemeProvider.jsx"
import { Toaster } from 'react-hot-toast';
ReactDOM.createRoot(document.getElementById('root')).render(

  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
        <Toaster containerStyle={{
          top: 65,
          left: 20,
          bottom: 20,
          right: 20,
        }} />
        <App />
      </ThemeProvider>
    </Provider>
  </PersistGate>
  ,
)
