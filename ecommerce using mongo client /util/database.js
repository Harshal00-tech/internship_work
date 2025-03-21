const {MongoClient} = require('mongodb')

let _db;

const mongoConnect = async  (cb) => {
  try {
      const client  = await MongoClient.connect('mongodb+srv://harshal:admin004@cluster0.p9va5.mongodb.net/nodeapp?retryWrites=true&w=majority&appName=Cluster0')
      console.log('Mongodb connected successfully')
      _db = client.db()
      cb()
  } catch (error) {
    throw 'Mongo connection error.'
  }
}


const getDb = () => { 
  if( _db){
    return _db
  }
  throw 'No database found'
}

module.exports = {mongoConnect, getDb}
