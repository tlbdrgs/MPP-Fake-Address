const sql = require("mssql/msnodesqlv8");
const FakePerson = require('../model/fakePerson');

class FakePersonRepository {
    constructor() {
        this.persons = [];
        this.loadData();
    }

    async getAll() {
        return this.persons;
    }

    async add(newPerson) {
        try {
            const pool = await this.connectToDatabase();
            const result = await pool.request()
                .input('name', sql.NVarChar(50), newPerson.name)
                .input('surname', sql.NVarChar(50), newPerson.surname)
                .input('addressId', sql.Int, newPerson.addressID)
                .query(`
                    DECLARE @newPersonID INT;
                    INSERT INTO Person (name, surname, addressID) VALUES (@name, @surname, @addressId);
                    SET @newPersonID = SCOPE_IDENTITY();
                    SELECT @newPersonID AS newPersonID;
                `);

            const newPersonId = result.recordset[0].newPersonID;

            const person = new FakePerson({
                id: newPersonId,
                name: newPerson.name,
                surname: newPerson.surname,
                addressID: newPerson.addressID
            });

            this.persons.push(person);
            return person;
        } catch (error) {
            console.error('Error adding person to database:', error);
            throw error;
        }
    }
    
    async delete(personId) {
        try {
            const pool = await this.connectToDatabase();
            await pool.request()
                .input('personId', sql.Int, personId)
                .query(`DELETE FROM Person WHERE personID = @personId`);

            this.persons = this.persons.filter(person => person.id !== personId);
        } catch (error) {
            console.error('Error deleting person from database:', error);
            throw error;
        }
    }

    async update(personId, updatedPerson) {
        try {
            const pool = await this.connectToDatabase();
            await pool.request()
                .input('name', sql.NVarChar(50), updatedPerson.name)
                .input('surname', sql.NVarChar(50), updatedPerson.surname)
                .input('personId', sql.Int, personId)
                .query(`UPDATE Person SET name = @name, surname = @surname WHERE personID = @personId`);
    
            const updated = this.persons.find(person => person.id === personId);
            if (updated) {
                updated.name = updatedPerson.name;
                updated.surname = updatedPerson.surname;
            }
        } catch (error) {
            console.error('Error updating person in database:', error.message);
            throw error;
        }
    }

    async getPersonsByAddress(addressId) {
        await this.loadData();
        return this.persons.filter(person => person.addressID === addressId);
    }

    async loadData() {
        const config = {
            server: "DESKTOP-UNPDD2B\\SQLEXPRESS01",
            database: "MPP",
            options: {
                trustedConnection: true
            }
        };
    
        try {
            const pool = await sql.connect(config);
            const result = await pool.request().query("SELECT * FROM Person");
    
            if (result.recordset.length > 0) {
                this.persons = result.recordset.map(record => new FakePerson({
                    id: record.personID,
                    name: record.name,
                    surname: record.surname,
                    addressID: record.addressID
                }));
            }
        } catch (error) {
            console.error('Error loading persons from database:', error);
            throw error;
        } finally {
            sql.close();
        }
    }
    

    async connectToDatabase() {
        const config = {
            server: "DESKTOP-UNPDD2B\\SQLEXPRESS01",
            database: "MPP",
            options: {
                trustedConnection: true
            }
        };

        try {
            return await sql.connect(config);
        } catch (error) {
            console.error('Error connecting to the database:', error);
            throw error;
        }
    }
}

module.exports = FakePersonRepository;
