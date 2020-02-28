import React from 'react'
import './App.css'
import Router from './router/Router'
import Modal from './containers/Modal'
import './i18n'
const App = () => {
  return (
    <div className="App">
        <Router />
        <Modal />
    </div>
  )
}

export default App
