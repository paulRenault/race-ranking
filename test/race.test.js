import Race from '../src/Race.js';

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
        race.racerTab = [{ id: 1, loopTime: [] }, { id: 2, loopTime: [] }, { id: 3, loopTime: [] }];
    });

    describe('When the racer does not exist', () => {
        it('Should return null', () => {
            const res = race.findRacerForId(20);
            expect(res).toBeNull();
        })
    })

    describe('When the racer id exist', () => {
        it('Should return the expected object', () => {
            const expectedObj = { id: 3, loopTime: [] };
            const res = race.findRacerForId(3);
            expect(res).toStrictEqual(expectedObj);
        });
    });
});

describe('Test race.addRacerLoop', () => {
    let race;
    describe('When the race is started', () => {
        beforeEach(() => {
            race = new Race('R1');
            race.start();
            race.racerTab = [{ id: 1, loopTime: [] }, { id: 2, loopTime: [new Date()] }, { id: 3, loopTime: [] }];
        });

        describe('When the id does not exist', () => {
            it('Should return true', () => {
                const res = race.addRacerLoop(8);
                expect(res).toBe(true);
            });
            it('Should add it in racerTab', () => {
                race.addRacerLoop(8);
                const res = race.findRacerForId(8);
                expect(res).not.toBeNull();
            });

            it('Should have add an item in the racer loopTime array', () => {
                race.addRacerLoop(8);
                const res = race.findRacerForId(8);
                expect(res.loopTime).toHaveLength(1);
            });
        });

        describe('When the id exist', () => {
            it('Should add an item in the racer loopTime array', () => {
                race.addRacerLoop(2);
                const res = race.findRacerForId(2);
                expect(res.loopTime).toHaveLength(2);
            });

            it('Should return true', () => {
                const res = race.addRacerLoop(2);
                expect(res).toBe(true);
            });
        });
    });

    describe('When the race is not started', () => {
        beforeEach(() => {
            race = new Race('R1');
            race.racerTab = [{ id: 1, loopTime: [] }, { id: 2, loopTime: [new Date()] }, { id: 3, loopTime: [] }];
        });

        it('Should return false', () => {
            const res = race.addRacerLoop(2);
            expect(res).toBe(false);
        });
    });
})