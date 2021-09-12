import Race from '../src/Race.js';
import _ from 'lodash';

function generateRacer(id, diffLaps) {
    const racer = {
        id,
        lapTime: [],
    };

    for (const diff of diffLaps) {
        const d = new Date();
        d.setMinutes(d.getMinutes() - diff);
        racer.lapTime.push(d);
    }

    return racer;
}

describe('Test race constructor', () => {
    describe('When name is race1', () => {
        it('Should set name to race1', () => {
            const race = new Race('race1');
            expect(race.name).toBe('race1');
        });

        it('Should set startDate to null', () => {
            const race = new Race('race1');
            expect(race.startDate).toBeNull();
        });

        it('Should set racers to an empty array', () => {
            const race = new Race('race1');
            expect(race.racerTab).toStrictEqual([]);
        });
    });

    describe('When param categories is undefined', () => {
        it('Should set categories to an empty array', () => {
            const race = new Race('R1');
            expect(race.categories).toStrictEqual([]);
        });
    });

    describe('When name is undefined', () => {
        it('Should throw an error "name is undefined"', () => {
            expect(() => {
                new Race();
            }).toThrow('name is undefined');
        });
    });

    describe('When param categories is an array of object', () => {
        it('Should property categories equal the expect Object', () => {
            const expectedObj = [
                { name: 'Cat_1', range: { firstId: 1, lastId: 10 } },
                { name: 'Cat_2', range: { firstId: 11, lastId: 20 } },
                { name: 'Cat_3', range: { firstId: 21, lastId: 30 } },
            ];
            const categories = [
                { name: 'Cat_1', range: { firstId: 1, lastId: 10 } },
                { name: 'Cat_2', range: { firstId: 11, lastId: 20 } },
                { name: 'Cat_3', range: { firstId: 21, lastId: 30 } },
            ];

            const race = new Race('R1', categories);
            expect(race.categories).toStrictEqual(expectedObj);
        });
    });

    describe('When one or many object in param categories missing property name', () => {
        it('Should throw an error "Missing property name in categories parameter"', () => {
            const categories = [
                { name: 'Cat_1', range: { firstId: 1, lastId: 10 } },
                { range: { firstId: 11, lastId: 20 } },
                { name: 'Cat_3', range: { firstId: 21, lastId: 30 } },
            ];
            expect(() => {
                new Race('R1', categories);
            }).toThrow('Missing property name in categories parameter');
        });
    });

    describe('When one or many object in param categories missing property range', () => {
        it('Should throw an error "Missing property range in categories parameter"', () => {
            const categories = [
                { name: 'Cat_1', range: { firstId: 1, lastId: 10 } },
                { name: 'Cat_2' },
                { name: 'Cat_3', range: { firstId: 21, lastId: 30 } },
            ];
            expect(() => {
                new Race('R1', categories);
            }).toThrow('Missing property range in categories parameter');
        });
    });

    describe('When property firstId is missing in range object', () => {
        it('Should throw an error "Missing property firstId in categories[].range parameter"', () => {
            const categories = [
                { name: 'Cat_1', range: { firstId: 1, lastId: 10 } },
                { name: 'Cat_2', range: {} },
                { name: 'Cat_3', range: { firstId: 21, lastId: 30 } },
            ];

            expect(() => {
                new Race('R1', categories);
            }).toThrow(
                'Missing property firstId in categories[].range parameter'
            );
        });
    });

    describe('When property lastId is missing in range object', () => {
        it('Should throw an error "Missing property lastId in categories[].range parameter"', () => {
            const categories = [
                { name: 'Cat_1', range: { firstId: 1, lastId: 10 } },
                { name: 'Cat_2', range: { firstId: 11 } },
                { name: 'Cat_3', range: { firstId: 21, lastId: 30 } },
            ];

            expect(() => {
                new Race('R1', categories);
            }).toThrow(
                'Missing property lastId in categories[].range parameter'
            );
        });
    });
});

describe('Test static checkCategories', () => {
    describe("When parameter categories is [{name: 'Cat 1', range: {firstId: 1, lastId:10 }}]", () => {
        it('Should return the expected object', () => {
            const categories = [
                { name: 'Cat 1', range: { firstId: 1, lastId: 10 } },
            ];

            const expectedObj = {
                err: false,
                message: '',
            };

            expect(Race.checkCategories(categories)).toStrictEqual(expectedObj);
        });
    });

    describe('When parameter categories is [range: {firstId: 1, lastId:10 }}]', () => {
        it('Should return the expected object', () => {
            const categories = [{ range: { firstId: 1, lastId: 10 } }];

            const expectedObj = {
                err: true,
                message: 'Missing property name in categories parameter',
            };

            expect(Race.checkCategories(categories)).toStrictEqual(expectedObj);
        });
    });

    describe("When parameter categories is [{name: 'Cat 1'}]", () => {
        it('Should return the expected object', () => {
            const categories = [{ name: 'Cat 1' }];

            const expectedObj = {
                err: true,
                message: 'Missing property range in categories parameter',
            };

            expect(Race.checkCategories(categories)).toStrictEqual(expectedObj);
        });
    });

    describe("When parameter categories is [{name: 'Cat 1', range: { lastId:10 }}]", () => {
        it('Should return the expected object', () => {
            const categories = [{ name: 'Cat 1', range: { lastId: 10 } }];

            const expectedObj = {
                err: true,
                message:
                    'Missing property firstId in categories[].range parameter',
            };

            expect(Race.checkCategories(categories)).toStrictEqual(expectedObj);
        });
    });

    describe("When parameter categories is [{name: 'Cat 1', range: { firstId:10 }}]", () => {
        it('Should return the expected object', () => {
            const categories = [{ name: 'Cat 1', range: { firstId: 10 } }];

            const expectedObj = {
                err: true,
                message:
                    'Missing property lastId in categories[].range parameter',
            };

            expect(Race.checkCategories(categories)).toStrictEqual(expectedObj);
        });
    });
});

describe('Test race.start', () => {
    it('Should set the property startDate', () => {
        const race = new Race('R1');
        race.start();
        expect(race.startDate).not.toBeNull();
    });
});

describe('Test race.findRacerForId', () => {
    let race;
    beforeAll(() => {
        race = new Race('R2');
        race.racerTab = [
            { id: 1, lapTime: [] },
            { id: 2, lapTime: [] },
            { id: 3, lapTime: [] },
        ];
    });

    describe('When the racer does not exist', () => {
        it('Should return null', () => {
            const res = race.findRacerForId(20);
            expect(res).toBeNull();
        });
    });

    describe('When the racer id exist', () => {
        it('Should return the expected object', () => {
            const expectedObj = { id: 3, lapTime: [] };
            const res = race.findRacerForId(3);
            expect(res).toStrictEqual(expectedObj);
        });
    });
});

describe('Test race.addRacerLap', () => {
    let race;
    describe('When the race is started', () => {
        beforeEach(() => {
            race = new Race('R1');
            race.start();
            race.racerTab = [
                { id: 1, lapTime: [] },
                { id: 2, lapTime: [new Date()] },
                { id: 3, lapTime: [] },
            ];
        });

        describe('When the id does not exist', () => {
            it('Should return true', () => {
                const res = race.addRacerLap(8);
                expect(res).toBe(true);
            });
            it('Should add it in racerTab', () => {
                race.addRacerLap(8);
                const res = race.findRacerForId(8);
                expect(res).not.toBeNull();
            });

            it('Should have add an item in the racer lapTime array', () => {
                race.addRacerLap(8);
                const res = race.findRacerForId(8);
                expect(res.lapTime).toHaveLength(1);
            });
        });

        describe('When the id exist', () => {
            it('Should add an item in the racer lapTime array', () => {
                race.addRacerLap(2);
                const res = race.findRacerForId(2);
                expect(res.lapTime).toHaveLength(2);
            });

            it('Should return true', () => {
                const res = race.addRacerLap(2);
                expect(res).toBe(true);
            });
        });
    });

    describe('When the race is not started', () => {
        beforeEach(() => {
            race = new Race('R1');
            race.racerTab = [
                { id: 1, lapTime: [] },
                { id: 2, lapTime: [new Date()] },
                { id: 3, lapTime: [] },
            ];
        });

        it('Should return false', () => {
            const res = race.addRacerLap(2);
            expect(res).toBe(false);
        });
    });
});

describe('Test race.addCategory', () => {
    let race;
    beforeEach(() => {
        race = new Race('R1');
    });

    describe('When the category not alreadey exist', () => {
        it('Should add return true', () => {
            const res = race.addCategory('Cat_1', 1, 10);
            expect(res).toBe(true);
        });

        it('Should add the expectObject in categories', () => {
            const res = race.addCategory('Cat_1', 1, 10);
            const expectedObj = {
                name: 'Cat_1',
                range: {
                    firstId: 1,
                    lastId: 10,
                },
            };
            expect(race.categories[0]).toStrictEqual(expectedObj);
        });
    });

    describe('When the category already exist', () => {
        beforeEach(() => {
            race.addCategory('Cat_1', 1, 10);
        });

        it('Should return false', () => {
            const res = race.addCategory('Cat_1', 1, 10);
            expect(res).toBe(false);
        });

        it('Should not add another item in the array categories', () => {
            race.addCategory('Cat_1', 1, 10);
            expect(race.categories).toHaveLength(1);
        });

        it('Should not modify first & last id of the already existing category', () => {
            race.addCategory('Cat_1', 11, 20);
            expect(race.categories[0].range.firstId).toBe(1);
            expect(race.categories[0].range.lastId).toBe(10);
        });
    });

    describe('When parameter name is undefined', () => {
        it('Should throw an error', () => {
            expect(() => {
                race.addCategory();
            }).toThrow('name is invalid');
        });
    });

    describe('When parameter name is an empty string', () => {
        it('Should throw an error', () => {
            expect(() => {
                race.addCategory('');
            }).toThrow('name is invalid');
        });
    });

    describe('When parameter firstId is undefined', () => {
        it('Should throw an error', () => {
            expect(() => {
                race.addCategory('R1');
            }).toThrow('firstId is invalid');
        });
    });

    describe('When parameter lastId is undefined', () => {
        it('Should throw an error', () => {
            expect(() => {
                race.addCategory('R1', 1);
            }).toThrow('lastId is invalid');
        });
    });
});

describe('Test getCategoryForName', () => {
    let race;
    beforeAll(() => {
        const categories = [
            { name: 'Cat_1', range: { firstId: 1, lastId: 10 } },
            { name: 'Cat_2', range: { firstId: 11, lastId: 20 } },
        ];
        race = new Race('R1', categories);
    });
    describe('When the category exist', () => {
        it('Should return the expectedObj', () => {
            const expectedObj = {
                name: 'Cat_2',
                range: { firstId: 11, lastId: 20 },
            };
            const res = race.getCategoryForName('Cat_2');
            expect(res).toStrictEqual(expectedObj);
        });
    });
    describe('When the category does not exist', () => {
        it('Should retun undefined', () => {
            const res = race.getCategoryForName('Cat_8');
            expect(res).toBeUndefined();
        });
    });
    describe('When parameter catName is undefined', () => {
        it('Should throw an error', () => {
            expect(() => {
                race.getCategoryForName();
            }).toThrow('catName is invalid');
        });
    });
});

describe('Test race.getRacersForCategoryName', () => {
    let race;
    beforeAll(() => {
        const categories = [
            { name: 'Cat_1', range: { firstId: 1, lastId: 10 } },
            { name: 'Cat_2', range: { firstId: 11, lastId: 20 } },
        ];
        race = new Race('R1', categories);
        race.start();
        for (let i = 1; i <= 20; i++) {
            race.addRacerLap(i);
        }
    });

    describe('When parameter catName is Cat_1', () => {
        it('Should return an array of size 10', () => {
            const res = race.getRacersForCategoryName('Cat_1');
            expect(res).toHaveLength(10);
        });
    });

    describe('When parameter catName is Cat_8', () => {
        it('Should return an empty array', () => {
            const res = race.getRacersForCategoryName('Cat_8');
            expect(res).toHaveLength(0);
        });
    });
});

describe('Test static sortRacer', () => {
    describe('When r1 lapTime is longer than r2 lapTime', () => {
        let r1, r2;
        beforeAll(() => {
            const r1Lap1 = new Date();
            r1Lap1.setMinutes(r1Lap1.getMinutes() - 50);

            const r1Lap2 = new Date();
            r1Lap2.setMinutes(r1Lap2.getMinutes() - 30);

            const r1Lap3 = new Date();
            r1Lap3.setMinutes(r1Lap3.getMinutes() - 10);

            const r2Lap1 = new Date();
            r2Lap1.setMinutes(r2Lap1.getMinutes() - 50);

            const r2Lap2 = new Date();
            r2Lap2.setMinutes(r2Lap2.getMinutes() - 30);

            r1 = {
                id: 4,
                lapTime: [r1Lap1, r1Lap2, r1Lap3],
            };

            r2 = {
                id: 2,
                lapTime: [r2Lap1, r2Lap2],
            };
        });
        it('Should return -1', () => {
            const res = Race.sortRacer(r1, r2);
            expect(res).toBe(-1);
        });

        it('Should return 1', () => {
            const res = Race.sortRacer(r2, r1);
            expect(res).toBe(1);
        });
    });

    describe('When r1.lapTime.length is equal to r2.lapTime.length', () => {
        describe('When r1 is fastest than r2', () => {
            let r1, r2;
            beforeAll(() => {
                const r1Lap1 = new Date();
                r1Lap1.setMinutes(r1Lap1.getMinutes() - 50);

                const r1Lap2 = new Date();
                r1Lap2.setMinutes(r1Lap2.getMinutes() - 30);

                const r1Lap3 = new Date();
                r1Lap3.setMinutes(r1Lap3.getMinutes() - 10);

                const r2Lap1 = new Date();
                r2Lap1.setMinutes(r2Lap1.getMinutes() - 50);

                const r2Lap2 = new Date();
                r2Lap2.setMinutes(r2Lap2.getMinutes() - 30);

                const r2Lap3 = new Date();
                r2Lap3.setMinutes(r2Lap3.getMinutes() - 5);
                r1 = {
                    id: 4,
                    lapTime: [r1Lap1, r1Lap2, r1Lap3],
                };

                r2 = {
                    id: 2,
                    lapTime: [r2Lap1, r2Lap2, r2Lap3],
                };
            });

            it('Should return -1', () => {
                const res = Race.sortRacer(r1, r2);
                expect(res).toBe(-1);
            });

            it('Should return 1', () => {
                const res = Race.sortRacer(r2, r1);
                expect(res).toBe(1);
            });
        });

        describe('When r1 & r2 have same time', () => {
            let r1, r2;
            beforeAll(() => {
                const r1Lap1 = new Date();
                r1Lap1.setMinutes(r1Lap1.getMinutes() - 50);

                const r1Lap2 = new Date();
                r1Lap2.setMinutes(r1Lap2.getMinutes() - 30);

                const r1Lap3 = new Date();
                r1Lap3.setMinutes(r1Lap3.getMinutes() - 10);
                r1 = {
                    id: 4,
                    lapTime: [r1Lap1, r1Lap2, r1Lap3],
                };

                r2 = {
                    id: 2,
                    lapTime: [r1Lap1, r1Lap2, r1Lap3],
                };
            });

            it('Should return 0', () => {
                const res = Race.sortRacer(r1, r2);
                expect(res).toBe(0);
            });
        });
    });
});

describe('Test getRanking', () => {
    let race;
    let racers;
    beforeEach(() => {
        const categories = [
            { name: 'Cat_1', range: { firstId: 1, lastId: 10 } },
            { name: 'Cat_2', range: { firstId: 11, lastId: 20 } },
            { name: 'Cat_3', range: { firstId: 21, lastId: 30 } },
        ];
        race = new Race('R1', categories);
        race.start();
        racers = [
            generateRacer(13, [50, 30]), //Cat_2 #5
            generateRacer(1, [50, 30, 5]), //Cat_1 #3
            generateRacer(26, [49, 30, 10]), //Cat_3 #1
            generateRacer(21, [50, 20]), //Cat_3 #6
            generateRacer(2, [49, 30, 7]), //Cat_1 #2
            generateRacer(4, [30, 1]), //Cat_1 #8
            generateRacer(16, [51, 31, 4]), //Cat_2 #4
            generateRacer(23, [20, 5]), //Cat_3 #7
            generateRacer(15, [10]), //Cat_2 #9
        ];
        race.racerTab = racers;
    });

    describe('When catName is undefined', () => {
        it('Should return the expected object', () => {
            const expectedObj = [
                racers[2],
                racers[4],
                racers[1],
                racers[6],
                racers[0],
                racers[3],
                racers[7],
                racers[5],
                racers[8],
            ];
            const res = race.getRanking();
            expect(res).toStrictEqual(expectedObj);
        });
    });

    describe('When catName is Cat_2', () => {
        it('Should return the expected object', () => {
            const expectedObj = [racers[6], racers[0], racers[8]];
            const res = race.getRanking('Cat_2');
            expect(res).toStrictEqual(expectedObj);
        });
    });

    describe('When catName is Cat_1', () => {
        it('Should return the expected object', () => {
            const expectedObj = [racers[4], racers[1], racers[5]];
            const res = race.getRanking('Cat_1');
            expect(res).toStrictEqual(expectedObj);
        });
    });

    describe('When catName is Cat_3', () => {
        it('Should return the expected object', () => {
            const expectedObj = [racers[2], racers[3], racers[7]];
            const res = race.getRanking('Cat_3');
            expect(res).toStrictEqual(expectedObj);
        });
    });
});

describe('Test getStartDate', () => {
    describe('When the race is not started', () => {
        it('Should return null', () => {
            const race = new Race('R1');
            expect(race.getStartDate()).toBeNull();
        });
    });

    describe('When the race is started', () => {
        it('Should return the start date', () => {
            const race = new Race('R1');
            race.start();
            expect(_.isDate(race.getStartDate())).toBe(true);
        });
    });
});

describe('Test isStarted', () => {
    describe('When the race is not already started', () => {
        it('Should return false', () => {
            const race = new Race('R1');
            expect(race.isStarted()).toBe(false);
        });
    });

    describe('When the race is already started', () => {
        it('Should return true', () => {
            const race = new Race('R1');
            race.start();
            expect(race.isStarted()).toBe(true);
        });
    });
});

describe('Test getInsertedRacersTab', () => {
    describe('When the race is not started', () => {
        it('Should return an empty array', () => {
            const race = new Race('R1');
            expect(race.getInsertedRacersTab()).toStrictEqual([]);
        });
    });

    describe('When the race is started', () => {
        let race;
        let racers;
        beforeAll(() => {
            const categories = [
                { name: 'Cat_1', range: { firstId: 1, lastId: 10 } },
                { name: 'Cat_2', range: { firstId: 11, lastId: 20 } },
                { name: 'Cat_3', range: { firstId: 21, lastId: 30 } },
            ];
            race = new Race('R1', categories);
            race.start();
            racers = [
                generateRacer(13, [50, 31]), //Cat_2 i:0 #5
                generateRacer(1, [51, 32, 5]), //Cat_1 i:1 #3
                generateRacer(26, [49, 33, 10]), //Cat_3 i:2 #1
                generateRacer(21, [52, 20]), //Cat_3 i:3 #6
                generateRacer(2, [48, 34, 7]), //Cat_1 i:4 #2
                generateRacer(4, [30, 1]), //Cat_1 i:5 #8
                generateRacer(16, [53, 35, 4]), //Cat_2 i:6 #4
                generateRacer(23, [21, 3]), //Cat_3 i:7 #7
                generateRacer(15, [11]), //Cat_2 i:8 #9
            ];
            race.racerTab = racers;
        });

        it('Should return the expected object', () => {
            const expectedObj = [
                {
                    id: 4,
                    lapTime: [racers[5].lapTime[1]],
                },
                {
                    id: 23,
                    lapTime: [racers[7].lapTime[1]],
                },
                {
                    id: 16,
                    lapTime: [racers[6].lapTime[2]],
                },
                {
                    id: 1,
                    lapTime: [racers[1].lapTime[2]],
                },
                {
                    id: 2,
                    lapTime: [racers[4].lapTime[2]],
                },
                {
                    id: 26,
                    lapTime: [racers[2].lapTime[2]],
                },
                {
                    id: 15,
                    lapTime: [racers[8].lapTime[0]],
                },
                {
                    id: 21,
                    lapTime: [racers[3].lapTime[1]],
                },
                {
                    id: 23,
                    lapTime: [racers[7].lapTime[0]],
                },
                {
                    id: 4,
                    lapTime: [racers[5].lapTime[0]],
                },
                {
                    id: 13,
                    lapTime: [racers[0].lapTime[1]],
                },
                {
                    id: 1,
                    lapTime: [racers[1].lapTime[1]],
                },
                {
                    id: 26,
                    lapTime: [racers[2].lapTime[1]],
                },
                {
                    id: 2,
                    lapTime: [racers[4].lapTime[1]],
                },
                {
                    id: 16,
                    lapTime: [racers[6].lapTime[1]],
                },
                {
                    id: 2,
                    lapTime: [racers[4].lapTime[0]],
                },
                {
                    id: 26,
                    lapTime: [racers[2].lapTime[0]],
                },
                {
                    id: 13,
                    lapTime: [racers[0].lapTime[0]],
                },
                {
                    id: 1,
                    lapTime: [racers[1].lapTime[0]],
                },
                {
                    id: 21,
                    lapTime: [racers[3].lapTime[0]],
                },
                {
                    id: 16,
                    lapTime: [racers[6].lapTime[0]],
                },
            ];

            const res = race.getInsertedRacersTab();
            expect(res).toStrictEqual(expectedObj);
        });
    });
});

describe('Test toString', () => {
    describe('When the race is not start', () => {
        describe('When categories is empty', () => {
            it('Should return the expected string', () => {
                const expectString =
                    '{"name":"R1","categories":[],"startDate":"","racerTab":[]}';
                const race = new Race('R1');
                const res = race.toString();
                expect(res).toStrictEqual(expectString);
            });
        });

        describe('When categories is not empty', () => {
            it('Should return the expected string', () => {
                const categories = [
                    { name: 'Cat_1', range: { firstId: 1, lastId: 10 } },
                    { name: 'Cat_2', range: { firstId: 11, lastId: 20 } },
                    { name: 'Cat_3', range: { firstId: 21, lastId: 30 } },
                ];
                const race = new Race('R1', categories);
                const expectString =
                    '{"name":"R1","categories":[{"name":"Cat_1","range":{"firstId":1,"lastId":10}},{"name":"Cat_2","range":{"firstId":11,"lastId":20}},{"name":"Cat_3","range":{"firstId":21,"lastId":30}}],"startDate":"","racerTab":[]}';
                const res = race.toString();
                expect(res).toStrictEqual(expectString);
            });
        });
    });

    describe('When the race is started', () => {
        describe('When there is no racers yet', () => {
            it('Should return the expected string', () => {
                const categories = [
                    { name: 'Cat_1', range: { firstId: 1, lastId: 10 } },
                    { name: 'Cat_2', range: { firstId: 11, lastId: 20 } },
                    { name: 'Cat_3', range: { firstId: 21, lastId: 30 } },
                ];
                const race = new Race('R1', categories);
                race.start();
                const startDate = race.getStartDate();
                const isoDate = startDate.toISOString();
                const expectString = `{"name":"R1","categories":[{"name":"Cat_1","range":{"firstId":1,"lastId":10}},{"name":"Cat_2","range":{"firstId":11,"lastId":20}},{"name":"Cat_3","range":{"firstId":21,"lastId":30}}],"startDate":"${isoDate}","racerTab":[]}`;
                const res = race.toString();
                expect(res).toStrictEqual(expectString);
            });
        });

        describe('When there are racers', () => {
            const categories = [
                { name: 'Cat_1', range: { firstId: 1, lastId: 10 } },
                { name: 'Cat_2', range: { firstId: 11, lastId: 20 } },
                { name: 'Cat_3', range: { firstId: 21, lastId: 30 } },
            ];
            const race = new Race('R1', categories);
            race.start();
            const startDate = race.getStartDate();
            const isoDate = startDate.toISOString();
            const r1l1 = new Date();
            r1l1.setSeconds(r1l1.getSeconds() - 20);
            race.racerTab.push({ id: 2, lapTime: [r1l1] });
            const r2l1 = new Date();
            race.racerTab.push({ id: 1, lapTime: [r2l1] });
            const expectString = `{"name":"R1","categories":[{"name":"Cat_1","range":{"firstId":1,"lastId":10}},{"name":"Cat_2","range":{"firstId":11,"lastId":20}},{"name":"Cat_3","range":{"firstId":21,"lastId":30}}],"startDate":"${isoDate}","racerTab":[{"id":2,"lapTime":["${r1l1.toISOString()}"]},{"id":1,"lapTime":["${r2l1.toISOString()}"]}]}`;
            const res = race.toString();
            expect(res).toStrictEqual(expectString);
        });
    });
});
