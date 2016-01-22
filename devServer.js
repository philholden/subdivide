'use strict'

let express = require('express')
let webpack = require('webpack')
let config = require('./webpack.config.dev')
let compression = require('compression')

// let path = require('path') 
// let requestProxy = require('express-request-proxy')
// let objectAssign = require('object-assign')

let app = express()
let server = require('http').createServer(app)
let io = require('socket.io')(server)

let compiler = webpack(config)
let port = 3000

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))

app.use(require('webpack-hot-middleware')(compiler))

app.use(compression({
  threshold: 512
}))

app.use('/', express.static('.'))
app.use('/components/', express.static('./docs/build'))

// app.all('*', function(req, res, next) {
//   let url = require('url').parse(req.url)
//   let conf = objectAssign({}, req, {
//     url: 'http://127.0.0.1:8888' + url.pathname,
//     timeout: 120000
//   })
//   requestProxy(conf)(req, res, next)
// })

// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'index.html'))
// })

server.listen(port, '0.0.0.0', function (err) {
  if (err) {
    console.log(err) // eslint-disable-line no-console
    return
  }
  console.log('Listening at http://localhost:' + port) // eslint-disable-line no-console
})

io.on('connection', function (socket) {
  io.set('origins', '*:*')
  console.log('connected') // eslint-disable-line no-console
  socket.emit('update', 'connected')
  socket.on('single', function () {
    socket.emit('update', 'single')
  })
  socket.on('publish', function (data) {
    io.sockets.emit('update', data)
  })
})
