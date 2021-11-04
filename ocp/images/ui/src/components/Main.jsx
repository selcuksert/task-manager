import { Component, useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import ListTasks from "./ListTasks";
import AddTask from "./AddTask";
import ListUsers from "./ListUsers";
import AddUser from "./AddUser";
import Topology from "./Topology";
import Keycloak from "keycloak-js";
import { Context } from "../Store";
import Stats from "./Stats";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MainHook = () => {

    const [state, dispatch] = useContext(Context);

    useEffect(() => {
        let keycloak = Keycloak('/keycloak.json');
        keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
            dispatch({ type: 'LOGGED_IN', payload: { keycloak: keycloak, authenticated: authenticated } })
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        (state.keycloak && state.authenticated) ?
            <div>
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
                            <Route key="root" exact path="/">
                                <Home />
                            </Route>
                            <Route key="list-tasks" path="/list/tasks">
                                <ListTasks />
                            </Route>
                            <Route key="add-task" path="/add/task">
                                <AddTask />
                            </Route>
                            <Route key="list-users" path="/list/users">
                                <ListUsers />
                            </Route>
                            <Route key="add-user" path="/add/user">
                                <AddUser />
                            </Route>
                            <Route key="stats" path="/stats">
                                <Stats />
                            </Route>
                            <Route key="topology" path="/topology">
                                <Topology topoUrl={`http://task-processor-task-manager.apps-crc.testing/api/task/processor/actuator/kafkastreamstopology`} />
                            </Route>
                        </Switch>
                    </main>
                </Router>
            </div>
            :
            <div><FontAwesomeIcon icon={faSpinner} spin /></div>
    )
}

class Main extends Component {
    render() {
        return (
            <MainHook />
        )
    }
}

export default Main;