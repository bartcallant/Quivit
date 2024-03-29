var express = require('express'),
    router = express.Router(),
    Game = require('../../models/Game.js'),
    gameRepository = require('../../data/gameRepository.js'),
    heatMapGenerator = require('../../modules/heatMapGenerator.js'),
    authenticator = require('../../modules/authenticator.js'),
    gameValidator = require('../../modules/validators/gameValidator.js');

//GET: get game by id
router.get('/:id', function(req, res) {
    //Get id
    var id = req.params.id;
    gameRepository.getSingle(id, function(result) {
       res.json(result);
    });
});

//GET: get heat map
router.get('/:gameId/:playerId', function(req, res) {
    //Get ids
    var gameId = req.params.gameId;
    var playerId = req.params.playerId;

    heatMapGenerator.getHeatMapData(gameId, playerId, function(error, result) {
        if(!error) {
            res.json(result);
        }
    });
});

//GET: get games by date
router.get('/:year/:month/:day/:method', function(req, res) {
    //Get games of today
    if(req.params.method === 'included') {
        var gameDate = '' + req.params.year + req.params.month + req.params.day;
        gameRepository.getByDateIncluded(gameDate, function(result) {
            res.json(result);
        });
    }

    else if(req.params.method === 'excluded') {
        var gameDate = '' + req.params.year + req.params.month + req.params.day;
        gameRepository.getByDateExcluded(gameDate, function(result) {
            res.json(result);
        });
    }

    else if(req.params.method === 'past') {
        gameRepository.getPast(req.params.year, req.params.month, req.params.day, function(result) {
           res.json(result);
        });
    }
});

//GET: get future games
router.get('/', function(req, res) {
    var tempYear = new Date().getFullYear();
    var tempMonth = ((new Date().getMonth() + 1) < 10 ? ('0' + (new Date().getMonth() + 1)) : (new Date().getMonth() + 1));
    var tempDate = ((new Date().getDate()) < 10 ? ('0' + (new Date().getDate())) : (new Date().getDate()));
    var gameDate = '' + tempYear + tempMonth + tempDate;

    gameRepository.getFuture(gameDate, function(result) {
       res.json(result);
    });
});

//POST: insert new game
router.post('/', authenticator, gameValidator, function(req, res) {
    //Make new object
    var gameDate = req.body.gameDate;
    var gameTime = req.body.gameTime;
    var teamHomeId = req.body.teamHomeId;
    var teamAwayId = req.body.teamAwayId;
    var estimoteLocationId = req.body.estimoteLocationId;
    var isGameFinished = req.body.isGameFinished;
    var image = req.body.image;
    var newGame = new Game(gameDate, gameTime, teamHomeId, teamAwayId, estimoteLocationId, isGameFinished, 0, 0, image);
    gameRepository.add(newGame, function(result) {
        res.json(result);
    });
});

module.exports = router;