function logger() {
  return async (ctx, next) => {
    const start = Date.now();
    // await delay(6000);
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`); // 设置本次服务器响应的时间戳
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  }
}

module.exports = logger;