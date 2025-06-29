export const event = {
    name: 'message',
    once: false,
    execute(message) {
        console.log(`[${new Date().toISOString()}] [EVENT] [MESSAGE] [INFO] A message was sent in #${message.channel.name} by ${message.author.tag}:`, message.content);
    }
};