import { Component } from 'react';
import { Link } from "react-router-dom";

class Header extends Component {

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <Link to="/" className="navbar-brand">Task Management</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/list/tasks" className="nav-link">List Tasks <span className="sr-only">(current)</span></Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/add/task" className="nav-link">Add Task</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/list/users" className="nav-link">List Users <span className="sr-only">(current)</span></Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/add/user" className="nav-link">Add User</Link>
                        </li>
                    </ul>
                </div>
            </nav>)
    }
}

export default Header;