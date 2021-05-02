// Utilities
export function addTask(_username, _title, _details, _date) {
    return fetch(`http://${window.location.hostname}/api/task`, {
            method: 'post',
            body: JSON.stringify({
                username: _username,
                title: _title,
                details: _details,
                date: _date
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
    return fetch(`http://${window.location.hostname}/api/task`, {
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then(res => res.json())
        .catch(err => console.error(err));
}

export function updateTaskStatus(_taskId, _status) {
    return fetch(`http://${window.location.hostname}/api/task/status`, {
            method: 'post',
            body: JSON.stringify({
                taskId: _taskId,
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
