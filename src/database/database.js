var sqlite3 = require('sqlite3').verbose()

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
    }
});


module.exports = db