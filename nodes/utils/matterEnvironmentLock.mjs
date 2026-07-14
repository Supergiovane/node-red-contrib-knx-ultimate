/* eslint-disable max-len */
// matter.js keeps its runtime configuration (including 'storage.path') on
// Environment.default, a SINGLE process-wide object shared by every ServerNode /
// CommissioningController instance (the KNX Matter Bridge engine AND the Matter
// Controller engine both read/write it). Today every engine instance in this
// package happens to set the same 'storage.path' value, so the two engines
// racing on Environment.default.vars.set() before their own create() call has
// historically been harmless in practice. It is still a shared-mutable-global
// access pattern: if a future change ever gives two engines different paths
// (e.g. per-instance storage isolation), an unguarded interleaving could make
// engine A's ServerNode.create() observe engine B's path.
//
// This module offers a tiny FIFO async mutex so callers can wrap
// "set the env var(s) then create the node" as one atomic critical section,
// regardless of how many bridge/controller config nodes start concurrently.
let queue = Promise.resolve()

/**
 * Runs `fn` exclusively with respect to every other call to withEnvironmentLock
 * in this process. Calls are queued FIFO; a throwing/rejecting `fn` does not
 * block subsequent queued calls.
 * @param {() => Promise<any>} fn
 * @returns {Promise<any>} whatever `fn` resolves to
 */
function withEnvironmentLock (fn) {
  const run = queue.then(fn, fn)
  // Keep the chain alive even if `fn` rejects, so later callers still run.
  queue = run.then(() => undefined, () => undefined)
  return run
}

export { withEnvironmentLock }
