import fs from 'fs'
import path from 'path'
import db from '../../db/file/api'
import { findOneSync } from '../../db/file/api'

export default async function (ctx) {
  let {fields, files} = ctx.request.body
  let adventure = await findOneSync({md5: fields.md5})
  try {
    if (adventure) {
      ctx.body = JSON.stringify({code: 0})
      console.log('上传成功', adventure.name, adventure.md5)
    } else {
      try {
        await db.create(
          {name: files.file.name, md5: fields.md5, type: fields.type})
        fileSync(files.file.path, fields.md5)
        ctx.body = JSON.stringify({code: 1})
        console.log('上传成功', files.file.name, fields.md5)
      } catch (err) {
        ctx.body = JSON.stringify({code: -1, msg: err})
        console.log('上传失败', err)
      }
    }
  } catch (err) {
    ctx.body = JSON.stringify({code: -1, msg: '数据库查询错误'})
  }

}

function fileSync (p, md5) {
  return fs.copyFileSync(p, path.join(__dirname, '../../../', 'store/', md5))
}