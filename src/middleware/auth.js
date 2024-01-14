const jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");

module.exports = (request, response, next) => {
    try {
        const token = request.headers.authorization;
        jwt.verify(token, "accessToken");
        next();
    }
    catch (error) {
        response.status(401).send(error);
    }
};

module.exports.refreshAccessToken = (request, response, next) => {
    try {
        const token = request.headers.authorization;
        jwt.verify(token, "refreshToken");
        next();
    }
    catch (error) {
        response.status(401).send(error);
    }
};