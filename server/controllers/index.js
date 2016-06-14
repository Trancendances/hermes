var path = require('path');

module.exports.index = function (req, res, next) {
    indexPath = path.resolve(__dirname + '/../../client/public/index.htm'));
    res.status(200).sendFile(indexPath);
};