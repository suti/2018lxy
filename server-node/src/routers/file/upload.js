// import multer from 'koa-multer'
//
// let upload = multer({ dest: 'uploads/' })
import fs from 'fs'

export default function (ctx) {
  ctx.body = JSON.stringify(ctx.request.body)
  let data = ctx.request.body
  // let fr = new FileReader()

  console.log(data.fields)
  console.log(data.files)
}