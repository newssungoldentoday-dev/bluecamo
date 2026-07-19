// middleware/errorHandler.js — centralized error responses
function errorHandler(err, req, res, next) {
  console.error(`[bluecamo] ${req.method} ${req.path} ->`, err.message);
  const status = err.status || 400;
  res.status(status).json({ error: err.message || "something went wrong" });
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: `no route for ${req.method} ${req.path}` });
}

module.exports = { errorHandler, notFoundHandler };
