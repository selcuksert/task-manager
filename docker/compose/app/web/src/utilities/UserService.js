// Utilities
export function addUser(_username, _firstName, _lastName) {
    return fetch(`http://${window.location.hostname}/api/user`, {
            method: 'post',
            body: JSON.stringify({
                username: _username,
                firstName: _firstName,
                lastName: _lastName
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
    return fetch(`http://${window.location.hostname}/api/user`, {
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then(res => res.json())
        .catch(err => console.error(err));
}