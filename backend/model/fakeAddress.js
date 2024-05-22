class FakeAddress {
  constructor({ id, street, city, zipCode, country, randNumber }) {
    this.id = id;
    this.street = street;
    this.city = city;
    this.zipCode = zipCode;
    this.country = country;
    this.randNumber = randNumber;
  }
}

module.exports = FakeAddress;