import chalk from "chalk";
import { ADVANTAGES, DISADVANTAGES } from "./matchUps.js";
import chalkTable from 'chalk-table'
import figlet from "figlet";


/**
 * Class to make strategize and make combinations
 * @class
 */
export class Strategy {
    /**
     * Constructor of Strategy
     * @param ourPlatoons 
     * @param opponentPlatoons 
     */
    constructor(ourPlatoons, opponentPlatoons) {
        console.log({ ourPlatoons, opponentPlatoons });
        this.ourPlatoons = ourPlatoons;
        this.opponentPlatoons = opponentPlatoons;
        this.ourPlatoonsOrder = Array(this.opponentPlatoons.length).fill(undefined);
    }

    /**
     * Method to initiate strategy
     */
    strategize() {
        this.matchOpponentWithBestTroops();
        this.remainingBattles();
        const options = {
            leftPad: 2,
            columns: [
                { field: 'opponent', name: 'Opponent Platoon' },
                { field: 'our', name: 'Our Platoon' },
                { field: 'result', name: 'Result' },
            ]
        };

        const table = chalkTable(options, this.ourPlatoonsOrder.map(p => { return { opponent: `${p.opponent.name}-${p.opponent.count}`, our: `${p.name}-${p.count}`, result: p.result } }));

        console.log(table);

        this.battleResults();
    }

    /**
     * Prints the result of the strategies
     */
    battleResults() {
        const wins = this.ourPlatoonsOrder.filter(_platoon => _platoon.result === 'win').length;
        if (wins > this.opponentPlatoons.length / 2) {
            const result = this.ourPlatoonsOrder.reduce((acc, cur) => { return `${acc}${cur.name}#${cur.count};`; }, '').slice(0, -1);
            console.log(
                chalk.yellow(
                    figlet.textSync(`You Won ${wins}/${this.ourPlatoonsOrder.length} battles.`, { horizontalLayout: 'full' })
                )
            );

            console.log(chalk.bgWhite.red.bold(result));
        } else {
            console.log(chalk.bold('There is no chance of winning😿'));
        }
    }

    /**
     * Compares the troops and decides the result
     * @param  opponent 
     * @param  us 
     * @returns {'win'|'loss'|'draw'}
     */
    compareTroops(opponent, us) {
        return opponent === us ? 'draw' : (opponent > us ? 'loss' : 'win')
    }

    /**
     * Util method to remove the troop from our list
     * @param  name 
     * @param  count 
     */
    removeTroop(name, count) {
        console.log({ name, count }, this);
        const troopCount = this.ourPlatoons[name];
        if (troopCount.length == 1) {
            delete this.ourPlatoons[name];
        } else if (troopCount.length > 1) {
            const index = troopCount.findIndex(_count => _count === count);
            troopCount.splice(index, 1);
            this.ourPlatoons[name] = troopCount;
        }
    }

    /**
     * Simulated the remaining battles i.e., other than the strength matchup
     */
    remainingBattles() {
        const _this = this;
        const matchUps = [];
        this.opponentPlatoons.forEach(function(opponent, index) {
            if (!opponent.matched) {
                const ourTroops = Object.keys(_this.ourPlatoons);
                const opponentsAdvantages = ADVANTAGES[opponent.name];
                ourTroops.forEach(function(our) {
                    const isAdvantageForOpp = opponentsAdvantages.findIndex(_opp => _opp === our) > -1;
                    const ourAdvantages = ADVANTAGES[our];
                    const isAdvantageForUs = ourAdvantages.findIndex(_us => _us === opponent.name) > -1;
                    _this.ourPlatoons[our].forEach(function(_count) {
                        const collectiveOpponents = opponent.count * (isAdvantageForOpp ? 2 : 1);
                        const collectiveOurs = _count * (isAdvantageForUs ? 2 : 1);
                        const result = _this.compareTroops(collectiveOpponents, collectiveOurs);
                        const difference = collectiveOpponents - collectiveOurs;
                        matchUps.push({ result, difference, opponent, our, count: _count, index });
                    })
                });
            }
        });
        const wins = matchUps.filter(_matchup => _matchup.result === 'win');
        this.checkMatchUps(wins, _this);

        const draws = matchUps.filter(_matchup => _matchup.result === 'draw');
        this.checkMatchUps(draws, _this);

        const losses = matchUps.filter(_matchup => _matchup.result === 'loss');
        this.checkMatchUps(losses, _this);
    }

    /**
     * Util method to check the outcome of the matchups
     * @param wins 
     * @param _this 
     */
    checkMatchUps(wins, _this) {
        if (wins.length > 0) {
            wins.sort((a, b) => a.difference - b.difference);
            wins.forEach(function(win) {
                if (_this.ourPlatoons[win.our] && !_this.ourPlatoonsOrder[win.index]) {
                    _this.ourPlatoonsOrder[win.index] = { name: win.our, count: win.count, result: win.result, opponent: win.opponent };
                    win.opponent.matched = true;
                    _this.removeTroop(win.our, win.count);
                }
            });
        }
    }

    /**
     * Method to match-up our best troops for the corresponding 
     * opponent's platoons
     */
    matchOpponentWithBestTroops() {
        const _this = this;
        this.opponentPlatoons.forEach(function(opponent, index) {
            const { name, count } = opponent;
            const opponentDisadvantage = DISADVANTAGES[name];
            let minimumStrength = Number.MAX_VALUE;
            let minimumStrengthTroop = '';
            opponentDisadvantage.forEach(function(_name) {
                const strengthOfPlatoons = _this.ourPlatoons[_name];
                if (strengthOfPlatoons) {
                    const minStrengthRequired = strengthOfPlatoons.sort((a, b) => a - b).find(_count => 2 * (_count) > count);
                    if (minStrengthRequired !== undefined && minStrengthRequired < minimumStrength) {
                        minimumStrengthTroop = _name;
                        minimumStrength = minStrengthRequired;
                    }
                }
            });
            if (minimumStrength != Number.MAX_VALUE) {
                opponent.matched = true;
                _this.ourPlatoonsOrder[index] = { name: minimumStrengthTroop, count: minimumStrength, result: 'win', opponent };
                _this.removeTroop(minimumStrengthTroop, minimumStrength, _this.ourPlatoons);
            }
        });
    }
}