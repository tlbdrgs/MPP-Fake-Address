import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import FakeAddressGenerator from './FakeAddressGenerator';
import { fakeAddresses } from './FakeAddressGenerator';


// describe('FakeAddressGenerator', () => {
//     test('renders Fake Address Generator component', () => {
//         render(<FakeAddressGenerator />);
//         expect(screen.getByText('Fake Address Generator')).toBeInTheDocument();
//     });

//     test('adds, updates, and deletes an address', () => {

//         for (let i = 0; i < 5; i++) {
//             fireEvent.click(screen.getByText(/Delete/)[0]);
//         }

//         expect(screen.queryByText('Update')).not.toBeInTheDocument();


//         fireEvent.click(screen.getByText('Add Address'));

//         const streetInput = screen.getByLabelText('Street:');
//         const cityInput = screen.getByLabelText('City:');
//         const zipCodeInput = screen.getByLabelText('Zip Code:');
//         fireEvent.change(streetInput, { target: { value: '123 Main St' } });
//         fireEvent.change(cityInput, { target: { value: 'Springfield' } });
//         fireEvent.change(zipCodeInput, { target: { value: '123456' } });
//         fireEvent.click(screen.getByText('Save Address'));
//         const updateButton = screen.getByText('Update');
//         fireEvent.click(updateButton);


//         fireEvent.change(screen.getByLabelText('Street:'), { target: { value: 'Updated Main St' } });
//         fireEvent.change(screen.getByLabelText('City:'), { target: { value: 'Updated City' } });
//         fireEvent.click(screen.getByText('Save'));

//         expect(screen.getByText(/Updated Main St/)).toBeInTheDocument();
//         expect(screen.getByText(/Updated City/)).toBeInTheDocument();

//         fireEvent.click(screen.getByText('Delete'));

//         expect(screen.queryByText('Delete')).not.toBeInTheDocument();
//     });

//     test('sorts addresses by city name in ascending order', () => {
//         render(<FakeAddressGenerator />);

//         expect(fakeAddresses[2].city == 'Timișoara')
//         expect(fakeAddresses[4].city == 'Constanța')
//         fireEvent.click(screen.getByTestId('sort-button'));
//         expect(fakeAddresses[4].city == 'Timișoara')
//         expect(fakeAddresses[2].city == 'Constanța')
//     });

//     test('Pie chart is rendered within the page', () => {
//         render(<FakeAddressGenerator />);
    
//         const pieChartContainer = screen.getByTestId('pie-chart-container');
    
//         expect(pieChartContainer).toBeInTheDocument();
    
//         const pieChart = pieChartContainer.querySelector('canvas');
//         expect(pieChart).toBeInTheDocument();
//     });
// });

const FakeAddressRepository = require('../../backend/repository/repository');
const FakeAddress = require('../../backend/model/fakeAddress');

describe('FakeAddressRepository', () => {
  let fakeAddressRepository;

  beforeEach(() => {
    fakeAddressRepository = new FakeAddressRepository();
  });

  it('should initialize with addresses', () => {
    const addresses = fakeAddressRepository.getAll();
    expect(addresses).toHaveLength(5);
  });

  it('should add a new address', () => {
    const initialAddressesLength = fakeAddressRepository.getAll().length;
    const newAddressData = {
      street: 'New Street',
      city: 'New City',
      zipCode: '789012',
      country: 'New Country',
      randNumber: 3.5
    };
    fakeAddressRepository.add(new FakeAddress(newAddressData));
    const updatedAddresses = fakeAddressRepository.getAll();


    expect(updatedAddresses).toHaveLength(initialAddressesLength + 1);
    expect(updatedAddresses[updatedAddresses.length - 1]).toEqual(newAddressData);
  });

  it('should delete an address', () => {
    const initialAddressesLength = fakeAddressRepository.getAll().length;
    const indexToDelete = 2;

    fakeAddressRepository.delete(indexToDelete);
    const updatedAddresses = fakeAddressRepository.getAll();

    expect(updatedAddresses).toHaveLength(initialAddressesLength - 1);
    expect(updatedAddresses.findIndex(address => address.street === 'Strada Universitatii 3')).toEqual(-1); 
  });

  it('should update an address', () => {
    const initialAddresses = fakeAddressRepository.getAll();
    const indexToUpdate = 1;
    const updatedAddressData = {
      street: 'Updated Street',
      city: 'Updated City',
      zipCode: '000000',
      country: 'Updated Country',
      randNumber: 9.8
    };

    fakeAddressRepository.update(indexToUpdate, new FakeAddress(updatedAddressData));
    const updatedAddresses = fakeAddressRepository.getAll();

    expect(updatedAddresses).toHaveLength(initialAddresses.length);
    expect(updatedAddresses[indexToUpdate]).toEqual(updatedAddressData);
  });

  it('should filter addresses by street name', () => {
    const filteredAddresses = fakeAddressRepository.filterByStreet('lu');
    expect(filteredAddresses).toHaveLength(2);
});

});
