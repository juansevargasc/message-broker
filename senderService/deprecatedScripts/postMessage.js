var express = require('express');
var bodyParser = require('body-parser');
var amqp = require('amqplib/callback_api');
var fs = require('fs');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var exchange = 'logs';

        // Read lines of text from a file
        var my_actual_msg = fs.readFileSync('path/to/logs.txt', 'utf8');
        console.log(my_actual_msg);

        channel.assertExchange(exchange, 'fanout', {
            durable: false
        });

        // Publish the message from the file
        channel.publish(exchange, '', Buffer.from(my_actual_msg));
        console.log(" [x] Sent %s", my_actual_msg);

        // Route to handle the POST request and publish the message
        app.post('/push', function(req, res) {
            var message = req.body.message;

            // Publish the message from the request body
            channel.publish(exchange, '', Buffer.from(message));
            console.log(" [x] Sent %s", message);

            res.send("Message published to RabbitMQ");
        });
    });

    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});

app.listen(3000, function() {
    console.log('App listening on port 3000');
});
