import http from "http"
import path from "path"
import fs from "fs"

const __dirname = path.resolve()

let pathToIndex = path.join(__dirname, "static", "index.html")
let indexHtmlFile = fs.readFileSync(pathToIndex)

let pathToStyle = path.join(__dirname, "static", "style.css")
let styleFile = fs.readFileSync(pathToStyle)

let pathToScript = path.join(__dirname, "static", "script.js")
let scriptFile = fs.readFileSync(pathToScript)

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