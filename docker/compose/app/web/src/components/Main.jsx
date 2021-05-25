import {Component, useContext, useEffect} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import ListTasks from "./ListTasks";
import AddTask from "./AddTask";
import ListUsers from "./ListUsers";
import AddUser from "./AddUser";
import Keycloak from "keycloak-js";
import {Context} from "../Store";

const MainHook = () => {

    const [state, dispatch] = useContext(Context);

    useEffect(() => {
        let keycloak = Keycloak('/keycloak.json');
        keycloak.init({onLoad: 'login-required'}).then(authenticated => {
            dispatch({type: 'LOGGED_IN', payload: {keycloak: keycloak, authenticated: authenticated}})
        })
    }, [])

    return (
        (state.keycloak && state.authenticated) ?
            <div>
                <Router>
                    <Header/>
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
                            <Route key="root" exact path="/">
                                <Home/>
                            </Route>
                            <Route key="list-tasks" path="/list/tasks">
                                <ListTasks/>
                            </Route>
                            <Route key="add-task" path="/add/task">
                                <AddTask/>
                            </Route>
                            <Route key="list-users" path="/list/users">
                                <ListUsers/>
                            </Route>
                            <Route key="add-user" path="/add/user">
                                <AddUser/>
                            </Route>
                        </Switch>
                    </main>
                </Router>
            </div>
            :
            <div>Logging in to system</div>
    )
}

class Main extends Component {
    render() {
        return (
            <MainHook/>
        )
    }
}

export default Main;