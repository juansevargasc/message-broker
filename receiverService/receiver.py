import time
import pika

# HOST = "localhost"

HOST = "rabbitmq"

if __name__ == "__main__":
    
    # 1. Establish connection with RabbitMQ server
    connection = None
    while connection is None:
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=HOST))
            
        except pika.exceptions.AMQPConnectionError:
            print("RabbitMQ is not available yet. Retrying in 5 seconds...")
            time.sleep(5)

    print("RabbitMQ is ready.")

    # 2. Create a channel
    channel = connection.channel()
    channel.exchange_declare(exchange="logs", exchange_type="fanout")
    result = channel.queue_declare(queue="", exclusive=True)

    # 3. Declare a queue
    softArchQueue = result.method.queue
    channel.queue_bind(exchange="logs", queue=softArchQueue)

    print(" [*] Waiting for logs. To exit press CTRL+C ")

    # 4. Define a callback function
    def callback(ch, method, properties, body):
        print(" [x] %r" % body)

    #  5. Consume messages from the queue
    channel.basic_consume(queue=softArchQueue, on_message_callback=callback, auto_ack=True)
    channel.start_consuming()
    
    connection.close()
