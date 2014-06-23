
/*
 * GET home page.
 */

var Place = require('../models/place.js');

var express = require('express');
var router = express.Router();

router.param(function(name, fn){
    if (fn instanceof RegExp) {
        return function(req, res, next, val){
            var captures;
            if (captures = fn.exec(String(val))) {
                req.params[name] = captures;
                next();
            } else {
                next('route');
            }
        }
    }
});


router.route('/').get(index);
router.route('/showHeaders').get(showHeaders).post(showHeaders);
router.route('/getCityList').get(getCityList);

router.param('place_id', /^\d+$/);
router.param('city_name', /^\w+$/);

router.route('/:place_id').get(place);
router.route('/:city_name').get(city);
router.route('/:city_name/:place_id').get(place);

exports.router = router;

function index(req, res, next){
    var route_list = [];

    router.stack.filter(function(v){
        return v.route;
    })
    .forEach(function(v){
        route_list.push(v.route.path)
    });

    res.render('index', { route_list: route_list });
};

/**
 * Show request header that app received
 */
function showHeaders(req, res, next) {
    res.send(req.headers);
};

function place(req, res, next) {

    console.log(req.params);

    var place_id = req.query.place_id || req.params.place_id;
    var city_name = req.query.city_name || req.params.city_name;

    //if (!app.cache.city_ids[city_name] || !app.cache.place[place_id] || app.cache.city_ids[city_name] !== app.cache.place[place_id]){

    if ( (!app.cache.city_ids[city_name] && app.cache.place[place_id] ) || ( app.cache.place[place_id] && app.cache.city_ids[city_name] !== app.cache.place[place_id]) ){
        res.writeHead(301, {
            'Location': '/'+ app.cache.city[app.cache.place[place_id]].short_name + '/' + place_id
        });
        res.end();
        return;
    } else {
        if (app.cache.place[place_id]) {
            var p = new Place(place_id, function (err, result) {
                if (err)
                    console.log(err)
                else
                    res.send(p)
            });
        }
        else {
            res.status(404);
            res.end();
        }
    }
};

function city(req, res, next){

    console.log(req.params);

    if (app.cache.city_ids[req.params.city_name])
        var city_id = app.cache.city_ids[req.params.city_name]
    else {
        next();
        return;
    }

    if (city_id)
        var p = new Place().getPlaceListByCityId(city_id, function (err, result) {
            if (err)
                console.log(err)
            else
                res.send(result);

            next();
        });

};

function getCityList(req, res, next){
    var p = new Place().getCityList(function(err, result) {
	    res.send(result);
/*      result.forEach(function(v){
            cities[v.id] = { short_name: v.short_name, title: v.title };
            cities_ids[v.short_name] = v.id;
        });*/
    });
};
