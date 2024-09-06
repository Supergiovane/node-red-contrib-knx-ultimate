const { RateLimiter } = require('limiter');
// Configura il rate limiter
const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 150 });

console.log("Parto");
async function Vai(params) {
    do {

        // Verifica se è possibile eseguire una nuova richiesta
        const remainingRequests = await limiter.removeTokens(1);
        if (remainingRequests >= 0) {
            // Richiesta consentita
            console.log("Messaggio. remainingRequests=" + remainingRequests + " " + new Date().toTimeString());
        } else {
            // Limite superato
            console.log("HO DETTO SPETA. remainingRequests=" + remainingRequests + " " + new Date().toTimeString());
        }

    } while (true);
}
Vai();
console.log("Fine");


