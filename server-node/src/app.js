import Koa from 'koa'
import routers from './routers/index'

const app = new Koa()

app.use(routers.routes())
// app.use(routers.allowedMethods())


app.listen(2333)