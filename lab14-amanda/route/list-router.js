'use strict';

const jsonParser = require('body-parser').json();
const listRouter = module.exports = new require('express').Router();

const List = require('../model/list.js');

listRouter.post('/api/lists', jsonParser, (req, res, next) => {
  console.log('hit POST /api/lists');

  new List(req.body)
  .save()
  .then(list => res.json(list))
  .catch(next);
});

listRouter.get('/api/lists/:id', (req, res, next) => {
  console.log('hit /api/lists');

  List.findById(req.params.id)
  .then(list => res.json(list))
  .catch(next);
});

listRouter.put('/api/lists/:id', jsonParser, (req, res, next) => {
  console.log('hit PUT /api/lists/:id', req.params.id);
  let options = {
    runValidators: true,
    new: true,
  };
  let checkLength = Object.keys(req.body);
  if (checkLength.length === 0) {
    return res.sendStatus(400);
  }
  console.log('req body', req.body);
  List.findByIdAndUpdate(req.params.id, req.body, options)
.then(list => res.json(list))
.catch(next);

  listRouter.delete('/api/lists/:id',  jsonParser, (req, res, next) => {
    console.log('DELETE /api/lists/:id');

    List.findByIdAndRemove(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(next);
  });
});
