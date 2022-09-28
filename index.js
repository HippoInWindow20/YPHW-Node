const http = require('http');
const { parse } = require('querystring');

const server = http.createServer((request, response) => {
    if (request.method == 'POST') {
        var body = '';

        request.on('data', function(data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function() {
            var post = parse.parse(body);
            console.log(post.subject)
        });
    }
});
server.listen(3000);
console.log('Server started at http://localhost:3000');