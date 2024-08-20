const https = require('https')
const fs = require('fs')
const zlib = require("zlib"); 

const port = 443
const ip = '127.0.0.1'
const cachePath = './gamedata'
const options = {
    key: fs.readFileSync('cert.key'),
    cert: fs.readFileSync('cert.pem')
}

function handlerAuthCheck(req, res) {
    let json = JSON.parse(req.body)
    msg = `{"auth":true,"authed_token":"","tier":4,"user_name":"${json.user_name}"}`
    res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': msg.length
    })
    res.end(msg)
}


function handlerGamedataMap(req, res) {
    let json = JSON.parse(req.body)
    let path = `${cachePath}/${json.scenario}/${json.version}/map/${json.map}.tmx`
    let dirPath = `${cachePath}/${json.scenario}/${json.version}/map/`
    let upstreamURL = `https://api.pinkcafeart.com/gamedata/map`
    if (fs.existsSync(path)) {
        console.log(`serving ${json.map}.tmx using cached file`)
        fs.createReadStream(path).pipe(res)
    } else {

let response
let text
easyreq = `{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMWZRaDkxNGp2WFNDIiwidXNlcl9uYW1lIjoiY2llbjE4Nzc0OTYiLCJwYXNzd29yZCI6IldOUTlXUzlFIiwiaWF0IjoxNzIzOTUxNDI4LCJleHAiOjE3MjQwMzc4Mjh9.2LB4m8Zp-fTO9GsD3Z9Zp4Uh9nCtdRdSPHddnAFsUIw","scenario":"04_fantasy","version":"14","map":"${json.map}"}`

fetch(upstreamURL, {
  method: "POST",
  body: easyreq,
  headers: {
    "Content-type": "application/json; charset=utf-8"
  }
})
  .then(
    response => response.text()
  ).then(
    text => { 

fs.closeSync(fs.openSync(path, 'w'));
var writeStream = fs.createWriteStream(path);
writeStream.write(text);
writeStream.end();

}).then(
ez => { 

setTimeout(function() {
      if (fs.existsSync(path)) {
        console.log(`serving ${json.map}.tmx using cached file`)
        fs.createReadStream(path).pipe(res)
    }
}, 2000);

});

    }
}

function get(url, callback) {
    https.get(url, res => {
        res.body = ''
        res.on('data', chunk => res.body += chunk)
        res.on('end', () => callback(res))
    })
}

https.createServer(options, (req, res) => {
    if (req.method === 'POST') {
        req.body = ''
        req.on('data', chunk => req.body += chunk)
        req.on('end', () => {
            // console.log(req.headers)
            console.log(`\n${req.method} ${req.url}\n${req.body}`)
            let msg
            let obj = JSON.parse(req.body)
            switch (req.url) {
                case '/auth/check':
                    handlerAuthCheck(req, res)
                    break
                case '/gamedata/map':
                    handlerGamedataMap(req, res)
                    break
                default:
                    console.log('unimplemented')
                    res.end('unimplemented')
            }
        })
    } else {
    if (req.method === 'GET') {
            console.log(`\n${req.method} ${req.url}\n${req.body}`)
            switch (req.url) {
                case '/master?type=HoneyVillage':
                    console.log(`Sending client the update list`)
                    fs.createReadStream('./Master/master.xml').pipe(res)
                    break
                case '/master?type=Common':
                    console.log(`Sending client the update list`)
                    fs.createReadStream('./Master/master.xml').pipe(res)
                    break
		case '/gamedata/map':
                    console.log('Sending client the map.')
      		    fs.createReadStream('./gamedata/04_fantasy/10/map/0010001.tmx').pipe(res)
                    break
                default:
                    console.log(`\n${req.method} ${req.url}: unimplemented`)
                    res.end()
        }
      }
    } 
}).listen(port, ip)

console.log(`server listening on ${ip}:${port}`)

