import Login from './components/login';
import SignUp from './components/signUp';
import Dashboard from './components/dashboard';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RouterRounded } from '@material-ui/icons';

function App() {

  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <RouterRounded exact path='/dashboard' component={Dashboard}/>
          <Route exact path='/' component={SignUp} />
          <Route exact path='/login' component={Login} />
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
