import Router from 'koa-router'
import test from './test'
import upload from './file/upload'
import body from 'koa-body'

let router = new Router()

// router.get('/api/test', test)
router.post('/api/test', body(), test)
router.post('/api/file/upload',body({multipart: true}), upload)

export default router