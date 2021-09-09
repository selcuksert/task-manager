// Utilities
export function addTask(_username, _title, _details, _date, secObj) {
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
            "Authorization": `Bearer ${secObj.token}`
        }
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else if (res.status === 401) {
                secObj.logout();
            } else if (res.status === 403) {
                return { error: 'Forbidden', message: 'Forbidden to add task' };
            }
        })
        .catch(err => console.error(err));
}

export function deleteTaskById(id, secObj) {
    return fetch(`http://${window.location.hostname}/api/task/writer`, {
        method: 'delete',
        body: id,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${secObj.token}`
        }
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else if (res.status === 401) {
                secObj.logout();
            } else if (res.status === 403) {
                return { error: 'Forbidden', message: 'Forbidden to delete task' };
            }
        })
        .catch(err => console.error(err));
}

export function updateTask(_id, _username, _title, _details, _date, _status, secObj) {
    return fetch(`http://${window.location.hostname}/api/task/writer/update`, {
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
            "Authorization": `Bearer ${secObj.token}`
        }
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else if (res.status === 401) {
                secObj.logout();
            } else if (res.status === 403) {
                return { error: 'Forbidden', message: 'Forbidden to update task' };
            }
        })
        .catch(err => console.error(err));
}

export function getAllTasks(secObj, pageSize, pageNumber) {
    // Spring Data JPA starts page number from 0
    return fetch(`http://${window.location.hostname}/api/task/reader/all?size=${pageSize}&page=${parseInt(pageNumber) - 1}`, {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${secObj.token}`
        }
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else if (res.status === 401) {
                secObj.logout();
            } else if (res.status === 403) {
                return [];
            }
        })
        .catch(err => console.error(err));
}

export function getOwnedTasks(secObj) {
    return fetch(`http://${window.location.hostname}/api/task/reader/owned`, {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${secObj.token}`
        }
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else if (res.status === 401) {
                secObj.logout();
            } else if (res.status === 403) {
                return [];
            }
        })
        .catch(err => console.error(err));
}

export function getTaskById(taskId, secObj) {
    let url = new URL(`http://${window.location.hostname}/api/task/processor/detail`);
    url.searchParams.set('taskId', taskId);

    return fetch(url, {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${secObj.token}`
        }
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else if (res.status === 401) {
                secObj.logout();
            } else if (res.status === 403) {
                return { error: 'Forbidden', message: 'Forbidden to get task details' };
            }
        })
        .catch(err => console.error(err));
}

export function getTaskCountByUserId(userId, secObj) {
    let url = new URL(`http://${window.location.hostname}/api/task/processor/count`);
    url.searchParams.set('userId', userId);

    return fetch(url, {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${secObj.token}`
        }
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else if (res.status === 401) {
                secObj.logout();
            } else if (res.status === 403) {
                return { error: 'Forbidden', message: 'Forbidden to get task count' };
            }
        })
        .catch(err => console.error(err));
}

