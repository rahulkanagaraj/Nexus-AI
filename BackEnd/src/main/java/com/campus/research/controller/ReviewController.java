package com.campus.research.controller;

import com.campus.research.dto.ReviewRequest;
import com.campus.research.model.Review;
import com.campus.research.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/reviews")
    public ResponseEntity<?> submitReview(@RequestBody ReviewRequest request) {
        try {
            Review review = reviewService.submitReview(request);
            return ResponseEntity.ok(Map.of(
                    "message", "Review feedback saved successfully",
                    "review", review
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/projects/{id}/reviews")
    public ResponseEntity<List<Review>> getReviewsByProject(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewsForProject(id));
    }
}
