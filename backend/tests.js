const assert = require('assert');
const FakeAddressRepository = require('./repository/repository');

describe('FakeAddressRepository', function() {
    const addressRepository = new FakeAddressRepository({
        server: "DESKTOP-UNPDD2B\\SQLEXPRESS01",
        database: "MPP_Test",
        options: {
            trustedConnection: true
        }
    });

    const testData = {
        street: 'Test Street',
        city: 'Test City',
        zipCode: '12345',
        country: 'Test Country',
        randNumber: 123
    };

    let testAddressId;

    describe('#add()', function() {
        it('should add a new address to the database', async function() {
            const result = await addressRepository.add(testData);
            testAddressId = parseInt(result.split(':')[1]);
            assert.strictEqual(typeof testAddressId, 'number');
        });
    });

    describe('#getAll()', function() {
        it('should return an array of addresses', async function() {
            const addresses = await addressRepository.getAll();
            assert.strictEqual(Array.isArray(addresses), true);
        });
    });

});
