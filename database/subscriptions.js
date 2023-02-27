const Datastore = require('nedb')
const db = new Datastore({
  filename: 'subscriptions',
  autoload: true
})

module.exports = db
