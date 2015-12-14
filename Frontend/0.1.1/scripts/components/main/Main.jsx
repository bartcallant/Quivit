'use strict';

var React = require('react'),
    Navigation = require('./../general/Navigation.jsx'),
    Footer = require('./../general/Footer.jsx'),
    Game = require('./Game.jsx'),
    GamesPanel = require('./GamesPanel.jsx'),
    Link = require('react-router').Link,
    gameStore = require('../../stores/gameStore.js'),
    gameActions = require('../../actions/gameActions.js');

//Variables
var titleLive = 'Live games';
var titleFuture = 'Future games';
var titlePast = 'Past games';

var Main = React.createClass({
    getInitialState : function() {
        return ({
            titleGamesLive : titleLive,
            titleGamesFuture : titleFuture,
            titleGamesPast : titlePast,
            todaysGames : gameStore.getTodaysGames(),
            futureGames : gameStore.getFutureGames(),
            pastGames : gameStore.getPastGames()
        });
    },

    componentWillMount : function() {
        gameStore.addChangeListener(this._onChange);
    },

    componentDidMount : function() {
        gameActions.getTodayGamesRequest();
        gameActions.getFutureGamesRequest();
        gameActions.getPastGamesRequest();
    },

    componentWillUnmount : function() {
        gameStore.removeChangeListener(this._onChange);
    },

    _onChange : function() {
        this.setState({
            titleGamesLive : titleLive,
            titleGamesFuture : titleFuture,
            titleGamesPast : titlePast,
            todaysGames : gameStore.getTodaysGames(),
            futureGames : gameStore.getFutureGames(),
            pastGames : gameStore.getPastGames()
        });
    },

    render: function() {
        return (
            <main>
                <Navigation />
                <section className="content-holder">
                    <GamesPanel title={this.state.titleGamesLive} games={this.state.todaysGames} mode="normal"/>
                    <div className="clearfix"></div>
                    <GamesPanel title={this.state.titleGamesFuture} games={this.state.futureGames} mode="normal"/>
                    <div className="clearfix"></div>
                    <GamesPanel title={this.state.titleGamesPast} games={this.state.pastGames} mode="past"/>
                    <div className="clearfix"></div>
                    <Link to="/admin">Admin</Link>
                    <div className="clearfix"></div>
                </section>
                <Footer />
            </main>
        );
    }
});

module.exports = Main;