/**
 * Created by dubkov on 11/21/13.
 */

var db = app.db; // Connection is set in Express settings

/**
 *  Place object
 *  @class  Place
 *  @param  {number}    place_id    Request parameter
 *  @param  {function}  cb          Called when object is fully initialize
 */
var Phone = function(place_id, cb) {
    var self = this;

    // Initialize object instance
    Phone.prototype.getPhoneByPlaceId.call(this, place_id, function(err, result) {
        if (err) {
            cb.call(self, err)
        }
        else {
            self.phone = [];
            result.forEach(function(v) {
                self.phone.push(v.phone);
            });

            cb.call(self);
        }
    });
}

/**
 *  Get place by id
 *  @param  {number}    place_id    Request parameter
 *  @param  {function}  cb          Called when object is fully initialize
 */
Phone.prototype.getPhoneByPlaceId = function (place_id, callback) {
    db.query(
        'call getPhoneByPlaceId(?);',
        [ place_id ],
        function(err, results, fields) {
            if(err) {
                callback(err);
            } else {
                callback(null, results[0]);
            }
        }
    );
}

module.exports = Phone;
