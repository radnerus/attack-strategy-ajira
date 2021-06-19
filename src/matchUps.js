export const ADVANTAGES = {
    "Militia": ["Spearmen", "LightCavalry"],
    "Spearmen": ["LightCavalry", "HeavyCavalry"],
    "LightCavalry": ["FootArcher", "CavalryArcher"],
    "HeavyCavalry": ["Militia", "FootArcher", "LightCavalry"],
    "CavalryArcher": ["Spearmen", "HeavyCavalry"],
    "FootArcher": ["Militia", "CavalryArcher"]
};

export const DISADVANTAGES = {
    "Militia": ["HeavyCavalry", "FootArcher"],
    "Spearmen": ["Militia", "CavalryArcher"],
    "LightCavalry": ["Militia", "Spearmen", "HeavyCavalry"],
    "HeavyCavalry": ["Spearmen", "CavalryArcher"],
    "CavalryArcher": ["LightCavalry", "FootArcher"],
    "FootArcher": ["LightCavalry", "HeavyCavalry"]
}