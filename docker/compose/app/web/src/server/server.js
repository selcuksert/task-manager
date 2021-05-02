var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

var app = express();

const port = 9080;
const host = '0.0.0.0';

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json())

dbInit = () => {
    let createTaskTableStmt = "CREATE TABLE IF NOT EXISTS tasks " +
        "(task_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "username TEXT NOT NULL, " +
        "title TEXT NOT NULL, " +
        "details TEXT NOT NULL, " +
        "duedate TEXT NOT NULL, " +
        "completed INTEGER NOT NULL)";

    let createUserTableStmt = "CREATE TABLE IF NOT EXISTS users " +
        "(user_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "username TEXT NOT NULL UNIQUE, " +
        "first_name TEXT NOT NULL, " +
        "last_name TEXT NOT NULL)";

    db.run(createTaskTableStmt);
    db.run(createUserTableStmt);
}

checkParameters = (obj) => {
    for (var key in obj) {
        if (!obj[key]) {
            return false;
        }
    }
    return true;
}

addTask = (task, res) => {
    if (!checkParameters(task)) {
        res.json({
            errno: 999,
            code: 'Please fill all fields!'
        });

        return;
    }

    let stmt = db.prepare("INSERT INTO tasks (username, title, details, duedate, completed) VALUES (?, ?, ?, ?, ?)");

    db.serialize(() => {
        stmt.run(task.username, task.title, task.details, task.date, 0, err => {
            if (err) {
                res.json(err);
            }
            else {
                res.json(task);
            }
        });
        stmt.finalize();
    });
}

updateTaskStatus = (req, res) => {
    let stmt = db.prepare("UPDATE tasks SET completed = ? WHERE task_id = ?");

    db.serialize(() => {
        stmt.run(req.status, req.taskId, err => {
            if (err) {
                res.json(err);
            }
            else {
                res.json({
                    task_id: req.taskId,
                    completed: req.status
                });
            }
        });
        stmt.finalize();
    });
}

addUser = (user, res) => {
    if (!checkParameters(user)) {
        res.json({
            errno: 999,
            code: 'Please fill all fields!'
        });

        return;
    }

    let stmt = db.prepare("INSERT INTO users (username, first_name, last_name) VALUES (?, ?, ?)");

    db.serialize(() => {
        stmt.run(user.username, user.firstName, user.lastName, err => {
            if (err) {
                res.json(err);
            }
            else {
                res.json(user);
            }
        });
        stmt.finalize();
    });
}

getTasks = (res) => {
    let stmt = "SELECT * from tasks";
    let tasks = [];

    db.serialize(() => {
        db.all(stmt, [], (err, rows) => {
            if (err) {
                res.json(err);
                return;
            }

            let data = [];

            rows.forEach((row) => {
                data.push(row);
            });
            res.json(data);
        });
    });

    return tasks;
}

getUsers = (res) => {
    let stmt = "SELECT * from users";

    db.serialize(() => {
        db.all(stmt, [], (err, rows) => {
            if (err) {
                res.json(err);
                return;
            }

            let data = [];

            rows.forEach((row) => {
                data.push(row);
            });
            res.json(data);
        });
    });
}

app.get('/tasks', (req, res) => {
    getTasks(res);
});

app.get('/users', (req, res) => {
    getUsers(res);
});

app.post('/user', (req, res) => {
    let user = req.body;
    addUser(user, res);
});

app.post('/task', (req, res) => {
    let task = req.body;
    addTask(task, res);
});

app.post('/task/status', (req, res) => {
    let taskStat = req.body;
    updateTaskStatus(taskStat, res);
});

app.listen(port, host, () => {
    dbInit();
    console.log(`Listening at http://${host}:${port}`);
})

process.on('SIGINT', (code) => {
    console.log('Process interrupt event with code: ', code);
    process.exit();
});

process.on('exit', (code) => {
    console.log('Process exit event with code: ', code);
    db.close();
});

