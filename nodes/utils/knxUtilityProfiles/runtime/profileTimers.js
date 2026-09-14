'use strict'

// Each Utility instance owns every timer created by its selected profile,
// including short status/pulse callbacks that legacy nodes did not track.
module.exports = function createProfileTimers () {
  const pending = new Map()
  let closed = false
  const schedule = (repeat, callback, delay, args) => {
    if (closed) return null
    const invoke = () => {
      if (!repeat) pending.delete(handle)
      if (!closed) return callback(...args)
    }
    const handle = repeat ? global.setInterval(invoke, delay) : global.setTimeout(invoke, delay)
    pending.set(handle, repeat)
    return handle
  }
  const clear = handle => {
    const repeat = pending.get(handle)
    pending.delete(handle)
    if (repeat) global.clearInterval(handle)
    else global.clearTimeout(handle)
  }
  return {
    get closed () { return closed },
    setTimeout: (callback, delay, ...args) => schedule(false, callback, delay, args),
    setInterval: (callback, delay, ...args) => schedule(true, callback, delay, args),
    clearTimeout: clear,
    clearInterval: clear,
    close: () => {
      closed = true
      for (const handle of pending.keys()) clear(handle)
    }
  }
}
