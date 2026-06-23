package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.ProductRequest;
import com.campusconnect.backend.dto.ProductResponse;
import com.campusconnect.backend.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductRequest request, Principal principal) {
        ProductResponse response = productService.createProduct(request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts(Principal principal) {
        // principal.getName() automatically contains the email extracted from the JWT token
        List<ProductResponse> responses = productService.getProductsForUserCollege(principal.getName());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable String id) {
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable String id, @RequestBody ProductRequest request, Principal principal) {
        ProductResponse response = productService.updateProduct(id, request, principal.getName());
        return ResponseEntity.ok(response);
    }
}