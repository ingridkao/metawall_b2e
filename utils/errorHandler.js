const headers = require('./header');
function errorMsg (response, error) {
    response.writeHead(400, headers)
    response.write(JSON.stringify({
        status: 'fall',
        data: error.toString()
    }))
    response.end()
}
function noFound (response) {
    response.writeHead(404, headers)
    response.write(JSON.stringify({
        status: 'fall',
        message: 'Not found'
    }))
    response.end()
}

module.exports = {
    errorMsg,
    noFound
}