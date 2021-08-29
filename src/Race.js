/**
 * @typedef {Object} RangeId
 * @property {Number} firstId - first id for the category
 * @property {Number} lastId - last id for the category
 
 * @typedef {Object} Category
 * @property {String} name - name of the category
 * @property {RangeId} range - id range to assign racer the category
 * 
 * @typedef {Object} CategoryError
 * @property {Boolean} err
 * @property {String} message - error message
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

        const checkRes = Race.checkCategories(categories);
        if (checkRes.err) {
            throw checkRes.message;
        }

        this.name = name;
        this.categories = categories;
    }

    /**
     * Check if the categories is as expected
     * @param {Category[]} categories
     *
     * @returns {CategoryError}
     */
    static checkCategories(categories) {
        const result = {
            err: false,
            message: '',
        };

        const namesAreOk = categories.every((cat) => {
            return 'name' in cat;
        });

        result.message = namesAreOk
            ? ''
            : 'Missing property name in categories parameter';

        const rangesAreOk = categories.every((cat) => {
            return 'range' in cat;
        });

        if (result.message === '' && !rangesAreOk) {
            result.message = 'Missing property range in categories parameter';
        }

        let rangesFirstIdAreOk = true;
        let rangesLastIdAreOk = true;
        if (rangesAreOk) {
            rangesFirstIdAreOk = categories.every((cat) => {
                return 'firstId' in cat.range;
            });

            if (result.message === '' && !rangesFirstIdAreOk) {
                result.message =
                    'Missing property firstId in categories[].range parameter';
            }

            rangesLastIdAreOk = categories.every((cat) => {
                return 'lastId' in cat.range;
            });

            if (result.message === '' && !rangesLastIdAreOk) {
                result.message =
                    'Missing property lastId in categories[].range parameter';
            }
        }

        result.err = !(
            namesAreOk &&
            rangesAreOk &&
            rangesFirstIdAreOk &&
            rangesLastIdAreOk
        );
        return result;
    }
}

export default Race;
