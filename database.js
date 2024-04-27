import { existsSync } from "fs"
import { open } from "sqlite"
import sqlite3 from "sqlite3"

let dbfile = "./chat.db"
let exists = existsSync(dbfile)
let db
sqlite3.verbose()

export default function () {
    open({
        filename: dbfile,
        driver: sqlite3.Database
    }).then(async (dBase) => {
        db = dBase
        try {
            if (!exists) {
                await db.run(`
            create table user(
                user_id integer primary key autoincrement,
                login text, not null, unique,
                password text not null,
            );
            `)
                await db.run(`
            create table message(
                msg_id integer primary key autoincrement,
                content text, not null,
                author integer,
                foreign key(author) references user(user_id)
            );
            `)
                await db.run(`
            insert into user(login, password) values
            ("admin", "admin"),
            ("Wonder", "Wonder"),
            ("VOLODYA","SURIHIN");
            `)
            } else {
                await db.all(`
            select * from user;
            `)
            }
        } catch (error) {
            console.error(error)
        }
    })
}
    export async function getMessages() {
        try {
            return await db.all("select * from user;")
        } catch (error) {
            console.error(error)
        }
    }