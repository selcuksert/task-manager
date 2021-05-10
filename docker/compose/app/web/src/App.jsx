import { Component } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import ListTasks from './components/ListTasks';
import ListUsers from './components/ListUsers';
import AddTask from './components/AddTask';
import AddUser from './components/AddUser';
import GetTaskDetail from './components/GetTaskDetail';
import Keycloak from 'keycloak-js';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      keycloak: null,
      authenticated: false
    };
  }

  componentDidMount() {
    const keycloak = Keycloak('/keycloak.json');
    keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
      this.setState({ keycloak: keycloak, authenticated: authenticated })
    })
  }

  render() {
    if (this.state.keycloak && this.state.authenticated) {
      return (
        <Router>
          <Header keycloak={this.state.keycloak} />
          <main role="main" className="flex-shrink-0">
            {
              /*
              A <Switch> looks through all its children <Route>
              elements and renders the first one whose path
              matches the current URL. Use a <Switch> any time
              you have multiple routes, but you want only one
              of them to render at a time
              */
            }
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/list/tasks">
                <ListTasks keycloak={this.state.keycloak} />
              </Route>
              <Route path="/add/task">
                <AddTask keycloak={this.state.keycloak} />
              </Route>
              <Route path="/list/users">
                <ListUsers keycloak={this.state.keycloak} />
              </Route>
              <Route path="/add/user">
                <AddUser keycloak={this.state.keycloak} />
              </Route>
              <Route path="/get/task">
                <GetTaskDetail keycloak={this.state.keycloak} />
              </Route>
            </Switch>
          </main>
        </Router>
      );
    }

    return (
      <div>Logging in to system</div>
    );
  }
}

export default App;
