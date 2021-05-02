import { Component } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import ListTasks from './components/ListTasks';
import ListUsers from './components/ListUsers';
import AddTask from './components/AddTask';
import AddUser from './components/AddUser';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

class App extends Component {

  render() {
    return (
      <Router>
        <Header />
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
              <ListTasks />
            </Route>
            <Route path="/add/task">
              <AddTask />
            </Route>
            <Route path="/list/users">
              <ListUsers />
            </Route>
            <Route path="/add/user">
              <AddUser />
            </Route>
          </Switch>
        </main>
      </Router>
    );
  }
}

export default App;
