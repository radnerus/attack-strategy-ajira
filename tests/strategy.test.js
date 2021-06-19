import { beforeEach, describe, expect } from "@jest/globals";
import { Strategy } from "../src/strategy"

let strategy;
describe('the strategy test suits', () => {
    beforeEach(() => {
        const ourPlatoons = {
            Spearmen: [10],
            Militia: [30],
            FootArcher: [20],
            LightCavalry: [1000],
            HeavyCavalry: [120]
        }
        const oppPlatoons = [
            { name: 'Militia', count: 10 },
            { name: 'Spearmen', count: 10 },
            { name: 'FootArcher', count: 1000 },
            { name: 'LightCavalry', count: 120 },
            { name: 'CavalryArcher', count: 100 }
        ]
        strategy = new Strategy(ourPlatoons, oppPlatoons);
    })

    test('should create the object', () => {
        expect(strategy.ourPlatoons['Spearmen'][0]).toBe(10);
    });

    test('should not contain undefined in result after strategize', () => {
        strategy.strategize();
        const withoutUndefined = strategy.ourPlatoonsOrder.filter(_platoon => _platoon !== undefined);
        expect(withoutUndefined).toEqual(strategy.ourPlatoonsOrder)
    })


    test('should remove from our platoon when called', () => {
        strategy.removeTroop('FootArcher', 20);
        expect(strategy.ourPlatoons['FootArcher']).toBeUndefined();
    })
});