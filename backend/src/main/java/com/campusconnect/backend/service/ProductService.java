package com.campusconnect.backend.service;

import com.campusconnect.backend.dto.ProductRequest;
import com.campusconnect.backend.dto.ProductResponse;
import com.campusconnect.backend.entity.Product;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.repository.ProductRepository;
import com.campusconnect.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductService(ProductRepository productRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // 1. Create a product linked automatically to the seller's college
    public ProductResponse createProduct(ProductRequest request, String userEmail) {
        User seller = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = new Product();
        product.setTitle(request.title());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setImageUrl(request.imageUrl());
        product.setSeller(seller);
        product.setAvailable(request.isAvailable());

        // This is the multi-tenant lock: copy the seller's college over to the product record
        product.setCollege(seller.getCollege());

        return mapToDTO(productRepository.save(product));
    }

    // 2. Fetch only items matching the user's specific campus
    public List<ProductResponse> getProductsForUserCollege(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return productRepository.findByCollegeIdAndIsAvailableTrue(user.getCollege().getId())
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // 3. GET SINGLE
    public ProductResponse getProductById(String productId) {
        Product product = productRepository.findById(UUID.fromString(productId))
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToDTO(product);
    }

    // 4. UPDATE (PUT)
    public ProductResponse updateProduct(String productId, ProductRequest request, String userEmail) {
        Product product = productRepository.findById(UUID.fromString(productId))
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Security check: Only the seller can edit their product
        if (!product.getSeller().getEmail().equals(userEmail)) {
            throw new RuntimeException("You are not authorized to edit this product");
        }

        product.setTitle(request.title());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setImageUrl(request.imageUrl());
        product.setAvailable(request.isAvailable());

        Product updatedProduct = productRepository.save(product);
        return mapToDTO(updatedProduct);
    }

    public void deleteProduct(String productId, String userEmail) {
        Product product = productRepository.findById(UUID.fromString(productId))
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getEmail().equals(userEmail)) {
            throw new RuntimeException("You are not authorized to delete this product");
        }

        productRepository.delete(product);
    }

    // Helper method to convert Entity -> DTO
    private ProductResponse mapToDTO(Product product) {
        return new ProductResponse(
                product.getId().toString(),
                product.getTitle(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                product.isAvailable(),
                product.getSeller().getId().toString(),
                product.getSeller().getEmail(),
                product.getSeller().getName()
        );
    }
}
