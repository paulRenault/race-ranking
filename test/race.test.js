import Race from '../src/Race.js';

describe('Test race constructor', () => {
    describe('When name is race1', () => {
        it('Should set name to race1', () => {
            const race = new Race('race1');
            expect(race.name).toBe('race1');
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
