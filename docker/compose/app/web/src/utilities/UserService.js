// Utilities
export function addUser(selectedUser, secObj) {
    return fetch(`http://${window.location.hostname}/api/user/writer`, {
        method: 'post',
        body: JSON.stringify({
            id: selectedUser.username,
            firstname: selectedUser.firstName,
            lastname: selectedUser.lastName
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
                return {error: 'Forbidden', message: 'Forbidden to add user'};
            }
        })
        .catch(err => console.error(err));
}

export function getUsers(secObj) {
    return fetch(`http://${window.location.hostname}/api/user/reader`, {
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

export function getUsersFromIdp(secObj) {
    return fetch(`${secObj.authServerUrl}admin/realms/${secObj.realm}/users`, {
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