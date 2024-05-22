const sql = require("mssql/msnodesqlv8");
const FakeAddress = require('../model/fakeAddress');

class FakeAddressRepository {
    constructor() {
        this.addresses = [];
        this.loadData();
    }

    getAll() {
        return this.addresses;
    }

    add(address) {
        return new Promise((resolve, reject) => {
            const config = {
                server: "DESKTOP-UNPDD2B\\SQLEXPRESS01",
                database: "MPP",
                options: {
                    trustedConnection: true
                }
            };
    
            sql.connect(config)
                .then(pool => {
                    return pool.request()
                        .query(`INSERT INTO Address (street, city, zipCode, country, randomNumber) VALUES 
                            ('${address.street}', '${address.city}', '${address.zipCode}', '${address.country}', '${address.randNumber}')`);
                })
                .then(async () => {
                    await this.loadData();
                    resolve('Address added successfully in the database');
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    delete(index) {
        const deletedAddress = this.addresses[index];
        this.addresses.splice(index, 1);

        const config = {
            server: "DESKTOP-UNPDD2B\\SQLEXPRESS01",
            database: "MPP",
            options: {
                trustedConnection: true
            }
        };

        return new Promise((resolve, reject) => {
            sql.connect(config)
                .then(pool => {
                    return pool.request()
                        .query(`DELETE FROM Address WHERE addressID = ${deletedAddress.id}`);
                })
                .then(result => {
                    resolve('Address deleted successfully from the database');
                })
                .catch(err => {
                    reject('Error deleting address from database');
                });
        });
    }

    update(index, updatedAddress) {
        const oldAddress = this.addresses[index];

        this.addresses[index] = updatedAddress;

        const config = {
            server: "DESKTOP-UNPDD2B\\SQLEXPRESS01",
            database: "MPP",
            options: {
                trustedConnection: true
            }
        };

        return new Promise((resolve, reject) => {
            sql.connect(config)
                .then(pool => {
                    return pool.request()
                        .query(`UPDATE Address SET 
                            street = '${updatedAddress.street}', 
                            city = '${updatedAddress.city}', 
                            zipCode = '${updatedAddress.zipCode}', 
                            country = '${updatedAddress.country}', 
                            randomNumber = '${updatedAddress.randNumber}' 
                            WHERE addressID = ${oldAddress.id}`);
                })
                .then(result => {
                    resolve('Address updated successfully in the database');
                })
                .catch(err => {
                    reject('Error updating address in the database');
                });
        });
    }

    loadData() {
        const config = {
            server: "DESKTOP-UNPDD2B\\SQLEXPRESS01",
            database: "MPP",
            driver: "msnodesqlv8",
            options: {
                trustedConnection: true
            }
        };

        sql.connect(config, async (err) => {
            if (err) {
                console.error('Error connecting to the database:', err);
                return;
            }

            try {
                const request = new sql.Request();
                const result = await request.query("SELECT * FROM Address");

                if (result.recordset.length > 0) {
                    this.addresses = result.recordset.map(record => new FakeAddress({
                        id: record.addressID,
                        street: record.street,
                        city: record.city,
                        zipCode: record.zipCode,
                        country: record.country,
                        randNumber: record.randomNumber
                    }));
                }
            } catch (error) {
                console.error('Error loading addresses:', error);
            }
        });
    }
}

module.exports = FakeAddressRepository;
