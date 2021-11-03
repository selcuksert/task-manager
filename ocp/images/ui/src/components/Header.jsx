/* eslint-disable jsx-a11y/anchor-is-valid */
import {Component, useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {Context} from "../Store";

const HeaderHook = () => {

    // eslint-disable-next-line no-unused-vars
    const [state, dispatch] = useContext(Context);
    const [manager, setManager] = useState(false);
    const [name, setName] = useState("");

    let secObj = state.keycloak;

    useEffect(() => {
        setManager(secObj.hasRealmRole('manager'));
        setName(secObj.tokenParsed.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const logout = () => {
        state.keycloak.logout();
    }

    const openTool = (tool) => (e) => {
        switch (tool) {
            case 'PG_ADMIN':
                window.open(`http://pgadmin-task-manager.apps-crc.testing`, "_blank");
                break;
            case 'GRAFANA':
                window.open(`http://kmonitor-task-manager.apps-crc.testing`, "_blank");
                break;
            case 'KC_ADM':
                window.open(`${secObj.authServerUrl}admin`, "_blank");
                break;
            default:
                window.location = '#';
        }
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <Link to="/" className="navbar-brand">Task Management</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/list/tasks" className="nav-link">List Tasks <span
                                className="sr-only">(current)</span></Link>
                        </li>
                        {manager ?
                            <li className="nav-item">
                                <Link to="/add/task" className="nav-link">Add Task</Link>
                            </li>
                            : ''
                        }
                        {manager ?
                            <li className="nav-item">
                                <Link to="/list/users" className="nav-link">List Users <span
                                    className="sr-only">(current)</span></Link>
                            </li>
                            : ''
                        }
                        {manager ?
                            <li className="nav-item">
                                <Link to="/add/user" className="nav-link">Add User</Link>
                            </li>
                            : ''
                        }
                        {manager ?
                            <li className="nav-item">
                                <Link to="/stats" className="nav-link">Statistics</Link>
                            </li>
                            : ''
                        }
                        {manager ?
                            <li className="nav-item">
                                <Link to="/topology" className="nav-link">Processor Topology</Link>
                            </li>
                            : ''
                        }
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Tools
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <a className="dropdown-item" onClick={openTool('PG_ADMIN')}>PgAdmin</a>
                                <a className="dropdown-item" onClick={openTool('GRAFANA')}>Grafana</a>
                                <a className="dropdown-item" onClick={openTool('KC_ADM')}>Keycloak Admin</a>
                            </div>
                        </li>
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={logout}>Logout
                                ({name})</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )

}

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            manager: false
        }
    }

    render() {
        return (
            <HeaderHook/>
        )
    }
}

export default Header;