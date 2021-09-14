const Point = require('../lib/point');
const assert = require('assert');

describe('Point Construction Test', function () {

    const id_journeys = 1;
    const point_num = 2;
    const loc = {Lat: -1, Lng: 2};
    const point = new Point(id_journeys, point_num, loc);

    it('should construct OK', function () {
      assert.strictEqual(point.id_journeys, id_journeys);
      assert.strictEqual(point.point_num, point_num);
      assert.strictEqual(point.loc, loc);
    });
});