package com.minibill.service;

import com.minibill.entity.Customer;
import com.minibill.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
    
    public Customer getCustomerById(UUID id) {
        return customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found!"));
    }
    
    public Customer createCustomer(Customer customer) {
        if (customerRepository.existsByPhone(customer.getPhone())) {
            throw new RuntimeException("Phone number already exists!");
        }
        return customerRepository.save(customer);
    }
    
    public Customer updateCustomer(UUID id, Customer customer) {
        Customer existing = getCustomerById(id);
        existing.setName(customer.getName());
        existing.setPhone(customer.getPhone());
        existing.setEmail(customer.getEmail());
        existing.setAddress(customer.getAddress());
        return customerRepository.save(existing);
    }
    
    public void deactivateCustomer(UUID id) {
        Customer customer = getCustomerById(id);
        customer.setActive(false);
        customerRepository.save(customer);
    }
}