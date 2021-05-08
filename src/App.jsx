import Login from './components/login';
import SignUp from './components/signUp';
import Dashboard from './components/dashboard';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import {useAuth} from './context/AuthContext';

function App() {
  const { currentUser } = useAuth()

  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Switch>
          {currentUser === null && <Redirect exact from='/dashboard' to='/' />}
          {currentUser !== null &&
              <Route path='/dashboard' component={Dashboard} />
          }
          <Route exact path='/' component={SignUp} />
          <Route path='/login' component={Login} />
          </Switch>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
