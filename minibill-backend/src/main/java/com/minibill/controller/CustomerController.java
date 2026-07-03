package com.minibill.controller;

import com.minibill.entity.Customer;
import com.minibill.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CustomerController {
    
    @Autowired
    private CustomerService customerService;
    
    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }
    
    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerService.createCustomer(customer);
    }
    
    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable UUID id, @RequestBody Customer customer) {
        return customerService.updateCustomer(id, customer);
    }
    
    @DeleteMapping("/{id}")
    public String deleteCustomer(@PathVariable UUID id) {
        customerService.deactivateCustomer(id);
        return "Customer deactivated successfully!";
    }
}