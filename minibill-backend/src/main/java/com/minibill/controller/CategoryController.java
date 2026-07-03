package com.minibill.controller;

import com.minibill.entity.Category;
import com.minibill.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;
    
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }
    
    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryService.createCategory(category);
    }
    
    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable UUID id, @RequestBody Category category) {
        return categoryService.updateCategory(id, category);
    }
    
    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable UUID id) {
        categoryService.deactivateCategory(id);
        return "Category deactivated successfully!";
    }
}