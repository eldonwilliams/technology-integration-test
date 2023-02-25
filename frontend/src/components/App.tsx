import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useOutlet } from 'react-router-dom'
import useAuthUpdate from '../hooks/apiHooks/useAuthUpdate';
import useOnline from '../hooks/useOnline';
import { RootState } from '../store';
import './App.css';
import Logout from './Logout';

function App() {
  const auth = useSelector((state: RootState) => state.auth);
  const outlet = useOutlet();
  const online = useOnline();
  const authUpdate = useAuthUpdate();

  useEffect(() => {
    authUpdate();
  }, []);

  return (
    <div className="App">
      {!online && <h1>Offline.</h1>}
      <h1>Farm IDLE</h1>
      {auth.authenticated && <p>Hello, {auth.whois}.</p>}
      <div className="card">
        {auth.authenticated && <Logout />}
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
