/**
 * Created by dubkov on 11/21/13.
 */

var when = require('when');

var db = app.db; // Connection is set in Express settings

function dbQuery(query, params, callback) {
    db.query(
        query,
        [ params ],
        function(err, results, fields) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                callback(null, results[0]);
            }
        }
    );
}

/**
 *  Place object
 *  @class  Place
 *  @param  {number}    place_id    Request parameter
 *  @param  {function}  callback          Called when object is fully initialize
 */
var Place = function(place_id, callback) {
    if (place_id) {
        var self = this;

        /*  Execute all needed queries asynchronously,
         *  and wait until all of them will done.
         */
        when.all([
            Place.prototype.getPhoneByPlaceId.call(this, place_id, function(err, result) {
                if (result.length) {
                    self.phone = [];

                    result.forEach(function(v) {
                        self.phone.push(v.phone);
                    });
                }
            }),

            Place.prototype.getPhotoByPlaceId.call(this, place_id, function(err, result) {
                if (result.length) {
                    self.photo = [];

                    result.forEach(function(v) {
                        self.photo.push(v.photo);
                    });
                }
            }),

            Place.prototype.getTagByPlaceId.call(this, place_id, function(err, result) {
                result = result.filter(function(v) {
                    return v.tag_id;
                });

                if (result.length) {
                    self.tag = [];

                    result.forEach(function(v) {
                        self.tag.push({
                            id: v.tag_id,
                            title: v.tag,
                            type: v.tag_type,
                            type_id: v.tag_type_id
                        });
                    });
                }
            }),
            Place.prototype.getMetroByPlaceId.call(this, place_id, function(err, result) {
                if (result.length) {
                    self.metro = [];

                    result.forEach(function(v) {
                        self.metro.push({
                            id: v.id,
                            title: v.title
                        });
                    });
                }
            })
        ]).then(
            // Initialize object instance
            Place.prototype.getPlaceByPlaceId.call(this, place_id, function(err, result) {
                if (err) {
                    callback.call(self, err)
                }
                else
                {
                    result = result[0];

                    self.id = result.id;
                    self.title = result.title;
                    if (result.city_id)
                        self.city = {
                            id: result.city_id,
                            title: result.city,
                            short_name: result.short_name
                        }

                    if (result.address)
                        self.address = result.address;

                    if (result.worktime)
                        self.worktime = result.worktime;

                    if (result.latitude && result.longitude)
                        self.map = {
                            latitude: result.latitude,
                            longitude: result.longitude
                        }

                    if (result.description)
                        self.description = result.description;

                    if (result.review)
                        self.review = result.review;

                    if (result.network_id)
                        self.network = {
                            id: result.network_id,
                            title: result.network_title
                        }

                    // When object is fully initialized do callback
                    callback.call(self);
                }
            })
        );
    }
}

/**
 *  Get place by id
 *  @param  {number}    place_id    Request parameter
 *  @param  {function}  callback    Called when object is fully initialize
 */
Place.prototype.getPlaceByPlaceId = function (place_id, callback) {
    dbQuery('call getPlaceByPlaceId(?);', place_id, callback);
}

/**
 *  Get phone list by place id
 *  @param  {number}    place_id    Request parameter
 *  @param  {function}  callback    Called when object is fully initialize
 */
Place.prototype.getPhoneByPlaceId = function (place_id, callback) {
    dbQuery('call getPhoneByPlaceId(?);', place_id, callback);
}

/**
 *  Get photo list by place id
 *  @param  {number}    place_id    Request parameter
 *  @param  {function}  callback    Called when object is fully initialize
 */
Place.prototype.getPhotoByPlaceId = function (place_id, callback) {
    dbQuery('call getPhotoByPlaceId(?);', place_id, callback);
}

/**
 *  Get tag list by place id
 *  @param  {number}    place_id    Request parameter
 *  @param  {function}  callback    Called when object is fully initialize
 */
Place.prototype.getTagByPlaceId = function (place_id, callback) {
    dbQuery('call getTagByPlaceId(?);', place_id, callback);
}

/**
 *  Get metro list by place id
 *  @param  {number}    place_id    Request parameter
 *  @param  {function}  callback    Called when object is fully initialize
 */
Place.prototype.getMetroByPlaceId = function (place_id, callback) {
    dbQuery('call getMetroByPlaceId(?);', place_id, callback);
}

/**
 *  Get place list by metro id
 *  @param  {number}    metro_id    Request parameter
 *  @param  {function}  callback    Called when object is fully initialize
 */
Place.prototype.getPlaceListByMetroId = function (metro_id, callback) {
    dbQuery('call getPlaceListByMetroId(?);', metro_id, callback);
}

/**
 *  Get place list by city id
 *  @param  {number}    city_id    Request parameter
 *  @param  {function}  callback    Called when object is fully initialize
 */
Place.prototype.getPlaceListByCityId = function (city_id, callback) {
    dbQuery('call getPlaceListByCityId(?);', city_id, callback);
}

/**
 *  Get cities list
 *  @param  {function}  callback    Called when object is fully initialize
 */
Place.prototype.getCityList = function (callback) {
    dbQuery('call getCityList();', null, callback);
}

/**
 *  Get places list
 *  @param  {function}  callback    Called when object is fully initialize
 */
Place.prototype.getPlaceList = function (callback) {
    dbQuery('call getPlaceList();', null, callback);
}

/**
 *  Get place relative URL
 *  @returns    {string}        Relative url of place (like ./dunetsk/1)
 */
Place.prototype.getPlaceURL = function () {
    return '/'+ this.city.short_name + '/' + this.id;
}

module.exports = Place;
