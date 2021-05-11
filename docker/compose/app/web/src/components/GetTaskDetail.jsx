import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Moment from 'moment';
import {Component, useContext, useState} from 'react';
import {getTaskById} from '../utilities/TaskService';
import InfoModal from './InfoModal';

import {Context} from "../Store";

const GetTaskHook = () => {
    const [task, setTask] = useState({});
    const [loading, setLoading] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [taskId, setTaskId] = useState('');
    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");
    const [showInfo, setShowInfo] = useState(false);

    const [state, dispatch] = useContext(Context);

    let token = state.keycloak.token;

    Moment.locale('tr');

    const submitTask = () => {
        setShowInfo(false);
        setLoading(true);

        if (taskId) {
            getTaskById(taskId.trim(), token)
                .then(response => {
                    if (!response || (response && response.error)) {
                        setModalTitle('Error')
                        setModalText('Unable to get task details: ' + response.message);
                        setShowInfo(true);
                        setShowTable(false);
                    } else if (response) {
                        setTask(response);
                        setShowTable(response.id !== null);
                    }
                    setLoading(false);
                });
        }
    }

    return (
        <div>
            <div className="container-fluid mt-3">
                <h1 className="mb-2">Task Details</h1>

                <div className="container-fluid">
                    <form>
                        <div className="form-group">
                            <label htmlFor="task">Task ID</label>
                            <input
                                type="text"
                                className="form-control"
                                id="task"
                                aria-describedby="taskIdHelp"
                                onChange={(e) => setTaskId(e.target.value)}
                                value={taskId}>
                            </input>
                            <small id="taskIdHelp" className="form-text text-muted">Please enter task ID to
                                search</small>
                        </div>
                    </form>

                    {loading ? <FontAwesomeIcon icon={faSpinner} spin/> :
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={submitTask}>Submit</button>
                    }
                </div>
            </div>
            <div className="container-fluid mt-3">
                {showTable ?
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">User First Name</th>
                            <th scope="col">User Last Name</th>
                            <th scope="col">Title</th>
                            <th scope="col">Details</th>
                            <th scope="col">Due Date</th>
                            <th scope="col">Status</th>
                        </tr>
                        </thead>
                        {loading ? <FontAwesomeIcon icon={faSpinner} spin/> :
                            <tbody>
                            <tr key={task.id}>
                                <th scope="row">{task.id}</th>
                                <td>{task.firstName}</td>
                                <td>{task.lastName}</td>
                                <td>{task.title}</td>
                                <td>{task.details}</td>
                                <td>{Moment(task.duedate).format('DD.MM.YYYY')}</td>
                                <td>{task.status}</td>
                            </tr>
                            </tbody>
                        }
                    </table> : ''}

                <InfoModal showModal={showInfo} modalText={modalText} modalTitle={modalTitle}/>
            </div>
        </div>
    )
}

class GetTaskDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            task: {},
            taskId: '',
            loading: false,
            showTable: false,
            modalText: "",
            modalTitle: "",
            showInfo: false
        }
    }

    render() {
        return (
            <div>
                <GetTaskHook/>
            </div>
        )
    }
}

export default GetTaskDetail;