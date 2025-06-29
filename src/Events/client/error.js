export const event = {
    name: 'error',
    once: false,

    execute(error) {

        console.error(`[${new Date().toISOString()}] [EVENT] [CLIENT_ERROR] [ERROR]`, error);
        
    }
}
