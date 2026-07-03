package com.minibill.service;

import com.minibill.entity.Category;
import com.minibill.entity.Product;
import com.minibill.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryService categoryService;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Product getProductById(UUID id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found!"));
    }
    
    public List<Product> searchProducts(String search) {
        if (search == null || search.trim().isEmpty()) {
            return productRepository.findByActiveTrue();
        }
        return productRepository.searchProducts(search);
    }
    
    public Product createProduct(Product product) {
        if (productRepository.existsBySku(product.getSku())) {
            throw new RuntimeException("SKU already exists!");
        }
        if (product.getCategory() == null || product.getCategory().getId() == null) {
            throw new RuntimeException("Category is required!");
        }
        Category category = categoryService.getCategoryById(product.getCategory().getId());
        product.setCategory(category);
        return productRepository.save(product);
    }
    
    public Product updateProduct(UUID id, Product product) {
        Product existing = getProductById(id);
        existing.setName(product.getName());
        existing.setSku(product.getSku());
        existing.setPrice(product.getPrice());
        existing.setTaxPercent(product.getTaxPercent());
        existing.setStock(product.getStock());
        
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryService.getCategoryById(product.getCategory().getId());
            existing.setCategory(category);
        }
        
        return productRepository.save(existing);
    }
    
    public void deactivateProduct(UUID id) {
        Product product = getProductById(id);
        product.setActive(false);
        productRepository.save(product);
    }
}