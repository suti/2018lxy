import db from '../index'

// export function create (docs, cb) {
//   return db.file.create(docs, cb)
// }
//
// export function remove (docs, cb) {
//   return db.file.remove(docs, cb)
// }

export function findOneSync (docs) {
  return new Promise((resolve, reject) => {
    db.file.findOne(docs).exec((err, adventure) => {
      if (err) {
        reject(err)
      } else {
        resolve(adventure)
      }
    })
  })
}

export default db.file