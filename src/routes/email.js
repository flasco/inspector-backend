const Router = require('koa-router');
const formatDate = require('date-fns/format');

const { sendMail } = require('../core/email');

const router = Router();

router.post('/', async ctx => {
  let { content, subject, to } = ctx.request.body;
  if (subject == null) {
    const current = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
    subject = `「${current}」警告`;
  }

  sendMail({
    subject,
    content,
    to
  });

  await ctx.json();
});

module.exports = router;
