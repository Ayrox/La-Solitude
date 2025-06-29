export const event = {
    name: 'warn',
    once: false,

    execute(warning) {

        console.warn(`[${new Date().toISOString()}] [EVENT] [CLIENT_WARN] [WARN]`, warning);
        
    }
}
