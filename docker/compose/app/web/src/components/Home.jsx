import { Component } from 'react';

class Home extends Component {

    render() {
        return (
            <div className="container">
                <h1 className="mt-5">Welcome to Task Manager</h1>
                <p className="lead">This portal is designed for managing tasks.</p>
                <p>Please use header menu to navigate through the system.</p>
            </div>
        )
    }
}

export default Home;