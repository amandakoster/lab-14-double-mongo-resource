'use strict';

const faker = require('faker');
const List = require('../../model/list.js');
const mockList = module.exports = {};

mockList.createOne = () => {
  return new List({
    title: faker.random.words(3),
  })
  .save();
};


//what is n doing here? n = number
