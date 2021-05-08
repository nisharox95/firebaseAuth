import Login from './components/login';
import SignUp from './components/signUp';
import Dashboard from './components/dashboard';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {

  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Route exact path='/dashboard' component={Dashboard}/>
          <Route exact path='/' component={SignUp} />
          <Route exact path='/login' component={Login} />
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
