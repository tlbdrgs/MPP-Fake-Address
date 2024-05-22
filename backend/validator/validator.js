class AddressValidator {
    static validateAddress(addressData) {
      const errors = {};
  
      if (!addressData.street || addressData.street.trim() === '') {
        errors.street = 'Street is required';
      }
  
      if (!addressData.city || addressData.city.trim() === '') {
        errors.city = 'City is required';
      }
  
      if (!addressData.zipCode || !/^\d{6}$/.test(addressData.zipCode)) {
        errors.zipCode = 'Zip code should be exactly 6 numbers.';
      }
  
      if (!addressData.country || addressData.country.trim() === '') {
        errors.country = 'Country is required';
      }
  
      if (!addressData.randNumber || isNaN(parseFloat(addressData.randNumber)) || parseFloat(addressData.randNumber) <= 0) {
        errors.randNumber = 'Random number should be a positive number';
      }
  
      return errors;
    }
  }
  
  module.exports = AddressValidator;