const Router = require('koa-router');
const { Client } = require('@flasco/wda-driver');

const client = new Client('http://localhost:8100');

let prevBundleId = '';
let prevSession = null;
let currentInfo = {};

let prevWid, prevHei;

async function getScreenshot() {
  const { value } = await client.get('/screenshot/lowq');

  const session = await client.getSession();
  

  if (prevBundleId !== session.bundleId) {
    prevBundleId = session.bundleId;
    currentInfo = session.capabilities;
    const { width, height } = await session.getWindowSize();
    prevSession = session;
    prevWid = width;
    prevHei = height;
  }

  const res = {
    width: prevWid,
    height: prevHei,
    value,
    currentInfo,
  };

  return res;
}

const router = Router();

// /v1/inspector
router.get('/', async ctx => {
  await ctx.render('inspector');
});

router.get('/screenshot', async ctx => {
  const res = await getScreenshot();
  ctx.json(0, 'ok', res);
});

router.post('/click', async ctx => {
  const { x, y } = ctx.request.body;
  await prevSession.tap(x, y);
  ctx.json(0, 'ok');
});

router.post('/swipe', async ctx => {
  const {
    p1,
    p2
  } = ctx.request.body;
  await prevSession.chainOperation(drag(p1, p2, 800));
  ctx.json(0, 'ok');
});

router.post('/reloadApp', async ctx => {
  if (prevBundleId == '' || prevBundleId.includes('com.apple.springboard')) {
    ctx.json(400001, '不能在主页重启..');
  } else {
    await client.startApp(prevBundleId);
    ctx.json(0, 'ok');
  }
});

router.post('/home', async ctx => {
  await prevSession.pressHome();
  ctx.json(0, 'ok');
})

module.exports = router;

function drag([x1, y1], [x2, y2], duration = 800) {
  return [
    {
      action: 'longPress',
      options: {
        x: x1,
        y: y1,
        duration,
      },
    },
    {
      action: 'moveTo',
      options: {
        x: x2,
        y: y2,
      },
    },
    {
      action: 'wait',
      options: { ms: 280 },
    },
    {
      action: 'release',
    },
  ];
}
