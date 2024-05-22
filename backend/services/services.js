const FakeAddressRepository = require('../repository/repository');

class FakeAddressService {
  constructor() {
    this.addressRepository = new FakeAddressRepository();
  }

  getAllAddresses() {
    const allAddresses = this.addressRepository.getAll();
    return allAddresses;
  }

  addAddress(addressData) {
    return this.addressRepository.add(addressData);
  }

  updateAddress(index, updatedAddressData) {
    return this.addressRepository.update(index, updatedAddressData);
  }

  deleteAddress(index) {
    return this.addressRepository.delete(index);
  }

  sortAddressesByCity() {
    const addresses = this.addressRepository.getAll();
    addresses.sort((a, b) => a.city.localeCompare(b.city));
    this.addressRepository.setAll(addresses);
  }

  filterByStreet(filterStreet) {
    return this.addressRepository.filterByStreet(filterStreet);
  }

  getPersonsByAddress(addressId) {
    return this.addressRepository.getPersonsByAddress(addressId);
  }

  
}

module.exports = new FakeAddressService();