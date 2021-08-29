/**
 * @typedef {Number[]} RangeArray
 * @property {Number} 0 - first id for the category
 * @property {Number} 1 - last id for the category
 */

/**
 * @typedef {Object} Category
 * @property {String} name - name of the category
 * @property {RangeArray} range - id range to assign racer the category
 */

class Race {
    /**
     * @constructs
     * @param {String} name
     * @param {Category[]} categories
     *
     * @throws Will throw an error if parameter name is undefined
     * @throws Will throw an error if parameter categories[].name is undefined
     * @throws Will throw an error if parameter categories[].range is undefined
     */
    constructor(name, categories = []) {
        if (!name) {
            throw 'name is undefined';
        }

        const namesAreOk = categories.every((cat) => {
            return 'name' in cat;
        });

        if (!namesAreOk) {
            throw 'Missing property name in categories parameter';
        }

        const rangesAreOk = categories.every((cat) => {
            return 'range' in cat;
        });

        if (!rangesAreOk) {
            throw 'Missing property range in categories parameter';
        }

        this.name = name;
        this.categories = categories;
    }
}

export default Race;
