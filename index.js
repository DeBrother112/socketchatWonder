import http from "http"
import path from "path"
import fs from "fs"
import { Server } from "socket.io"
import { getMessages, addMessage, isExistUser, addUser } from "./database.js"

const validTokens = []
const __dirname = path.resolve()


let pathToIndex = path.join(__dirname, "static", "index.html")
let indexHtmlFile = fs.readFileSync(pathToIndex)

let pathToStyle = path.join(__dirname, "static", "style.css")
let styleFile = fs.readFileSync(pathToStyle)

let pathToScript = path.join(__dirname, "static", "script.js")
let scriptFile = fs.readFileSync(pathToScript)

let pathToScriptIo = path.join(__dirname, "static", "socket.io.min.js")
let scriptFileIo = fs.readFileSync(pathToScriptIo)

let pathToReg = path.join(__dirname, "static", "reg.html")
let regHtmlFile = fs.readFileSync(pathToReg)

let pathToAuthScript = path.join(__dirname, "static", "auth.js")
let authScript = fs.readFileSync(pathToAuthScript)

let pathToLoginHtml = path.join(__dirname, "static", "login.html")
let LoginHtmlFile = fs.readFileSync(pathToLoginHtml)

let server = http.createServer((req, res) => {
    try {
        if (req.url == "/" && req.method == "GET") {
            return res.end(indexHtmlFile)
        }

        if (req.url == "/style.css" && req.method == "GET") {
            return res.end(styleFile)
        }

        if (req.url == "/script.js" && req.method == "GET") {
            return res.end(scriptFile)
        }

        if (req.url == "/socket.io.min.js" && req.method == "GET") {
            return res.end(scriptFileIo)
        }

        if (req.url == "/register" && req.method == "GET") {
            return res.end(regHtmlFile)
        }

        if (req.url == "/auth.js" && req.method == "GET") {
            return res.end(authScript)
        }

        if (req.url == "/api/register" && req.method == "POST") {
            return registerUser(req, res)
        }

        if (req.url == "/login" && req.method == "GET") {
            return res.end(LoginHtmlFile)
        }

        if (req.url == "/api/login" && req.method == "POST") {
            return loginUser(req, res)
        }


        res.writeHead(404, "Page not found")
        return res.end()

    } catch (error) {
        console.error(error.message)
        res.writeHead(500, "Server error")
        res.end()
    }
})

server.listen(3000, function () {
    console.log("Server started on 3000 port :)")
})

const io = new Server(server)
io.on("connection", (socket) => {
    console.log(`user connected. id ${socket.id}`)
    let username = ""
    socket.on("set_nickname", (data) => {
        username = data
    })

    socket.on("new_message", (data) => {
        io.emit("message", username + " : " + data)
    })
})

function registerUser(req, res) {
    let data = ""
    req.on("data", function (chunk) {
        data += chunk
    })
    req.on("end", async function () {
        try {
            data = JSON.parse(data)
            if (!data.login || !data.password) {
                res.end("login or/and password is empty")
                return
            }

            if (!await isExistUser(data.login)) {
                res.end("User is already exist. Change your login.")
                return
            }

        } catch (err) {
            console.log(err)
            res.end("Error: " + err)
        }

        await addUser(data.login, data.password)
        res.end("Register success!")

    })
    res.end()
}

function loginUser(req, res) {
    let data = ""
    req.on("data", function (chunk) {
        data += chunk
    })
    req.on("end", async function () {
        try {
            data = JSON.parse(data)
            if (!data.login || !data.password) {
                res.end("login and/or password is empty")
                return
            }

            let token = await getAuthToken(data)
            validTokens.push(token)
            res.writeHead(200)
            res.end(token)

        } catch (err) {
            console.log(err)
            res.writeHead(500)
            res.end("Error: " + err)
        }

        await addUser(data.login, data.password)
        res.end("Log in success!")

    })
    res.end()
}