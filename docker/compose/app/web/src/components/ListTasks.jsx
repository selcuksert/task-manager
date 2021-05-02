import { Component } from 'react';
import { getTasks, updateTaskStatus } from '../utilities/TaskService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons'
import Moment from 'moment';

class ListTasks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            loading: false
        }
    }

    componentDidMount() {
        this.setState({ loading: true });

        getTasks().then(_tasks => {
            if (!_tasks) {
                _tasks = [];
            }
            this.setState({ tasks: _tasks, loading: false });
        });
    }

    setStatus = (taskId, completed) => (e) => {
        updateTaskStatus(taskId, completed).then(res => {
            if (res && res.task_id) {
                let _tasks = this.state.tasks.map((task) => {
                    if (taskId === task.task_id) {
                        task.completed = res.completed;
                    }
                    return task;
                })
                this.setState({ tasks: _tasks });
            }
        });
    }

    render() {
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
                            <th scope="col">Complete Task</th>
                            <th scope="col">Reset Task</th>
                        </tr>
                    </thead>
                    {this.state.loading ? <FontAwesomeIcon icon={faSpinner} spin /> :
                        <tbody>
                            {this.state.tasks.map((task) =>
                                <tr key={task.task_id}>
                                    <th scope="row">{task.task_id}</th>
                                    <td>{task.username}</td>
                                    <td>{task.title}</td>
                                    <td>{task.details}</td>
                                    <td>{Moment(task.duedate).format('DD.MM.YYYY')}</td>
                                    <td>{task.completed === 1 ? 'Completed' : 'Not Completed'}</td>
                                    <td id="setcomplete"><FontAwesomeIcon key={`${task.task_id}-completed`} icon={faCheck} style={{ marginRight: "2vmin" }} onClick={this.setStatus(task.task_id, 1)} /></td>
                                    <td id="setreset"><FontAwesomeIcon key={`${task.task_id}-not-completed`} icon={faTimes} style={{ marginLeft: "2vmin" }} onClick={this.setStatus(task.task_id, 0)} /></td>
                                </tr>
                            )}
                        </tbody>
                    }
                </table>
            </div>
        )
    }
}

export default ListTasks;