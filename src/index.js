'use strict';
import { Strategy } from "./strategy.js";
import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import inquirer from 'inquirer'
import { parsePlatoons } from "./parsePlatoons.js";

const BATTLE_COUNT = 5;

let ourInput = 'Spearmen#10;Militia#30;FootArcher#20;LightCavalry#1000;HeavyCavalry#120';
let opponentInput = 'Militia#10;Spearmen#10;FootArcher#1000;LightCavalry#120;CavalryArcher#100';

// Clears terminal
clear();


// Welcome text
console.log(
    chalk.yellow(
        figlet.textSync('Battle Master', { horizontalLayout: 'full' })
    )
);
console.log(chalk.bold.red('Instructions'));
console.log(chalk.white('1. Valid types of soldiers: - Militia, Spearmen, Light Cavalry, Heavy Cavalry, Foot Archer, Cavalry Archer'));
console.log(chalk.white('2. Format of platoons: <valid_soldier_type>#<valid_integer>;<valid_soldier_type2>#<valid_integer>;<valid_soldier_type>#<valid_integer>'));
const questions = [{
        name: 'ourPlatoon',
        type: 'input',
        message: 'Enter your platoon:',
        validate: function(value) {
            try {

                ourInput = parsePlatoons(value, true);
                if (Object.keys(ourInput).length === BATTLE_COUNT) {
                    return true;
                } else {
                    return 'Please enter your platoons in the valid format.';
                }
            } catch (error) {
                return 'Please enter your platoons in the valid format.';
            }
        }
    },
    {
        name: 'oppPlatoon',
        type: 'input',
        message: 'Enter your opponent\'s platoon: ',
        validate: function(value) {
            opponentInput = parsePlatoons(value, false);
            if (opponentInput.length === BATTLE_COUNT) {
                return true;
            } else {
                return 'Please enter your opponent\'s platoons in the valid format.';
            }
        }
    }
];
inquirer.prompt(questions).then(() => {
    new Strategy(ourInput, opponentInput).strategize();
});