import { faCheck, faPlay, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Moment from 'moment';
import { Component } from 'react';
import { getTasks, updateTask } from '../utilities/TaskService';

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

    setStatus = (_id, _username, _title, _details, _date, _status) => (e) => {
        this.setState({ loading: true });
        updateTask(_id, _username, _title, _details, _date, _status).then(res => {
            setTimeout(() => {
                getTasks().then(_tasks => {
                    if (!_tasks) {
                        _tasks = [];
                    }
                    this.setState({ tasks: _tasks, loading: false });
                });        
            }, 2000);
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
                            <th scope="col">Start Task</th>
                            <th scope="col">Complete Task</th>
                            <th scope="col">Reset Task</th>
                        </tr>
                    </thead>
                    {this.state.loading ? <FontAwesomeIcon icon={faSpinner} spin /> :
                        <tbody>
                            {this.state.tasks.map((task) =>
                                <tr key={task.id}>
                                    <th scope="row">{task.id}</th>
                                    <td>{task.userid}</td>
                                    <td>{task.title}</td>
                                    <td>{task.details}</td>
                                    <td>{Moment(task.duedate).format('DD.MM.YYYY')}</td>
                                    <td>{task.status}</td>
                                    <td id="setstart"><FontAwesomeIcon key={`${task.task_id}-started`} icon={faPlay} style={{ marginRight: "2vmin" }} onClick={this.setStatus(task.id, task.userid, task.title, task.details, task.duedate, 'STARTED')} /></td>
                                    <td id="setcomplete"><FontAwesomeIcon key={`${task.task_id}-completed`} icon={faCheck} style={{ marginRight: "2vmin" }} onClick={this.setStatus(task.id, task.userid, task.title, task.details, task.duedate, 'COMPLETED')} /></td>
                                    <td id="setreset"><FontAwesomeIcon key={`${task.task_id}-not-completed`} icon={faTimes} style={{ marginLeft: "2vmin" }} onClick={this.setStatus(task.id, task.userid, task.title, task.details, task.duedate, 'NOTSTARTED')} /></td>
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