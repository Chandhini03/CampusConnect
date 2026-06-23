package com.campusconnect.backend.controller;

import com.campusconnect.backend.entity.Product;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // POST: Create a listing (Protected Endpoint)
    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Map<String, Object> request, 
                                              @AuthenticationPrincipal User loggedInUser) {
        
        String title = (String) request.get("title");
        String description = (String) request.get("description");
        BigDecimal price = new BigDecimal(request.get("price").toString());
        String imageUrl = (String) request.get("imageUrl");

        // loggedInUser is populated directly out of your JWT token properties!
        Product newProduct = productService.createProduct(title, description, price, imageUrl, loggedInUser);
        return ResponseEntity.ok(newProduct);
    }

    // GET: View the campus marketplace feed (Protected Endpoint)
    @GetMapping
    public ResponseEntity<List<Product>> getCampusMarketplace(@AuthenticationPrincipal User loggedInUser) {
        // Automatically isolates items to the user's own college ID
        List<Product> feed = productService.getProductsByCampus(loggedInUser.getCollege().getId());
        return ResponseEntity.ok(feed);
    }
}