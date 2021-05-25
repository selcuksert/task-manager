import React, {Component} from 'react';
import $ from 'jquery/dist/jquery';
import Moment from "moment";

class TaskDetailModal extends Component {
    constructor(props) {
        super(props);
        this.modalRef = React.createRef();
    }

    showModal = () => {
        let modal = this.modalRef.current;
        $(modal).modal('show');
    }

    hideModal = () => {
        let modal = this.modalRef.current;
        $(modal).modal('hide');
    }

    componentDidUpdate(prevProps) {
        if (prevProps.showModal !== this.props.showModal) {
            if (this.props.showModal) {
                this.showModal();
            } else {
                this.hideModal();
            }
        }
    }

    render() {
        Moment.locale('tr');
        return (
            <div>
                <div className="modal fade" ref={this.modalRef} id="infoModal" tabIndex="1">
                    <div className="modal-dialog modal-dialog-scrollable modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Task Details</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-md-2 d-inline p-2 bg-primary text-white">ID:</div>
                                        <div className="col-md-10 ml-auto d-inline p-2 bg-light text-dark">{this.props.task.id}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-2 d-inline p-2 bg-primary text-white">First Name:</div>
                                        <div className="col-md-10 ml-auto d-inline p-2 bg-light text-dark">{this.props.task.firstname}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-2 d-inline p-2 bg-primary text-white">Last Name:</div>
                                        <div className="col-md-10 ml-auto d-inline p-2 bg-light text-dark">{this.props.task.lastname}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-2 d-inline p-2 bg-primary text-white">Title:</div>
                                        <div className="col-md-10 ml-auto d-inline p-2 bg-light text-dark">{this.props.task.title}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-2 d-inline p-2 bg-primary text-white">Updated At:</div>
                                        <div
                                            className="col-md-10 ml-auto d-inline p-2 bg-light text-dark">{Moment(parseInt(this.props.task.generatedat)).format('DD.MM.YYYY HH:mm:ss')}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-2 d-inline p-2 bg-primary text-white">Details:</div>
                                        <div className="col-md-10 ml-auto d-inline p-2 bg-light text-dark">{this.props.task.details}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-2 d-inline p-2 bg-primary text-white">Due Date:</div>
                                        <div
                                            className="col-md-10 ml-auto d-inline p-2 bg-light text-dark">{Moment(this.props.task.duedate).format('DD.MM.YYYY')}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-2 d-inline p-2 bg-primary text-white">Status:</div>
                                        <div className="col-md-10 ml-auto d-inline p-2 bg-light text-dark">{this.props.task.status}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default TaskDetailModal;