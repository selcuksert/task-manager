// Utilities
export function addUser(_username, _firstName, _lastName, token) {
    return fetch(`http://${window.location.hostname}/api/user/writer`, {
        method: 'post',
        body: JSON.stringify({
            id: _username,
            firstname: _firstName,
            lastname: _lastName
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
                return { error: 'Unauthorized', message: 'Unauthorized to add user' };
            }
            else if (res.status === 403) {
                return { error: 'Forbidden', message: 'Forbidden to add user' };
            }
        })
        .catch(err => console.error(err));
}

export function getUsers(token) {
    return fetch(`http://${window.location.hostname}/api/user/reader`, {
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