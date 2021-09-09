import { Component, useContext, useEffect, useState } from 'react';
import { addUser, getUsersFromIdp } from '../utilities/UserService';
import InfoModal from './InfoModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Context } from "../Store";

const AddUserHook = () => {
    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");
    const [showInfo, setShowInfo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    const [users, setUsers] = useState([]);

    // eslint-disable-next-line no-unused-vars
    const [state, dispatch] = useContext(Context);

    let secObj = state.keycloak;

    const loadUsersFromIdp = () => {
        getUsersFromIdp(secObj).then(res => {
            if (res.length === 0) {
                setModalTitle('Error')
                setModalText('Unable to get users from identity server. Please add view-users role on user');
                setShowInfo(true);
                setSelectedUser({});
            } else if (res) {
                setUsers(res);
                setSelectedUser(res[0]);
            }
            setLoading(false);
        })
    }

    useEffect(() => {
        loadUsersFromIdp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitUser = () => {
        setShowInfo(false);
        setLoading(true);

        addUser(selectedUser, secObj)
            .then(res => {
                if (!res || (res && res.error)) {
                    setModalTitle('Error')
                    setModalText('Unable to add user: ' + res.message);
                    setShowInfo(true);
                } else if (res) {
                    setModalTitle('Completed')
                    setModalText(`${res.message}`);
                    setShowInfo(true);
                }
                setLoading(false);
            });
    }

    const setUserDataOnSelect = (e) => {
        let options = (e.target.options);
        let userId = options[options.selectedIndex].value;

        let selectedUser = users.find(user => user.id === userId);

        setSelectedUser(selectedUser);
    }

    return (
        <div className="container mt-3">
            <h1 className="mb-2">Add User</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="user">Select user</label>
                    <select className="form-control" id="user" aria-describedby="usernameHelp"
                        onChange={setUserDataOnSelect}>
                        {users.map(user =>
                            <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
                        )}
                    </select>
                    <small id="usernameHelp" className="form-text text-muted">Please select user to assign the
                        task</small>
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input disabled
                        type="text"
                        className="form-control"
                        id="username"
                        aria-describedby="usernameHelp"
                        value={selectedUser.username}>
                    </input>
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input disabled
                        type="text"
                        className="form-control"
                        id="firstName"
                        aria-describedby="firstNameHelp"
                        value={selectedUser.firstName}>
                    </input>
                </div>
                <div className="form-group">
                    <label htmlFor="title">Last Name</label>
                    <input disabled
                        type="text"
                        className="form-control"
                        id="title"
                        aria-describedby="lastNameHelp"
                        value={selectedUser.lastName}>
                    </input>
                </div>

                {loading ? <FontAwesomeIcon icon={faSpinner} spin /> :
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={submitUser}>Submit</button>
                }
            </form>
            <InfoModal showModal={showInfo} modalText={modalText} modalTitle={modalTitle} />
        </div>
    )
}

class AddUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedUser: {},
            modalText: "",
            modalTitle: "",
            showInfo: false,
            loading: false,
            users: []
        }
    }

    render() {
        return (
            <div>
                <AddUserHook />
            </div>
        )
    }
}

export default AddUser;