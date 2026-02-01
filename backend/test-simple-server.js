import express from 'express';

const app = express();

app.get('/test', (req, res) => {
  res.json({ success: true, message: 'Server is working' });
});

app.listen(3001, () => {
  console.log('Test server running on port 3001');
});
