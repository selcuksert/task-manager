import { Component } from 'react';
import { getUsers } from '../utilities/UserService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

class ListUsers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loading: false
        }
    }

    componentDidMount() {
        this.setState({ loading: true });
        getUsers().then(_users => {
            if (!_users) {
                _users = [];
            }
            this.setState({ users: _users, loading: false });
        });
    }

    render() {
        return (
            <div className="container-fluid mt-3">
                <h1 className="mb-2">User List</h1>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Username</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                        </tr>
                    </thead>
                    {this.state.loading ? <FontAwesomeIcon icon={faSpinner} spin /> :
                        <tbody>
                            {this.state.users.map((user) =>
                                <tr key={user.user_id}>
                                    <th scope="row">{user.user_id}</th>
                                    <td>{user.username}</td>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                </tr>
                            )}
                        </tbody>
                    }
                </table>
            </div>
        )
    }
}

export default ListUsers;