// Create express app
const express = require("express")
const app = express()
const db = require("./src/database/database")
const cors = require('cors');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
// Server port
const HTTP_PORT = 4975 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
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
    var sql = "select * from SKILL where id = ?"
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


app.post("/api/skill/", (req,res,next) => {
    const errors = [];
    console.log(req.body)
    if (!req.body.name){
        errors.push('No name specified')
    }
    if (!req.body.image){
        errors.push('No image specified')
    }
    
    if (!req.body.description){
        errors.push('No description specified')
    }
    if (errors.length){
        res.json({"error" : errors.join(",")})
        return
    }
    const data = {
        name : req.body.name,
        image : req.body.image,
        description : req.body.description
    }
    const  sql = 'INSERT INTO SKILL (name, image, description) VALUES (?,?,?)'
    const params = [data.name,data.image,data.description]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.delete("/api/skill/:id", (req,res,next) => {
    db.run(
        'DELETE FROM SKILL WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

app.patch("/api/skill/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        image: req.body.image,
        description : req.body.description
    }
    db.run(
        `UPDATE SKILL set 
           name = COALESCE(?,name), 
           image = COALESCE(?,image), 
           description = COALESCE(?,description) 
           WHERE id = ?`,
        [data.name, data.image, data.description, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})

app.get("/api/projects", (req,res,next) => {
    const sql = "select * from PROJECT ORDER BY dates DESC"
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

app.post("/api/projects/", (req,res,next) => {
    const errors = [];
    console.log(req.body)
    if (!req.body.title){
        errors.push('No name specified')
    }
    if (!req.body.image){
        errors.push('No image specified')
    }
    
    if (!req.body.description){
        errors.push('No description specified')
    }
    if (!req.body.link){
        errors.push('No link specified')
    }
    
    if (!req.body.dates){
        errors.push('No date specified')
    }
    
    if (!req.body.client){
        errors.push('No client specified')
    }
    
    
    if (errors.length){
        res.json({"error" : errors.join(",")})
        return
    }
    const data = {
        title : req.body.title,
        image : req.body.image,
        description : req.body.description,
        lien : req.body.link,
        dates : req.body.dates,
        client : req.body.client
    }
    const  sql = 'INSERT INTO PROJECT (title, image, description, lien, dates, client) VALUES (?,?,?,?,?,?)'
    const params = [data.title,data.image,data.description, data.lien, data.dates, data.client]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})


app.patch("/api/projects/:id", (req, res, next) => {
    const data = {
        title : req.body.title,
        image : req.body.image,
        description : req.body.description,
        lien : req.body.link,
        dates : req.body.dates,
        client : req.body.client
    }
    db.run(
        `UPDATE PROJECT set 
           title = COALESCE(?,title), 
           image = COALESCE(?,image), 
           description = COALESCE(?,description),
           lien = COALESCE(?,lien) ,
           dates = COALESCE(?,dates),
           client = COALESCE(?,client)
           WHERE id = ?`,
        [data.title,data.image,data.description, data.lien, data.dates,data.client, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                console.log(err)
                console.log(req)
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})





app.delete("/api/projects/:id", (req,res,next) => {
    db.run(
        'DELETE FROM PROJECT WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

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
