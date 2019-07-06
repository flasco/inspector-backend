module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      const { method, url, body, query } = ctx.request;
      if (method === 'GET') {
        const errorObj = {
          method,
          url,
          query
        };
        console.error(JSON.stringify(errorObj, null, 2));
      } else if (method === 'POST') {
        const errorObj = {
          method,
          url,
          body
        };
        console.error(JSON.stringify(errorObj, null, 2));
      }

      const contentType =
        ctx.header['content-type'] || ctx.header['contenttype'];
      if (contentType === 'application/json') {
        ctx.json(error.code || 10000, error.msg || error.message);
      } else {
        throw error;
      }
    }
  };
};
