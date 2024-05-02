const headers = require('./header');
function success (response, data=null) {
    if(data){
        response.writeHead(200, headers)
        response.write(JSON.stringify({
            status: 'success',
            data: data || []
        })) 
    }else{
        response.writeHead(204, headers)
        response.write(JSON.stringify({
            status: 'fall',
            data: []
        }))
    }
    response.end()
}

function createSuccess (response, data=null) {
    response.writeHead(201, headers)
    response.write(JSON.stringify({
        status: 'success',
        data: data || []
    })) 
    response.end()
}
module.exports = {
    success,
    createSuccess
}