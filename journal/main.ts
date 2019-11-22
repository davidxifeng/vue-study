const sqlite3 = require('sqlite3').verbose();

function db_test() {
  const db = new sqlite3.Database('data.db');
  db.serialize(function() {
    db.run("CREATE TABLE lorem (info TEXT)");

    const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (let i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();
  
    db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
        console.log(row.id + ": " + row.info);
    });
  });
  
  db.close();
}

import { Gitlab } from 'gitlab';
const fs = require("fs").promises;

async function readConfig() {
  const fileContent = await fs.readFile("config.json");
  const config:{token: string, projectId: string} = JSON.parse(fileContent);
  return config;
}


async function gitlab_test() {
  const cfg = await readConfig();
  const api = new Gitlab({ token: cfg.token,});
  let issues = await api.Issues.all({
    projectId: cfg.projectId,
    maxPages: 2,
    perPage: 2
  });
  return issues;
}
gitlab_test().then( v => {
  console.log(v);
}).catch( e => {
  console.error(e);
});

