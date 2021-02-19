const Point = require('../static/js/lib/point');
const Journey = require('../static/js/lib/journey');
const assert = require('assert');
const pool = require('./pool-test');
const JourneyModel = require("../models/journeys-model");
const JourneyController = require("../controllers/journey-controller");
const sinon = require('sinon');
const { log } = require('console');

const res = require('../node_modules/express/lib/response');

describe('Journeys-controller.js api test', function () {
  let journey;
  let model = new JourneyModel(pool);
  let mockModel = sinon.mock(model);

  let mockView = sinon.stub(res);

  let controller = new JourneyController(model, mockView);

  beforeEach(async () => {
      // test journey
      point1 = new Point(null, 1, {lat: 51.887491030242344, lng: -2.0881395483987832}, "http://video.link", new Date(), null);
      point2 = new Point(null, 2, {lat: 52, lng: -2}, "point2", new Date(), null);
      desc = { 
          en: "En description",
          es: "Es description",
          de: "De description",
          fr: "Fr description"
      };
      journey = new Journey("Bob", "FromTesco");
      journey.addPoint(point1);
      journey.addPoint(point2);
      point1.addDescription(desc);
      point2.addDescription(desc);
  });


  it('Should create journey OK', async () => {
    expectation = mockModel.expects("create").once().withArgs(journey);
    await controller.create(journey);
    assert.ok(expectation.verify());
  });

  it('Should get journey OK' , async () => {
    expectation = mockModel.expects("read").once().withArgs(1);
    await controller.read(1);
    assert.ok(expectation.verify());
  });

  it('Should get update journey OK',  async () => {
    expectation = mockModel.expects("update").once().withArgs(1,journey);
    await controller.update(1, journey);
    assert.ok(expectation.verify());
  });

  it('Should delete journey OK', async () => {
    expectation = mockModel. expects("delete").once().withArgs(1);
    await controller.delete(1);
    assert.ok(expectation.verify());
  });

  it('Should get all the journeys OK', async () => {
    expectation = mockModel.expects("readAll").once();
    await controller.readAll();
    assert.ok(expectation.verify());
  });

});
