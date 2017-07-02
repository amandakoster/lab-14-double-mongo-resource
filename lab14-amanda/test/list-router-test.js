'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});

const faker = require('faker');
const expect = require('expect');
const superagent = require('superagent');
const server = require('../lib/server.js');
const clearDB = require('./lib/clear-db.js');
const Note = require('../model/list.js');
const mockList = require('./lib/mock-list.js');

let tempList;
const API_URL = process.env.API_URL;

describe('testing /api/lists', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('testing POST /api/lists', () => {
    let data = {title: faker.name.title()};
    it('should respond with a list', () => {
      return superagent.post(`${API_URL}/api/lists`)
      .send(data)
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body.title).toEqual(data.title);
        expect(res.body.tasks).toEqual([]);
        expect(res.body._id).toExist();
        tempList = res.body;
      });
    });
    it('should respond with a 400 status', () => {
      return superagent.post(`${API_URL}/api/lists`)
      .send({})
      .catch(err => {
        expect(err.status).toEqual(400);
      });
    });
    it('should respond with a 409 status', () => {
      let tempList;
      return mockList.createOne()
      .then(list => {
        tempList = list;
        return superagent.post(`${API_URL}/api/lists`)
        .send(tempList);
      })
      .then(res => {throw res;})
      .catch(res => {
        expect(res.status).toEqual(409);
      });
    });
  });

  describe('testing GET /api/lists/:id', () => {
    it('should respond with a list', () => {
      let tempList;
      return mockList.createOne()
      .then(list => {
        tempList = list;
        return superagent.get(`${API_URL}/api/lists/${list._id}`);
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body.title).toEqual(tempList.title);
        expect(res.body.tasks).toEqual([]);
        expect(res.body._id).toExist();
      });
    });
  });

  describe('testing PUT /api/lists/:id', () => {
    it('should respond with an updated list', () => {
      let tempList;
      return mockList.createOne()
    .then(list => {
      tempList = list;
      console.log('templist', tempList);
      return  superagent.put(`${API_URL}/api/lists/${tempList._id.toString()}`)
      .send({title: 'puttest'});
    })
    .then(res => {
      expect(res.status).toEqual(200);
      expect(res.body.title).toEqual('puttest');
      expect(res.body.tasks).toEqual([]);
      expect(res.body._id).toEqual(tempList._id);
      return Note.findById(tempList._id);
    });
    });
    it('should respond with a 400 status', () => {
      return mockList.createOne()
      .then(list => {
        tempList = list;
        return superagent.put(`${API_URL}/api/lists/${tempList._id.toString()}`)
        .send({});
      })
      .then(res => {throw res;})
      .catch(res => {
        expect(res.status).toEqual(400);
      });
    });
    it('should respond with a 404', () => {
      return mockList.createOne()
      .then(list => {
        tempList = list;
        return superagent.put(`${API_URL}/api/lists/12345}`)
        .send({title:'unfound'});
      })
      .then(res => {
        throw res;
      })
      .catch(res => {
        expect(res.status).toEqual(404);
      });
    });

    describe('testing DELETE', () => {
      after(clearDB);
      let tempList;
      it('should result in a 204', () => {
        return mockList.createOne()
        .then(result => {
          tempList = result;
          return superagent.delete(`${API_URL}/api/lists/${tempList._id}`)
          .then(res => {
            expect(res.status).toEqual(204);
          });
        });
      });
      it('should respond with a 404', () => {
        return mockList.createOne()
            .then(list => {
              tempList = list;
              return superagent.delete(`${API_URL}/api/lists/12345}`);
            })
              .then(res => {
                throw res;
              })
          .catch(res => {
            expect(res.status).toEqual(404);
          });
      });
    });
  });
});
