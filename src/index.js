const Koa = require('koa');
const path = require('path');
const views = require('koa-views');
const onerror = require('koa-onerror');
const staticServer = require('koa-static');

const routes = require('./routes');
const middleware = require('./middleware');

const app = new Koa();

app.use(middleware); //中间件加载

onerror(app);

app.use(views(path.join(__dirname, './views'), { extension: 'ejs' })); //视图加载

app.use(
  staticServer(path.join(__dirname, './public'), {
    maxage: 1000 * 60 * 60 * 24 * 30,
    hidden: true,
    gzip: true
  })
); //静态资源加载

app.use(routes.routes(), routes.allowedMethods()); // 路由加载

app.on('error', err => {
  console.error(new Date(), err.message);
});

module.exports = app;
