// Utilities
export function addTask(_username, _title, _details, _date) {
    return fetch(`http://${window.location.hostname}/api/task/writer`, {
        method: 'post',
        body: JSON.stringify({
            userid: _username,
            title: _title,
            details: _details,
            duedate: _date
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
        .then(res => res.json())
        .catch(err => console.error(err));
}

export function updateTask(_id, _username, _title, _details, _date, _status) {
    return fetch(`http://${window.location.hostname}/api/task/writer`, {
        method: 'put',
        body: JSON.stringify({
            id: _id,
            userid: _username,
            title: _title,
            details: _details,
            duedate: _date,
            status: _status
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
        .then(res => res.json())
        .catch(err => console.error(err));
}

export function getTasks() {
    return fetch(`http://${window.location.hostname}/api/task/reader`, {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(res => res.json())
    .catch(err => console.error(err));
}

export function getTaskById(_taskId) {
    let url = new URL(`http://${window.location.hostname}/api/task/processor`);
    url.searchParams.set('taskId', _taskId);

    return fetch(url, {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(res => res.json())
    .catch(err => console.error(err));
}
