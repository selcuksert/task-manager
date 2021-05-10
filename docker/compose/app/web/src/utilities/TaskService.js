// Utilities
export function addTask(_username, _title, _details, _date, token) {
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
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            }
            else if (res.status === 401) {
                return { error: 'Unauthorized', message: 'Unauthorized to add task' };
            }
            else if (res.status === 403) {
                return { error: 'Forbidden', message: 'Forbidden to add task' };
            }
        })
        .catch(err => console.error(err));
}

export function updateTask(_id, _username, _title, _details, _date, _status, token) {
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
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            }
            else if (res.status === 401) {
                return { error: 'Unauthorized', message: 'Unauthorized to update task' };
            }
            else if (res.status === 403) {
                return { error: 'Forbidden', message: 'Forbidden to update task' };
            }
        })
        .catch(err => console.error(err));
}

export function getTasks(token) {
    return fetch(`http://${window.location.hostname}/api/task/reader`, {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            }
            else if (res.status === 401 || res.status === 403) {
                return [];
            }
        })
        .catch(err => console.error(err));
}

export function getTaskById(_taskId, token) {
    let url = new URL(`http://${window.location.hostname}/api/task/processor`);
    url.searchParams.set('taskId', _taskId);

    return fetch(url, {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            }
            else if (res.status === 401) {
                return { error: 'Unauthorized', message: 'Unauthorized to add user' };
            }
            else if (res.status === 403) {
                return { error: 'Forbidden', message: 'Forbidden to add user' };
            }
        })
        .catch(err => console.error(err));
}
