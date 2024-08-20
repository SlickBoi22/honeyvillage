const https = require('https')
const fs = require('fs')

const port = 443
const ip = '127.0.0.1'
const cachePath = './gamedata'
const options = {
    key: fs.readFileSync('Certificates/cert.key'),
    cert: fs.readFileSync('Certificates/cert.pem')
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
      console.log(`Failed to find ${json.map}.tmx on the local server. Private message me on f95zone with this error. My username is Jetray22`)
      console.log(`Defaulting to starter map to prevent a game crash.`)
      fs.createReadStream(`${cachePath}/${json.scenario}/${json.version}/map/0010001.tmx`).pipe(res)
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
})

console.log(`server listening on ${ip}:${port}`)

