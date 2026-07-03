package com.minibill.service;

import com.minibill.entity.Category;
import com.minibill.repository.CategoryRepository;
import com.minibill.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private ProductRepository productRepository;  // ← ADD THIS
    
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    public Category getCategoryById(UUID id) {
        return categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found!"));
    }
    
    public Category createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Category name already exists!");
        }
        return categoryRepository.save(category);
    }
    
    public Category updateCategory(UUID id, Category category) {
        Category existing = getCategoryById(id);
        existing.setName(category.getName());
        existing.setDescription(category.getDescription());
        existing.setDefaultGstPercent(category.getDefaultGstPercent());
        return categoryRepository.save(existing);
    }
    
    public void deactivateCategory(UUID id) {
        Category category = getCategoryById(id);
        
        // ✅ Check if category has active products
        long activeProducts = productRepository.countByCategoryIdAndActiveTrue(id);
        if (activeProducts > 0) {
            throw new RuntimeException("Cannot deactivate category with active products! There are " + activeProducts + " active products in this category.");
        }
        
        category.setActive(false);
        categoryRepository.save(category);
    }
}