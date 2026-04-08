const REQUEST_TOKEN_PROP = 'knxUltimateAccessToken'

const getRequestAccessToken = (req) => {
  if (req && typeof req[REQUEST_TOKEN_PROP] === 'string' && req[REQUEST_TOKEN_PROP].trim() !== '') {
    return req[REQUEST_TOKEN_PROP].trim()
  }
  if (req && req.query && typeof req.query.access_token === 'string') {
    const queryToken = String(req.query.access_token).trim()
    if (queryToken) return queryToken
  }
  return ''
}

const normalizeAuthFromAccessTokenQuery = (req, res, next) => {
  const queryToken = req && req.query && typeof req.query.access_token === 'string'
    ? String(req.query.access_token).trim()
    : ''
  if (queryToken) {
    req[REQUEST_TOKEN_PROP] = queryToken
    if (!(req.headers && req.headers.authorization)) {
      req.headers = req.headers || {}
      req.headers.authorization = `Bearer ${queryToken}`
    }
    if (req.query && Object.prototype.hasOwnProperty.call(req.query, 'access_token')) {
      delete req.query.access_token
    }
  }
  next()
}

module.exports = {
  getRequestAccessToken,
  normalizeAuthFromAccessTokenQuery
}
