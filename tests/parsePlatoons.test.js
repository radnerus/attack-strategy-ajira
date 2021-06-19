import { parsePlatoons } from "../src/parsePlatoons.js";

test('should return the parsed platoon from the given valid string', () => {
    const platoonString = 'Spearmen#10;Militia#30;FootArcher#20;LightCavalry#1000;HeavyCavalry#120';
    const parsedPlatoons = parsePlatoons(platoonString, true);
    expect(parsedPlatoons['Spearmen'][0]).toBe(10);
});

test('should combine the same platoons and updated the count array', () => {
    const platoonString = 'Spearmen#10;Militia#30;FootArcher#20;LightCavalry#1000;Spearmen#120';
    const parsedPlatoons = parsePlatoons(platoonString, true);
    expect(parsedPlatoons['Spearmen'][1]).toBe(120);
});

test('should return an array when the `returnAsObject` is false', () => {
    const platoonString = 'Spearmen#10;Militia#30;FootArcher#20;LightCavalry#1000;Spearmen#120';
    const parsedPlatoons = parsePlatoons(platoonString, false);
    expect(parsedPlatoons.length).toBe(5);
    expect(parsedPlatoons[2].count).toBe(20);
});