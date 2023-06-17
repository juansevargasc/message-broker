var amqp = require('amqplib/callback_api');


amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var exchange = 'logs';

        // Read from file that contain logs
        // var fs = require('fs');
        // var msg = fs.readFileSync('logs.txt', 'utf8');
        // console.log(msg);

        var my_actual_msg = 'The Third Try!!!! Written by: Juanse';
        var msg = process.argv.slice(2).join(' ') || my_actual_msg;

        channel.assertExchange(exchange, 'fanout', {
            durable: false
        });

        channel.publish(exchange, '', Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
    });

    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});