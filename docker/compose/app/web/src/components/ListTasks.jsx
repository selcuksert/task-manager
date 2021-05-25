import {faCheck, faPlay, faRedo, faSpinner, faTimes, faTrash} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Moment from 'moment';
import {Component, useContext, useEffect, useState} from 'react';
import {deleteTaskById, getAllTasks, getOwnedTasks, getTaskById, updateTask} from '../utilities/TaskService';
import {Context} from "../Store";
import InfoModal from "./InfoModal";
import TaskDetailModal from "./TaskDetailModal";

const ListTasksHook = () => {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");
    const [showInfo, setShowInfo] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [taskToShow, setTaskToShow] = useState({});

    const [state, dispatch] = useContext(Context);

    let secObj = state.keycloak;

    const getTaskList = () => {
        setLoading(true);
        setShowInfo(false);
        if (secObj.hasRealmRole('manager')) {
            getAllTasks(secObj).then(tasks => {
                if (!tasks) {
                    setTasks([]);
                } else {
                    setTasks(tasks);
                }
                setLoading(false);
            }).catch(err => {
                setModalTitle('Error')
                setModalText('Unable to get tasks: ' + err.error);
                setShowInfo(true);
                setLoading(false);
            });
        } else {
            getOwnedTasks(secObj).then(tasks => {
                if (!tasks) {
                    setTasks([]);
                } else {
                    setTasks(tasks);
                }
                setLoading(false);
            }).catch(err => {
                setModalTitle('Error')
                setModalText('Unable to get tasks: ' + err.error);
                setShowInfo(true);
                setLoading(false);
            });
        }
    }

    const refreshTaskList = (e) => {
        getTaskList();
    }

    const setStatus = (_id, _username, _title, _details, _date, _status) => (e) => {
        setLoading(true);
        setShowInfo(false);
        updateTask(_id, _username, _title, _details, _date, _status, secObj).then(res => {
            if (res.error) {
                setModalTitle('Error')
                setModalText(res.message);
                setShowInfo(true);
                setLoading(false);
            } else {
                setTimeout(() => {
                    setModalTitle('Success')
                    setModalText(res.message);
                    setShowInfo(true);
                    setLoading(false);

                    getTaskList();
                }, state.updateTimeout);
            }
        }).catch(err => {
            setModalTitle('Error')
            setModalText('Unable to update task: ' + err.error);
            setShowInfo(true);
            setLoading(false);
        });
    }

    const deleteTask = (id) => (e) => {
        setLoading(true);
        setShowInfo(false);
        deleteTaskById(id, secObj).then(res => {
            if (res && res.error) {
                setModalTitle(res.error)
                setModalText(res.message);
                setShowInfo(true);
                setLoading(false);
            } else {
                setTimeout(() => {
                    getTaskList();
                    setLoading(false);
                }, state.updateTimeout);
            }
        }).catch(err => {
            setModalTitle('Error')
            setModalText('Unable to delete task: ' + err.error);
            setShowInfo(true);
            setLoading(false);
        });
    }

    const getTaskDetail = (taskId) => (e) => {
        setShowDetails(false);
        getTaskById(taskId.trim(), secObj).then(res => {
            if (res && res.error) {
                setModalTitle('Error')
                setModalText('Unable to get task details: ' + res.message);
                setShowInfo(true);
            } else if (res && res.id != null) {
                setTaskToShow(res);
                setShowDetails(true);
            }
        }).catch(err => {
            setModalTitle('Error')
            setModalText('Unable to get task details: ' + err.error);
            setShowInfo(true);
        });
    }

    useEffect(() => {
        if (!state.authenticated) {
            state.keycloak.logout();
        } else {
            getTaskList();
        }
    }, []);

    Moment.locale('tr');
    return (
        <div className="container-fluid mt-3">
            <h1 className="mb-2">
                Task List
                {!loading ? <FontAwesomeIcon key="refresh" icon={faRedo}
                                             title="Refresh"
                                             id="refresh-icon"
                                             style={{marginLeft: "2vmin"}}
                                             onClick={refreshTaskList}/> : ''}
            </h1>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">User</th>
                        <th scope="col">Title</th>
                        <th scope="col">Details</th>
                        <th scope="col">Due Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Start Task</th>
                        <th scope="col">Complete Task</th>
                        <th scope="col">Reset Task</th>
                        <th scope="col">Delete Task</th>
                    </tr>
                    </thead>
                    {loading ? <FontAwesomeIcon icon={faSpinner} spin/> :
                        <tbody>
                        {tasks.map((task) =>
                            <tr key={task.id}>
                                <th scope="row">
                                    <a href="#" onClick={getTaskDetail(task.id)}
                                       key={`${task.id}-detail`}>{task.id}</a>
                                </th>
                                <td>{task.userid}</td>
                                <td>{task.title}</td>
                                <td>{task.details}</td>
                                <td>{Moment(task.duedate).format('DD.MM.YYYY')}</td>
                                <td>{task.status}</td>
                                <td id="setstart"><FontAwesomeIcon key={`${task.id}-started`} icon={faPlay}
                                                                   style={{marginRight: "2vmin"}}
                                                                   onClick={setStatus(task.id, task.userid, task.title, task.details, task.duedate, 'STARTED')}/>
                                </td>
                                <td id="setcomplete"><FontAwesomeIcon key={`${task.id}-completed`} icon={faCheck}
                                                                      style={{marginRight: "2vmin"}}
                                                                      onClick={setStatus(task.id, task.userid, task.title, task.details, task.duedate, 'COMPLETED')}/>
                                </td>
                                <td id="setreset"><FontAwesomeIcon key={`${task.id}-not-completed`} icon={faTimes}
                                                                   style={{marginLeft: "2vmin"}}
                                                                   onClick={setStatus(task.id, task.userid, task.title, task.details, task.duedate, 'NOTSTARTED')}/>
                                </td>
                                <td id="delete"><FontAwesomeIcon key={`${task.id}-delete`} icon={faTrash}
                                                                 style={{marginLeft: "2vmin"}}
                                                                 onClick={deleteTask(task.id)}/>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    }
                </table>
                <TaskDetailModal showModal={showDetails} task={taskToShow}/>
                <InfoModal showModal={showInfo} modalText={modalText} modalTitle={modalTitle}/>
            </div>
        </div>
    )
}

class ListTasks extends Component {

    export
    default
    ListTasks;

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            loading: false,
            modalText: "",
            modalTitle: "",
            showInfo: false,
            showDetails: false,
            taskToShow: {}
        }
    }

    render() {
        return (
            <ListTasksHook/>
        )
    }
}

export default ListTasks;