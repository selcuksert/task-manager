import {Component, useContext, useEffect, useState} from 'react';
import {getUsers} from '../utilities/UserService';
import {getTaskCountByUserId} from '../utilities/TaskService';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRedo, faSpinner} from '@fortawesome/free-solid-svg-icons'
import {Context} from "../Store";
import InfoModal from "./InfoModal";

const ListUsersHook = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");
    const [showInfo, setShowInfo] = useState(false);

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

    const getTaskCount = (userId) => (e) => {
        setLoading(true);
        setShowInfo(false);
        getTaskCountByUserId(userId, secObj).then(count => {
            setLoading(false);
            setModalTitle('Number of tasks in last hour');
            setModalText(count);
            setShowInfo(true);
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
                                <th scope="row">
                                    <a href="#" onClick={getTaskCount(user.id)}
                                       key={`${user.id}-count`}>{user.id}</a>
                                </th>
                                <td>{user.firstname}</td>
                                <td>{user.lastname}</td>
                            </tr>
                        )}
                        </tbody>
                    }
                </table>
            </div>
            <InfoModal showModal={showInfo} modalText={modalText} modalTitle={modalTitle}/>
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