/**
 * Created by dubkov on 11/27/13.
 */
var Place = require('./models/place.js');

exports.init = function(){
    var p = new Place();
    var cities = [];
    var cities_ids = {}
    var places = [];

    p.getCityList(function(err, result) {

        result.forEach(function(v){
            cities[v.id] = { short_name: v.short_name, title: v.title };
            cities_ids[v.short_name] = v.id;
        });

        app.cache.city = cities;
        app.cache.city_ids = cities_ids;

        console.log('Cities was loaded in cache [', app.cache.city.length-1, ':', Object.keys(app.cache.city_ids).length, ']')
    });

    p.getPlaceList(function(err, result) {

        result.forEach(function(v){
            places[v.place_id] = v.city_id;
        });

        app.cache.place = places;

        console.log('Places was loaded in cache [', app.cache.place.length-1, ']');
    });
}