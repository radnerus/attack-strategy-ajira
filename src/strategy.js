import chalk from "chalk";
import { ADVANTAGES } from "./matchUps.js";
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
     * @param ourPlatoonList
     * @param opponentPlatoons 
     */
    constructor(ourPlatoons, ourPlatoonList, opponentPlatoons) {
        this.ourPlatoonList = ourPlatoonList;
        this.ourPlatoons = ourPlatoons;
        this.opponentPlatoons = opponentPlatoons;
        this.ourPlatoonsOrder = Array(this.opponentPlatoons.length).fill(undefined);
    }

    /**
     * Method to initiate strategy
     */
    strategize() {
        this.simulateBattles();
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
        const troops = this.ourPlatoonList.filter(_p => _p.count === count && _p.name === name);
        for (let i = 0; i < troops.length; i++) {
            const troop = troops[i];
            if (!troop.matched) {
                troop.matched = true;
                break;
            }
        }
    }

    /**
     * Simulates the battles
     */
    simulateBattles() {
        const _this = this;
        const matchUps = [];
        this.opponentPlatoons.forEach(function(opponent, index) {
            const opponentsAdvantages = ADVANTAGES[opponent.name];
            // Simulates all battles
            _this.ourPlatoonList.forEach(function(_platoon) {
                const our = _platoon.name;
                const isAdvantageForOpp = opponentsAdvantages.findIndex(_opp => _opp === our) > -1;
                const ourAdvantages = ADVANTAGES[our];
                const isAdvantageForUs = ourAdvantages.findIndex(_us => _us === opponent.name) > -1;
                const collectiveOpponents = opponent.count * (isAdvantageForOpp ? 2 : 1);
                const collectiveOurs = _platoon.count * (isAdvantageForUs ? 2 : 1);
                const result = _this.compareTroops(collectiveOpponents, collectiveOurs);
                const difference = collectiveOpponents - collectiveOurs;
                matchUps.push({ result, difference, opponent, our, count: _platoon.count, index });
            });
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
     * @param results 
     * @param _this 
     */
    checkMatchUps(results, _this) {
        if (results.length > 0) {
            results.sort((a, b) => a.difference - b.difference);
            results.forEach(function(result) {
                if (!_this.ourPlatoonsOrder[result.index]) {
                    const matches = _this.ourPlatoonList.filter(_pla => _pla.name === result.our && _pla.count === result.count);
                    const allMatched = matches.every(match => match.matched);
                    if (!allMatched) { // Unmatched matchup found
                        _this.assignToResult(_this, result.index, result);
                    } else if (result.result === 'win') {
                        // Platoon with already won battle, but its another 
                        // opportunity to win,
                        const matched = matches.find(match => match.matched);
                        const alreadyMatched = _this.ourPlatoonsOrder.filter(_order => _order && _order.name === matched.name && _order.count === matched.count);
                        alreadyMatched.forEach(_matched => {
                            const _opp = _matched.opponent;
                            const alreadyMatchedWin = results.find(_rs => _rs.opponent === _opp);
                            const prevWinIndex = alreadyMatchedWin.index;
                            const addedTroopNames = _this.ourPlatoonsOrder.map(_ordered => _ordered && _ordered.name);
                            const otherWins = results.filter(_rs => _rs.our !== result.our && _rs.index === prevWinIndex && !addedTroopNames.includes(_rs.our));
                            // check if the previous won battle has another possibility to win
                            if (otherWins.length > 0) {
                                otherWins.sort((a, b) => a.difference - b.difference);
                                const leastOtherWin = otherWins[0];
                                // Result for previous matched
                                _this.assignToResult(_this, prevWinIndex, leastOtherWin);
                                // Result for current matched
                                _this.assignToResult(_this, result.index, result);
                            }

                        });
                    }
                }
            });
        }
    }

    /**
     * Method to assign the troops to output list
     * @param _this 
     * @param prevWinIndex 
     * @param leastOtherWin 
     */
    assignToResult(_this, prevWinIndex, leastOtherWin) {
        _this.ourPlatoonsOrder[prevWinIndex] = { name: leastOtherWin.our, count: leastOtherWin.count, result: leastOtherWin.result, opponent: leastOtherWin.opponent };
        leastOtherWin.opponent.matched = true;
        _this.removeTroop(leastOtherWin.our, leastOtherWin.count);
    }
}