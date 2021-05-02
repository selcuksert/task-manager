// Utilities
export function addUser(_username, _firstName, _lastName) {
    return fetch(`http://${window.location.hostname}/api/user/writer`, {
            method: 'post',
            body: JSON.stringify({
                id: _username,
                firstname: _firstName,
                lastname: _lastName
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then(res => res.json())
        .catch(err => console.error(err));
}

export function getUsers() {
    return fetch(`http://${window.location.hostname}/api/user/reader`, {
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then(res => res.json())
        .catch(err => console.error(err));
}