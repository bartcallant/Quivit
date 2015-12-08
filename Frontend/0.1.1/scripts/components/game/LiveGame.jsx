'use strict';

var React = require('react'),
    gameStore = require('../../stores/gameStore.js'),
    gameActions  = require('../../actions/gameActions.js'),
    playerStore = require('../../stores/playerStore.js'),
    playerActions = require('../../actions/playerActions.js'),
    teamStore = require('../../stores/teamStore.js'),
    teamActions = require('../../actions/teamActions.js'),
    socket = require('socket.io-client')('http://localhost:3000');

var isOriginSet = false;

var LiveGame = React.createClass({

    contextTypes: {
        history: React.PropTypes.object,
        location: React.PropTypes.object
    },

    getInitialState : function() {
        return ({
            canvasContext : null,
            canvasWidth : null,
            canvasHeight : null,
            players : [],
            teams : null,
            game : gameStore.getSingleGame()
        });
    },

    componentWillMount : function() {
        gameStore.addChangeListener(this._onChange);
        playerStore.addChangeListener(this._onChange);
        teamStore.addChangeListener(this._onChange);
    },

    componentDidMount : function() {
        //Query game
        var self = this;
        var query = this.context.location.pathname;
        var query = query.substr(12);
        gameActions.getGameRequest(query);

        //Sockets
        socket.on('connect', function() {
            console.log("Connection with socket");
        });

        socket.on(query, function(data) {
            requestAnimationFrame(() => {self._update(data)});
        });
    },

    componentWillUnmount: function() {
        gameStore.removeChangeListener(this._onChange);
        playerStore.removeChangeListener(this._onChange);
        teamStore.removeChangeListener(this._onChange);
    },

    _onChange : function() {
        var context = this.refs.gameCanvas.getContext('2d');
        var width = this.refs.gameCanvas.width;
        var height = this.refs.gameCanvas.height;

        this.setState({
            canvasContext : context,
            canvasWidth : width,
            canvasHeight : height,
            players : [],
            teams : null,
            game : gameStore.getSingleGame()
        });
    },

    _update : function(data) {
        var context = this.refs.gameCanvas.getContext('2d');
        var width = this.refs.gameCanvas.width;
        var height = this.refs.gameCanvas.height;
        var radius = 15;
        var transX = width * 0.5;
        var transY = height * 0.5;

        if(context != null) {
            if(!isOriginSet) {
                isOriginSet = true;
                context.translate(transX, transY);
            }

            context.clearRect(-(width / 2), -(height / 2), width, height);
            context.beginPath();
            context.arc((data.x * 100), (data.y * 100), radius, 0, 2 * Math.PI, false);
            context.fillStyle = '#333333';
            context.fill();
        }
    },

    render: function() {
        return(
            <div>
        	   <section className="live game">
            	   <h1>This is a live game.</h1>
				   <canvas ref="gameCanvas" id="gameCanvas" className="gameCanvas" width="1200" height="600"></canvas>
                </section>
            </div>
        );
    }
});

module.exports = LiveGame;