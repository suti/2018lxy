const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()

// app.use(async (ctx) => {
//   ctx.body = 'Hello World'
// })

let router = new Router()

router.get('/test', (ctx) => {
  ctx.body = JSON.stringify(ctx)
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(2333)