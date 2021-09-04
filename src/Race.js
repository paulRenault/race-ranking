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
 * 
 * @typedef {Object} Racer
 * @property {Number|String} id - racer id
 * @property {Number[]} lapTime - array of lap time
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
        this.startDate = null;
        this.racerTab = [];
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

    /**
     * Start the race & record the start date
     */
    start() {
        this.startDate = new Date();
    }

    /**
     *
     * @returns {?Date}
     */
    getStartDate() {
        return this.startDate;
    }

    /**
     * @returns {Boolean}
     */
    isStarted() {
        return this.startDate !== null;
    }

    /**
     *
     * @param {Number|String} id
     *
     * @returns {Racer} - the racer objet or null
     */
    findRacerForId(id) {
        const result = this.racerTab.find((racer) => {
            return racer.id === id;
        });
        return result ? result : null;
    }

    /**
     *
     * @param {Number|String} id - the racer objet or null
     *
     * @returns {Boolean}
     */
    addRacerLap(id) {
        if (this.startDate === null) {
            return false;
        }

        const racer = this.findRacerForId(id);
        if (racer) {
            racer.lapTime.push(new Date());
        } else {
            this.racerTab.push({ id, lapTime: [new Date()] });
        }
        return true;
    }

    /**
     *
     * @param {String} name
     * @param {Number} firstId
     * @param {Number} lastId
     *
     * @returns {Boolean}
     */
    addCategory(name, firstId, lastId) {
        if (!name) {
            throw 'name is invalid';
        }
        if (!firstId) {
            throw 'firstId is invalid';
        }
        if (!lastId) {
            throw 'lastId is invalid';
        }
        const catAlreadyExist = this.categories.some((cat) => {
            return cat.name === name;
        });

        if (catAlreadyExist) {
            return false;
        }

        const catObj = {
            name,
            range: {
                firstId,
                lastId,
            },
        };
        this.categories.push(catObj);
        return true;
    }

    /**
     *
     * @param {String} catName
     */
    getCategoryForName(catName) {
        if (!catName) {
            throw 'catName is invalid';
        }
        return this.categories.find((cat) => {
            return cat.name === catName;
        });
    }

    /**
     *
     * @param {String} catName
     *
     * @returns {Racer[]}
     */
    getRacersForCategoryName(catName) {
        const cat = this.getCategoryForName(catName);
        if (!cat) {
            return [];
        }
        return this.racerTab.filter((racer) => {
            return (
                racer.id >= cat.range.firstId && racer.id <= cat.range.lastId
            );
        });
    }

    /**
     *
     * @param {Racer} r1
     * @param {Racer} r2
     *
     * @returns {Number} -1 if r1 is infront of r2, 1 if r2 is infront of r1 & 0 if r1 is equal to r2
     */
    static sortRacer(r1, r2) {
        if (r1.lapTime.length !== r2.lapTime.length) {
            return r2.lapTime.length - r1.lapTime.length;
        }

        const lastR1LapTime = r1.lapTime[r1.lapTime.length - 1];
        const lastR2LapTime = r2.lapTime[r2.lapTime.length - 1];

        if (lastR1LapTime < lastR2LapTime) {
            return -1;
        } else if (lastR1LapTime > lastR2LapTime) {
            return 1;
        }

        return 0;
    }

    /**
     *
     * @param {String} catName
     *
     * @returns {Racer[]} array of racer order by rank first at position 0, second at position 1 and so on
     */
    getRanking(catName) {
        let rank = this.racerTab;
        if (catName) {
            rank = this.getRacersForCategoryName(catName);
        }
        rank = rank.sort(Race.sortRacer);
        return rank;
    }

    /**
     * @returns {Racer[]}
     */
    getInsertedRacersTab() {
        if (!this.isStarted()) {
            return [];
        }

        const insertedRacers = this.racerTab.flatMap((racer) => {
            return racer.lapTime.map((lapTime) => {
                return {
                    id: racer.id,
                    lapTime: [lapTime],
                };
            });
        });

        const sortedInsertedRacers = insertedRacers.sort(Race.sortRacer);

        return sortedInsertedRacers.reverse();
    }
}

export default Race;
