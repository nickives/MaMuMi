const Point = require('../lib/point');
const Journey = require('../lib/journey');
const assert = require('assert');

describe('Journey Construction Test', function () {

    const name = "John";
    const subtitle = "Smith";
    const audio_uri = "http://youtu.be";
    var journey;

    beforeEach( () => {
        journey = new Journey(name, subtitle, audio_uri);
    });

    it('Should construct OK', () => {
        assert.strictEqual(journey.name, name);
        assert.strictEqual(journey.subtitle, subtitle);
        assert.strictEqual(journey.audio_uri, audio_uri);
    });

    it('Should add Descriptions OK', () => {
        const desc = {
            en: 'English',
            de: 'German'
        }

        journey.addDescription(desc);

        assert.ok(journey.description.en == desc.en);
        assert.ok(journey.description.de == desc.de);
    });
  
    it('Should remove Descriptions OK', () => {
        const desc = {
            en: 'English',
            de: 'German'
        }

        journey.addDescription(desc);
        journey.removeDescription('en');

        assert.ok(journey.description.en != desc.en);
        assert.ok(journey.description.de == desc.de);
    });

    it('Should add points OK', () => {
        const point = new Point();
        journey.addPoint(point);

        assert.ok(journey.points.includes(point));
    });

    it('Should remove points OK', () => {
        const point1 = new Point();
        point1.point_num = 100;
        journey.addPoint(point1);

        const point2 = new Point();
        point2.point_num = 20;
        journey.addPoint(point2);

        journey.removePoint(point1);

        // first point gone
        assert.ok(!journey.points.includes(point1));
        // second remains
        assert.ok(journey.points.includes(point2));

    });
});