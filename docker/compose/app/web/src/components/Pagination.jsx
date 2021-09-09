/* eslint-disable jsx-a11y/anchor-is-valid */
import { Component, useState, useEffect } from 'react';

const PaginationHook = (props) => {
    const [pageToNavigate, setPageToNavigate] = useState(-1);

    var pageStart = props.start;
    var pageEnd = props.end;
    var pageList = Array(pageEnd - pageStart + 1).fill().map((_, idx) => pageStart + idx);
    var maxNoOfPages = props.maxNoOfPages;

    const pageClick = (e) => {
        setPageToNavigate(parseInt(e.target.innerText));
    }

    const prevPage = (e) => {
        if (props.activePage > 1) {
            setPageToNavigate(parseInt(props.activePage) - 1);
        }
    }

    const nextPage = (e) => {
        if (props.activePage < maxNoOfPages) {
            setPageToNavigate(parseInt(props.activePage) + 1);
        }
    }

    useEffect(() => {
        if (pageToNavigate !== -1) {
            props.pageChangeHandler(pageToNavigate);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageToNavigate]);

    return (
        <nav aria-label="Task list pagination">
            <ul className="pagination justify-content-end">
                <li className={`page-item ${props.firstPage ? 'disabled' : ''}`}>
                    <a href="#" className="page-link" aria-label="Previous" onClick={prevPage}>
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                {pageList.map(page =>
                    <li className={`page-item ${props.activePage === parseInt(page) ? 'active' : ''}`}><a href="#" className="page-link" onClick={pageClick}>{page}</a></li>
                )}
                <li className={`page-item ${props.lastPage ? 'disabled' : ''}`} onClick={nextPage}>
                    <a href="#" className="page-link" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    )
}

class Pagination extends Component {
    render() {
        return (
            <div>
                <PaginationHook
                    start={this.props.start}
                    end={this.props.end}
                    activePage={this.props.activePage}
                    firstPage={this.props.firstPage}
                    lastPage={this.props.lastPage}
                    maxNoOfPages={this.props.maxNoOfPages}
                    pageChangeHandler={this.props.pageChangeHandler} />
            </div>
        )
    }
}

export default Pagination;