const express = require('express');
const app = express();
app.use(express.json());
const {
  models: { User, Note },
} = require('./db');
const path = require('path');

// NO COMMENTSsssss

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/api/auth', async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body) });
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/auth', async (req, res, next) => {
  try {
    const user = await User.byToken(req.headers.authorization);
    // console.log(user);
    res.send(user);
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/users/:id/notes', async (req, res, next) => {
  try {
    const user = await User.byToken(req.headers.authorization);
    if (user.id === req.params.id) {
      const notes = await Note.findAll({
        where: {
          userId: req.params.id,
        },
      });
      console.log('notes', notes);
      if (notes.length) res.send(notes);
      else throw new Error(404);
    } else throw new Error(500);
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;
