export function getTopologyData(secObj, topoUrl) {
    return fetch(topoUrl, {
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
