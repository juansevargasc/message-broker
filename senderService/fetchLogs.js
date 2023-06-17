var amqp = require('amqplib/callback_api');
var fs = require('fs');

const retryDelay = 5000; // Retry delay in milliseconds
const HOST = 'rabbitmq';


function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function connectWithRetry() {
  let connected = false;

  while (!connected) {
    try {
      await new Promise((resolve, reject) => {
        amqp.connect('amqp://' + HOST, function(error0, connection) {
          if (error0) {
            console.error('Failed to connect to RabbitMQ:');
            console.log('Retrying in', retryDelay, 'milliseconds...');
            reject();
          } else {
            // Connection successful, proceed with your logic
            console.log('Connected to RabbitMQ!');
            connected = true;
            resolve();

            // 2. Create a channel
            connection.createChannel(function(error1, channel) {
                if (error1) {
                    throw error1;
                }
            
                  
                console.log('Connected to RabbitMQ!');
                var exchange = 'logs';
            
                // Read lines of text from a file
                var my_actual_msg = fs.readFileSync('./logs.txt', 'utf8');
                var lines = my_actual_msg.split('\n');
            
                channel.assertExchange(exchange, 'fanout', {
                    durable: false
                });
            
                // 3. Use forEach to read file
                lines.forEach(function(line) {
                    if (line.trim() !== '') 
                    {
                        // 4. Publish the message from the file
                        channel.publish(exchange, '', Buffer.from(line));
                        console.log(" [x] Sent %s", line); // Output on cosole which line was sent.
                    }
                });
            
                setTimeout(function() {
                    connection.close();
                    process.exit(0);
                }, 500);
            });

          }
        });
      });
    } catch (error) {
      console.error('Error during RabbitMQ connection:');
      console.log('Retrying in', retryDelay, 'milliseconds...');
    }

    // Retry connection after the delay
    await sleep(retryDelay);
  }
  
}

connectWithRetry();

// amqp.connect('amqp://' + HOST, function(error0, connection) {
//     if (error0) {
//         console.error('Failed to connect to RabbitMQ:', error0.message);
//         console.log('Retrying in', retryDelay, 'milliseconds...');
//         setTimeout(connectWithRetry, retryDelay); // Retry connection after the delay
//         //throw error0;
//     }

//     // 2. Create a channel
//     connection.createChannel(function(error1, channel) {
//         if (error1) {
//             throw error1;
//         }

          
//         console.log('Connected to RabbitMQ!');
//         var exchange = 'logs';

//         // Read lines of text from a file
//         var my_actual_msg = fs.readFileSync('./logs.txt', 'utf8');
//         var lines = my_actual_msg.split('\n');

//         channel.assertExchange(exchange, 'fanout', {
//             durable: false
//         });

//         // 3. Use forEach to read file
//         lines.forEach(function(line) {
//             if (line.trim() !== '') 
//             {
//                 // 4. Publish the message from the file
//                 channel.publish(exchange, '', Buffer.from(line));
//                 console.log(" [x] Sent %s", line); // Output on cosole which line was sent.
//             }
//         });

//         setTimeout(function() {
//             connection.close();
//             process.exit(0);
//         }, 500);
//     });
// });
