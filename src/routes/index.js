const Router = require('koa-router');

const home = require('./home');
const email = require('./email');
const inspector = require('./inspector');

const router = Router();

router.use('/', home.routes(), home.allowedMethods());
router.use('/api/v1/email', email.routes(), email.allowedMethods());
router.use('/v1/inspector', inspector.routes(), inspector.allowedMethods());

router.get('*', async (ctx) => {
  ctx.json(100000, 'invaild routes');
});

module.exports = router;