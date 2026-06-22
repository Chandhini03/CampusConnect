package com.campusconnect.backend.service;

import com.campusconnect.backend.entity.Product;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // 1. Create a product linked automatically to the seller's college
    public Product createProduct(String title, String description, BigDecimal price, String imageUrl, User seller) {
        Product product = new Product();
        product.setTitle(title);
        product.setDescription(description);
        product.setPrice(price);
        product.setImageUrl(imageUrl);
        product.setSeller(seller);
        
        // This is the multi-tenant lock: copy the seller's college over to the product record
        product.setCollege(seller.getCollege());

        return productRepository.save(product);
    }

    // 2. Fetch only items matching the user's specific campus
    public List<Product> getProductsByCampus(UUID collegeId) {
        return productRepository.findByCollegeIdAndIsAvailableTrue(collegeId);
    }
}