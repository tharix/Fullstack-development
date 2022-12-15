const util = require('util')
const mongodb = require('mongodb')

const Db = mongodb.Db
const Connection = mongodb.Connection
const Server = mongodb.Server
const host = '127.0.0.1'
const port = 27017

//const db = new Db('test', new Server(host, port, {}))

//db.open((error, connection) => {
// Do something with the database here
//db.close()
//})

const db = new Db('test', new Server(host, port, {}))
db.open((error, connection) => {
 console.log('error: ', error)
 const adminDb = db.admin()
 adminDb.listDatabases((error, dbs) => {
  console.log('error: ', error)
  console.log('databases: ', dbs.databases)
  db.close()
 })
})