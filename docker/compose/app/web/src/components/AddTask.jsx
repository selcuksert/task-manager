import { Component, useState, useEffect } from 'react';
import { addTask } from '../utilities/TaskService';
import { getUsers } from '../utilities/UserService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import InfoModal from './InfoModal';

const AddTaskHook = () => {
    const [username, setUsername] = useState("");
    const [duedate, setDuedate] = useState("");
    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");
    const [showInfo, setShowInfo] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getUsers().then((users) => {
            if (!users) {
                setModalTitle('Error')
                setModalText('Unable to get user list');
                setShowInfo(true);
                setUsers([]);
            }
            else {
                setUsers(users);
                if (!username && users && users.length > 0) {
                    setUsername(users[0].id);
                }
            }
            setLoading(false);
        });
    }, [username])

    const setUsernameOnSelect = (e) => {
        let options = (e.target.options);
        let selected = options[options.selectedIndex];
        let value = selected.value;
        setUsername(value);
    }

    const submitTask = () => {
        setShowInfo(false);
        setLoading(true);

        addTask(username, title, details, duedate)
            .then(response => {
                if (!response || (response && response.error)) {
                    setModalTitle('Error')
                    setModalText('Unable to add task: ' + response.message);
                    setShowInfo(true);
                }
                else if(response){
                    setModalTitle('Completed')
                    setModalText(`${response.message}`);
                    setShowInfo(true);
                }
                setLoading(false);
            });
    }

    return (
        <div className="container mt-3">
            <h1 className="mb-2">Add Task</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="username">Select user</label>
                    <select className="form-control" id="username" aria-describedby="usernameHelp"
                        onChange={setUsernameOnSelect}>
                        {users.map(user =>
                            <option key={user.id} value={user.id}>{user.firstname} {user.lastname}</option>
                        )}
                    </select>
                    <small id="usernameHelp" className="form-text text-muted">Please select user to assign the task</small>
                </div>
                <div className="form-group">
                    <label htmlFor="duedate">Due Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="duedate"
                        aria-describedby="duedateHelp"
                        onChange={(e) => setDuedate(e.target.value)}
                        value={duedate}>
                    </input>
                    <small id="duedateHelp" className="form-text text-muted">Please select due date</small>
                </div>
                <div className="form-group">
                    <label htmlFor="title">Task Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        aria-describedby="titleHelp"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}>
                    </input>
                    <small id="titleHelp" className="form-text text-muted">Please enter task title</small>
                </div>
                <div className="form-group">
                    <label htmlFor="details">Task Details</label>
                    <textarea
                        className="form-control"
                        id="details"
                        aria-describedby="detailsHelp"
                        onChange={(e) => setDetails(e.target.value)}
                        value={details}>
                    </textarea>
                    <small id="detailsHelp" className="form-text text-muted">Please enter task details</small>
                </div>
                {loading ? <FontAwesomeIcon icon={faSpinner} spin /> :
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={submitTask}>Submit</button>
                }
            </form>
            <InfoModal showModal={showInfo} modalText={modalText} modalTitle={modalTitle} />
        </div>
    )
}

class AddTask extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            duedate: "",
            title: "",
            details: "",
            modalText: "",
            modalTitle: "",
            showInfo: false,
            users: [],
            loading: false
        }
    }

    render() {
        return (
            <div>
                <AddTaskHook />
            </div>
        )
    }
}

export default AddTask;