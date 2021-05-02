import React, { Component } from 'react';
import $ from 'jquery/dist/jquery';


class Modal extends Component {
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
            }
            else {
                this.hideModal();
            }
        }

    }

    render() {
        return (
            <div>
                <div className="modal fade" ref={this.modalRef} id="infoModal" tabIndex="1" >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{this.props.modalTitle}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>{this.props.modalText}</p>
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

export default Modal;