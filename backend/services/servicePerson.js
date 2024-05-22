const FakePersonRepository = require('../repository/personRepository');

class FakePersonService {
  constructor() {
    this.personRepository = new FakePersonRepository();
  }

  async getAllPersons() {
    try {
      return await this.personRepository.getAll();
    } catch (error) {
      throw error;
    }
  }

  async addPerson(personData) {
    try {
      return await this.personRepository.add(personData);
    } catch (error) {
      throw error;
    }
  }

  async updatePerson(id, updatedPersonData) {
    try {
      return await this.personRepository.update(id, updatedPersonData);
    } catch (error) {
      throw error;
    }
  }

  async deletePerson(id) {
    try {
      return await this.personRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
  
  async getPersonsByAddress(addressId) {
    try {
      return await this.personRepository.getPersonsByAddress(addressId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FakePersonService();
