// api/index.js
// Serverless handler cho Vercel: chuyển tiếp toàn bộ request /api/* tới Express app
import app from '../server/index.js';

export default function handler(req, res) {
  return app(req, res);
}
