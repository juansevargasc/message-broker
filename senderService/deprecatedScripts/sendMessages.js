var amqp = require('amqplib/callback_api');
var readline = require('readline');

// 1. Connect to RabbitMQ server
amqp.connect('amqp://rabbitmq', function(error0, connection) {
    if (error0) {
        throw error0;
    }

    // 2. Create a channel
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        // 3. Create an exchange of type fanout, called logs.
        var exchange = 'logs';
        channel.assertExchange(exchange, 'fanout', {
            durable: false
        });

        // 3.  Read lines from the console input
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log("Enter your messages (press Ctrl+C to exit):");

        // 4. As long as it finds a line, Publish the message contained in the line, to the exchange
        rl.on('line', function(line) {
            if (line.trim() !== '') {
                channel.publish(exchange, '', Buffer.from(line));
                console.log(" [x] Sent %s", line);
            }
        });
        
        // 5. Close the connection when the user presses Ctrl+C
        rl.on('close', function() {
            connection.close();
            process.exit(0);
        });
    });
});
