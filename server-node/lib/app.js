'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _index = require('./routers/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _koa2.default();

app.use(_index2.default.routes());
app.use(_index2.default.allowedMethods());

app.listen(2333);