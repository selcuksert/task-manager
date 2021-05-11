import {faCheck, faPlay, faSpinner, faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Moment from 'moment';
import {Component, useContext, useEffect, useState} from 'react';
import {getTasks, updateTask} from '../utilities/TaskService';
import {Context} from "../Store";

const ListTasksHook = () => {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const [state, dispatch] = useContext(Context);

    let token = state.keycloak.token;

    const getTaskList = () => {
        setLoading(true);
        getTasks(token).then(tasks => {
            if (!tasks) {
                setTasks([]);
            }

            setTasks(tasks);
            setLoading(false);
        }).catch(error => {
            console.error(error);
            setLoading(false);
        });
    }
    const setStatus = (_id, _username, _title, _details, _date, _status) => (e) => {
        setLoading(true);
        updateTask(_id, _username, _title, _details, _date, _status, token).then(res => {
            setTimeout(() => {
                getTaskList();
            }, state.updateTimeout);
        });
    }

    useEffect(() => {
        getTaskList();
    }, []);

    Moment.locale('tr');
    return (
        <div className="container-fluid mt-3">
            <h1 className="mb-2">Task List</h1>
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
                </tr>
                </thead>
                {loading ? <FontAwesomeIcon icon={faSpinner} spin/> :
                    <tbody>
                    {tasks.map((task) =>
                        <tr key={task.id}>
                            <th scope="row">{task.id}</th>
                            <td>{task.userid}</td>
                            <td>{task.title}</td>
                            <td>{task.details}</td>
                            <td>{Moment(task.duedate).format('DD.MM.YYYY')}</td>
                            <td>{task.status}</td>
                            <td id="setstart"><FontAwesomeIcon key={`${task.task_id}-started`} icon={faPlay}
                                                               style={{marginRight: "2vmin"}}
                                                               onClick={setStatus(task.id, task.userid, task.title, task.details, task.duedate, 'STARTED')}/>
                            </td>
                            <td id="setcomplete"><FontAwesomeIcon key={`${task.task_id}-completed`} icon={faCheck}
                                                                  style={{marginRight: "2vmin"}}
                                                                  onClick={setStatus(task.id, task.userid, task.title, task.details, task.duedate, 'COMPLETED')}/>
                            </td>
                            <td id="setreset"><FontAwesomeIcon key={`${task.task_id}-not-completed`} icon={faTimes}
                                                               style={{marginLeft: "2vmin"}}
                                                               onClick={setStatus(task.id, task.userid, task.title, task.details, task.duedate, 'NOTSTARTED')}/>
                            </td>
                        </tr>
                    )}
                    </tbody>
                }
            </table>
        </div>

    )
}

class ListTasks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            loading: false
        }
    }

    render() {
        return (
            <ListTasksHook/>
        )
    }
}

export default ListTasks;