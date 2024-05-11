const fs = require('fs/promises')



exports.retrieveEndpoints = () =>{
    return fs.readFile('endpoints.json', 'utf-8')
}