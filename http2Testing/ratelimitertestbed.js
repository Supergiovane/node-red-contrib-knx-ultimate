const RateLimiter = require("./ratelimiter");

async function ba(params) {
    await RateLimiter.sendMessage()
}

ba;
