import Router from 'koa-router'
import test from './test'
import upload from './file/upload'
import { getDownload, postDownload } from './file/download'
import body from 'koa-body'

let router = new Router()

// router.get('/api/test', test)
router.post('/api/test', body(), test)
router.post(
  '/api/file/upload',
  body({multipart: true, formidable: {maxFileSize: 200 * 1024 * 1024}}),
  upload,
)
router.get('/api/file/download*', getDownload)
router.post('/api/file/download', body(), postDownload)

export default router