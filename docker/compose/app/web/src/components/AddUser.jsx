import {Component, useContext, useState} from 'react';
import {addUser} from '../utilities/UserService';
import InfoModal from './InfoModal';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import {Context} from "../Store";

const AddUserHook = () => {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");
    const [showInfo, setShowInfo] = useState(false);
    const [loading, setLoading] = useState(false);

    const [state, dispatch] = useContext(Context);

    let token = state.keycloak.token;

    const submitUser = () => {
        setShowInfo(false);
        setLoading(true);
        addUser(username, firstName, lastName, token)
            .then(response => {
                if (!response || (response && response.error)) {
                    setModalTitle('Error')
                    setModalText('Unable to add user: ' + response.message);
                    setShowInfo(true);
                } else if (response) {
                    setModalTitle('Completed')
                    setModalText(`${response.message}`);
                    setShowInfo(true);
                }
                setLoading(false);
            });
    }

    return (
        <div className="container mt-3">
            <h1 className="mb-2">Add User</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        aria-describedby="usernameHelp"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}>
                    </input>
                    <small id="usernameHelp" className="form-text text-muted">Please enter user name</small>
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        aria-describedby="firstNameHelp"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}>
                    </input>
                    <small id="firstNameHelp" className="form-text text-muted">Please enter first name.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="title">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        aria-describedby="lastNameHelp"
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}>
                    </input>
                    <small id="lastNameHelp" className="form-text text-muted">Please enter last name.</small>
                </div>

                {loading ? <FontAwesomeIcon icon={faSpinner} spin/> :
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={submitUser}>Submit</button>
                }
            </form>
            <InfoModal showModal={showInfo} modalText={modalText} modalTitle={modalTitle}/>
        </div>
    )
}

class AddUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            firstName: "",
            lastName: "",
            modalText: "",
            modalTitle: "",
            showInfo: false,
            loading: false
        }
    }

    render() {
        return (
            <div>
                <AddUserHook/>
            </div>
        )
    }
}

export default AddUser;