class Point {

    /**
     * Point on a Journey
     * 
     * @param {int} id_journeys 
     * @param {int} point_num 
     * @param {LatLng} loc 
     * @param {String} video_link 
     * @param {Date} arrival_date 
     * @param {Date} departure_date 
     */
    constructor(id_journeys, point_num, loc, video_link, 
        arrival_date = null, departure_date = null) {
            this.id_journeys = id_journeys;
            this.point_num = point_num;
            this.loc = loc;
            this.video_link = video_link;
            this.arrival_date = arrival_date;
            this.departure_date = departure_date;
    }
}

module.exports = Point;