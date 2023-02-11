import { Link, Outlet, useOutlet } from 'react-router-dom'
import useOnline from '../hooks/useOnline';
import './App.css'

function App() {
  const outlet = useOutlet();
  const online = useOnline();

  return (
    <div className="App">
      {!online && <h1>Offline.</h1>}
      <h1>Farm IDLE</h1>
      <div className="card">
        {outlet ?? <div className="links">
          <Link to="/signup">Sign-up</Link>
          <Link to="/login">Login</Link>
        </div>}
        <p>
          Server Contact Test.
        </p>
      </div>
    </div>
  )
}

export default App
