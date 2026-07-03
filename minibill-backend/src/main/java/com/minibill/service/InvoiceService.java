package com.minibill.service;

import com.minibill.entity.*;
import com.minibill.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
public class InvoiceService {
    
    @Autowired
    private InvoiceRepository invoiceRepository;
    
    @Autowired
    private CustomerService customerService;
    
    @Autowired
    private ProductService productService;
    
    @Transactional
    public Invoice createInvoice(Invoice invoice) {
        System.out.println("📝 Creating invoice...");
        
        Customer customer = customerService.getCustomerById(invoice.getCustomer().getId());
        invoice.setCustomer(customer);
        
        long count = invoiceRepository.getTotalInvoiceCount() + 1;
        invoice.setInvoiceNumber(String.format("INV-%04d", count));
        
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        
        for (InvoiceItem item : invoice.getItems()) {
            Product product = productService.getProductById(item.getProduct().getId());
            
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName() + 
                                         ". Available: " + product.getStock());
            }
            
            BigDecimal unitPrice = product.getPrice();
            BigDecimal quantity = BigDecimal.valueOf(item.getQuantity());
            BigDecimal itemSubtotal = unitPrice.multiply(quantity);
            BigDecimal taxAmount = itemSubtotal.multiply(product.getTaxPercent())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal itemTotal = itemSubtotal.add(taxAmount);
            
            item.setUnitPrice(unitPrice);
            item.setTaxAmount(taxAmount);
            item.setTotal(itemTotal);
            item.setInvoice(invoice);
            
            product.setStock(product.getStock() - item.getQuantity());
            productService.updateProduct(product.getId(), product);
            
            subtotal = subtotal.add(itemSubtotal);
            totalTax = totalTax.add(taxAmount);
        }
        
        invoice.setSubtotal(subtotal);
        invoice.setTax(totalTax);
        invoice.setTotal(subtotal.add(totalTax));
        
        Invoice savedInvoice = invoiceRepository.save(invoice);
        System.out.println("✅ Invoice created: " + savedInvoice.getInvoiceNumber());
        return savedInvoice;
    }
    
    public List<Invoice> getAllInvoices() {
        System.out.println("📊 InvoiceService: Fetching all invoices...");
        List<Invoice> invoices = invoiceRepository.findAll();
        System.out.println("📊 Found " + invoices.size() + " invoices");
        return invoices;
    }
    
    public Invoice getInvoiceById(UUID id) {
        System.out.println("🔍 InvoiceService: Fetching invoice by ID: " + id);
        return invoiceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invoice not found!"));
    }
}