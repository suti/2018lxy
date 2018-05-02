import fs from 'fs'
import path from 'path'
import { findOneSync } from '../../db/file/api'
import send from 'koa-send'
import queryParser from 'query-string'

const _path = md5 => path.join('store/', md5)

export async function getDownload (ctx) {
  let query = queryParser.parse(ctx.request.url.split('?')[1])
  await send(ctx, _path(query.md5))
  console.log('get :: ', query.md5)
}

export async function postDownload (ctx) {
  let query = ctx.request.body
  try {
    let adventure = await findOneSync({md5: query.md5})
    if (adventure) {
      let result = null
      if (adventure.type.indexOf('svg') > -1) {
        result =
          fs.readFileSync(path.join(__dirname, '../../../store/', query.md5),
            'utf-8')
        ctx.body = JSON.stringify({code: 1, result})
        console.log('post :: ', query.md5)
      } else {
        ctx.body = JSON.stringify({code: 0})
      }
    } else {
      ctx.body = JSON.stringify({code: -1, msg: ''})
    }
  } catch (err) {
    ctx.body = JSON.stringify({code: -1, msg: '数据库查询错误'})
  }
}