import fs from 'fs'
import path from 'path'

export default async function (ctx) {
  let data = ctx.request.body
  console.log(data.files.file)
  try {
    fileSync(data.files.file.path, data.fields.md5)
    ctx.body = JSON.stringify({code: 1})
    console.log('上传成功', data.files.file.name, data.fields.md5)
  } catch (err) {
    ctx.body = JSON.stringify({code: 0, msg: err})
    console.log('上传失败', err)
  }
}

function fileSync (p, md5) {
  return fs.copyFileSync(p, path.join(__dirname, '../../../', 'store/', md5))
}