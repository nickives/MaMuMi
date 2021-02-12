const Point = require('../static/js/lib/point');
const assert = require('assert');

describe('Point Construction Test', function () {

    const id_journeys = 1;
    const point_num = 2;
    const loc = {Lat: -1, Lng: 2};
    const video_link = "http://youtu.be";
    const arrival_date = new Date(2020, 01);
    const point = new Point(id_journeys, point_num, loc, video_link, arrival_date);

    it('should construct OK', function () {
      assert.strictEqual(point.id_journeys, id_journeys);
      assert.strictEqual(point.point_num, point_num);
      assert.strictEqual(point.loc, loc);
      assert.strictEqual(point.video_link, video_link);
      assert.strictEqual(point.arrival_date, arrival_date);
      assert.strictEqual(point.departure_date, null);
    });

    it('Should add Descriptions OK', function () {
      const desc = {
          en: 'English',
          de: 'German'
      }

      point.addDescription(desc);

      assert.ok(point.description.en == desc.en);
      assert.ok(point.description.de == desc.de);
    }),

    it('Should remove Descriptions OK', function () {
        const desc = {
            en: 'English',
            de: 'German'
        }

        point.addDescription(desc);
        point.removeDescription('en');

        assert.ok(point.description.en != desc.en);
        assert.ok(point.description.de == desc.de);
    })
});