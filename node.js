const fs = require('fs')
const path = require('path')
const http = require('http')
const mdns = require('multicast-dns')()
var foundAROZ = foundAROZ_API = {}

mdns.on('response', function(response) {
  //console.log('got a response packet:', response)
  var tcpInfo = {} //extracting useful data from each mDNS response
  try {
    response.additionals.forEach(additional => {
        if(!tcpInfo[additional.name]) tcpInfo[additional.name]={}
        switch (additional.type) {
        case 'TXT':
            additional.data.forEach(data => {
                data = data.toString()
                tcpInfo[additional.name][data.split('=')[0]] = data.substring(data.indexOf('=')+1)
            })
            break
      
        case 'SRV':
            tcpInfo[additional.name]["srv"] = additional.data
            break

        }
  })
  if(tcpInfo === {}) return //if no mdns resp then exit

  //console.log(tcpInfo)

  Object.keys(tcpInfo).forEach(key => {
    if(!tcpInfo[key].domain || tcpInfo[key].domain != 'arozos.com' || !tcpInfo[key].srv) return //if no domain or domain not match or no srv then exit
    foundAROZ[tcpInfo[key].srv.target + ':' + tcpInfo[key].srv.port] = JSON.parse(JSON.stringify(tcpInfo[key])) //add into found
  })

  } catch (error) { console.log('err:' + error) }
})

setInterval(() => { //scan mDNS
    mdns.query({
        questions:[{
          name: '_http._tcp.local',
          type: 'TXT',
        }]
    })
}, 4000)

setInterval(() => { //clear foundAROZ periodically
    console.log(foundAROZ)
    if (foundAROZ != {}) foundAROZ_API = JSON.parse(JSON.stringify(foundAROZ))
    foundAROZ = {}
}, 8000)


//webserver
const serverAPI = http.createServer((req, res) => {
    console.log(req.method + " - " + req.url + " - " + new Date().toDateString() + ' - ' + new Date().toLocaleTimeString())
        
    if (req.url.startsWith('/!')) {
      if (req.url === '/!foundAROZ/') {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Server': 'joutou' })
        res.end(JSON.stringify( foundAROZ_API ))
        return
      }
  
      returnErr(res, 404, 'no-such-fx', true)
      return
    }
  
    if (req.url.toLowerCase() === '/init.js' || req.url.toLowerCase() === '/boot.js') {
        res.writeHead(200, { 'Content-Type': 'application/javascript;charset=utf-8', 'Cache-Control': 'max-age=7200' })
        fs.readFile('' + __dirname + path.sep + req.url.toLowerCase().substring(1), 'utf8', (err, data) => { (err) ? res.end("") : res.end(data) })
        return
    }

    if (req.url.toLowerCase() === '/webel.css') {
        res.writeHead(200, { 'Content-Type': 'text/css;charset=utf-8' })
        fs.readFile('' + __dirname + path.sep + 'webel.css', 'utf8', (err, data) => { (err) ? res.end("") : res.end(data) })
        return
    }
    
    if (req.url.toLowerCase() === '/robots.txt') {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end(`User-agent: *\nDisallow: *`)
        return
    }

    if (req.url.toLowerCase() === '/favicon.ico') {
        res.writeHead(200, { 'Content-Type': 'image/x-icon', 'Cache-Control': 'max-age=604800' })
        fs.readFile('' + __dirname + path.sep + 'favicon.ico', '', (err, data) => { (err) ? res.end("") : res.end(data) })
        return
    }
    
    if (req.url === '/') { 
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
        fs.readFile('' + __dirname + path.sep + "index.html", 'utf8', (err, data) => { (err) ? res.end("") : res.end(data) })
        return
    }

    returnErr(res, 404, 'Page not found')
    
})
serverAPI.listen(7070, "localhost")
console.log("Web Server Starting / 7070")

const returnErr = (res, statusCode = 404, message = "", useJSON = false) => {
    var headerStr = {}
    headerStr['Content-Type'] = (useJSON) ? 'application/json; charset=utf-8' : 'text/html; charset=utf-8'

    res.writeHead(statusCode, headerStr)

    if (useJSON) {
        if (message) {
            res.end(JSON.stringify({ status: statusCode, msg: message }))
        } else {
            res.end(JSON.stringify({ status: statusCode }))
        }
    } else {
        res.end(errPageHTML(statusCode, message))
    }
}

const errPageHTML = (statusCode, message = "") => {
    return `<h1>` + statusCode + `</h1><p1>` + message + `</p1>`
}