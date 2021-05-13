import {Component, useContext, useEffect, useState} from 'react';
import {getUsers} from '../utilities/UserService';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRedo, faSpinner} from '@fortawesome/free-solid-svg-icons'
import {Context} from "../Store";

const ListUsersHook = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [state, dispatch] = useContext(Context);

    let secObj = state.keycloak;

    const getUserList = () => {
        setLoading(true);
        getUsers(secObj).then(users => {
            if (!users) {
                setUsers([]);
            } else {
                setUsers(users);
            }
            setLoading(false);
        }).catch(error => {
            setLoading(false);
        });
    }

    const refreshUserList = (e) => {
        getUserList();
    }

    useEffect(() => {
        if (!secObj.authenticated) {
            secObj.logout();
        } else {
            getUserList();
        }
    }, []);

    return (
        <div className="container-fluid mt-3">
            <h1 className="mb-2">
                User List
                {!loading ? <FontAwesomeIcon key="refresh" icon={faRedo}
                                             title="Refresh"
                                             id="refresh-icon"
                                             style={{marginLeft: "2vmin"}}
                                             onClick={refreshUserList}/> : ''}
            </h1>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th scope="col">Username</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                    </tr>
                    </thead>
                    {loading ? <FontAwesomeIcon icon={faSpinner} spin/> :
                        <tbody>
                        {users.map((user) =>
                            <tr key={user.id}>
                                <th scope="row">{user.id}</th>
                                <td>{user.firstname}</td>
                                <td>{user.lastname}</td>
                            </tr>
                        )}
                        </tbody>
                    }
                </table>
            </div>
        </div>
    )
}

class ListUsers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loading: false
        }
    }

    render() {
        return (
            <ListUsersHook/>
        )
    }
}

export default ListUsers;