// Create express app
const express = require("express")
const sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE SKILL (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            image text,
            description text,
            CONSTRAINT name_unique UNIQUE (name)
            )`,
            (err) => {
                if (err) {
                    // Table already created
                }else{
                    console.log("insertions des compétences en cours")
                    // Table just created, creating some rows
                    var insert = 'INSERT INTO SKILL (name, image, description) VALUES (?,?,?)'
                    db.run(insert, ["Vue3","/src/assets/vue.png","framework frontend"])
                }
            });
        db.run(`CREATE TABLE PROJECT (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text,
            image text,
            description text,
            lien text,
            dates text,
            client text,
            CONSTRAINT name_unique UNIQUE (title)
            )`,
            (err) => {
                if (err) {
//                console.log(err)
                    // Table already created
                }
            });

        db.run(`CREATE TABLE JOBS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title text,
        image text,
        job_description text,
        competences text,
        durations text,
        date_debut text,
        date_fin text,
        business_name text,
        CONSTRAINT name_unique UNIQUE (title)
        )`
            , (err) => {if (err) {console.error(err)}} )
    }
});

const app = express()

const cors = require('cors');
const serverless = require("serverless-http")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
// Server port
// const HTTP_PORT = 4975
// Start server
// app.listen(HTTP_PORT, () => {
//     console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
// });
// Root endpoint
app.get("/test", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Insert here other API endpoints

app.get("/api/skill", (req, res, next) => {
    const sql = "select * from SKILL ORDER BY name"
    const params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.get("/api/skill/:id", (req, res, next) => {
    const sql = "select * from SKILL where id = ?";
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.header().status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":row
        })
    });
});



app.get("/api/projects", (req,res,next) => {
    const sql = "select * from PROJECT"
    const params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
})

app.get("/api/projects/:id", (req, res, next) => {
    var sql = "select * from PROJECT where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.header().status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":row
        })
    });
});


app.get('/api/jobs/',(req,res,next) => {
    const SQL_REQUEST = 'SELECT * FROM JOBS';
    const params = []
    db.all(SQL_REQUEST, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    })
});



// Default response for any other request
app.get('*' , function(req, res){
    console.log("ici")
    res.status(404).json({"error" : "No found"});

    return
});
app.post('*' , function(req, res){
    console.log("ici")
    res.status(404).json({"error" : "Not found"});

    return
});



module.exports.handler = serverless(app)
