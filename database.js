import { existsSync } from "fs";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import crypto from "crypto"

let dbfile = "./chat.db";
let exists = existsSync(dbfile);
let db;
try {
    db = await open({
        filename: dbfile,
        driver: sqlite3.Database,
    });
    if (!exists) {
        await db.exec(`
                CREATE TABLE user(
                    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    login TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL
                );
            `);
        await db.exec(`
                CREATE TABLE message(
                    msg_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    content TEXT NOT NULL,
                    author INTEGER,
                    FOREIGN KEY(author) REFERENCES user(user_id)
                );
            `);
        await db.exec(`
                INSERT INTO user(login, password) VALUES
                ("lena", "golovach"),
                ("Vo", "Wonder"),
                ("bebra", "men");
            `);
    }
} catch (error) {
    console.error(error);
}
export async function getMessages() {
    try {
        return await db.all("SELECT msg_id, content, login, password, user_id from message join user on message.author = user.user_id;");
    } catch (error) {
        console.error(error);
    }
}

export async function addMessage(msg, userid) {
    try {
        await db.run(`insert into message(content, author) values (?, ?)`, [msg, userid]);
    } catch (error) {
        console.error(error);
    }
}
export async function isExistUser(login) {
    try {
        let candidate = await db.all(`select * from user where login = ?`, [login])
        return !candidate.length
    } catch (err) {
        console.error(err)
    }
}

export async function addUser(login, password) {
    try {
        await db.run(`insert into user(login, password) values("${login}", "${password}");`)
    } catch (error) {
        console.log(error)
    }
}

export async function getAuthToken(user) {
    let candidate = await db.all(`select * from user where login="${user.login}";`)
    if (!candidate.length) {
        throw "wrong password"
    }
    if (candidate[0].password !== user.password) {
        throw "wrong password"
    }
    return candidate[0].user_id + ""
     + candidate[0].login 
     + "" + crypto.randomBytes(20).toString("hex")
}