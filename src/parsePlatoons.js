/**
 * Method to parts the platoons string
 * @param {string} _platoonsString 
 * @param {boolean} returnAsObject 
 * @returns 
 */
export const parsePlatoons = (_platoonsString, returnAsObject) => {
    try {
        const platoonRawList = _platoonsString.split(';');
        const platoonsObject = {};
        const platoonProcessedList = platoonRawList.map(_platoonString => {
            const platoonAttributes = _platoonString.split('#');
            const name = platoonAttributes[0];
            const count = Number(platoonAttributes[1]);

            if (Number.isNaN(count)) {
                throw Error;
            }
            if (!platoonsObject[name]) {
                platoonsObject[name] = [count];
            } else {
                platoonsObject[name].push(count);
            }
            return {
                name,
                count
            }
        });
        return returnAsObject ? platoonsObject : platoonProcessedList;
    } catch (e) {
        console.error('Please stick to the agreed format.');
        throw e;
    }
}