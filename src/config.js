let secrets; 
const secretsLocation = process.argv.slice(3,3)

if (secretsLocation?.length) {
    secrets = require(secretsLocation);
} else {
    secrets = require('../env/local/secrets.json');
}

module.exports = { 
    jwtSecret: secrets.jwtSecret 
}