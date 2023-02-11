import { useState } from 'react'
import './App.css'
import Signup from './Signup'

function App() {
  return (
    <div className="App">
      <h1>Farm IDLE</h1>
      <div className="card">
        <Signup />
        <p>
          Server Contact Test.
        </p>
      </div>
    </div>
  )
}

export default App
