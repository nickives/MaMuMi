class Point {

    /**
     * Point on a Journey
     * 
     * @param {int} id_journeys 
     * @param {int} point_num 
     * @param {LatLng} loc 
     */
    constructor(id_journeys, point_num, loc) {
            this.id_journeys = id_journeys;
            this.point_num = point_num;
            this.loc = loc;
    }
}

module.exports = Point;