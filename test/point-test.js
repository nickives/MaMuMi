const Point = require('../static/js/lib/point');
const assert = require('assert');

describe('Point Construction Test', function () {
    it('should construct OK', function () {
      const id_journeys = 1;
      const point_num = 2;
      const loc = {Lat: -1, Lng: 2};
      const video_link = "http://youtu.be";
      const arrival_date = new Date(2020, 01);

      point = new Point(id_journeys, point_num, loc, video_link, arrival_date);

      assert.strictEqual(point.id_journeys, id_journeys);
      assert.strictEqual(point.point_num, point_num);
      assert.strictEqual(point.loc, loc);
      assert.strictEqual(point.video_link, video_link);
      assert.strictEqual(point.arrival_date, arrival_date);
      assert.strictEqual(point.departure_date, null);
    })
})