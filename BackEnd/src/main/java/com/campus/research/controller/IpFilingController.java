package com.campus.research.controller;

import com.campus.research.dto.IpFilingRequest;
import com.campus.research.dto.IpStatsResponse;
import com.campus.research.model.IpFiling;
import com.campus.research.service.IpFilingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ip-filings")
@CrossOrigin(origins = "*")
public class IpFilingController {

    private final IpFilingService ipFilingService;

    public IpFilingController(IpFilingService ipFilingService) {
        this.ipFilingService = ipFilingService;
    }

    @GetMapping
    public ResponseEntity<List<IpFiling>> getAllFilings() {
        return ResponseEntity.ok(ipFilingService.getAllFilings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFilingById(@PathVariable Long id) {
        return ipFilingService.getFilingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public ResponseEntity<IpStatsResponse> getIpStats() {
        return ResponseEntity.ok(ipFilingService.getStats());
    }

    @PostMapping
    public ResponseEntity<?> createFiling(@RequestBody IpFilingRequest request) {
        try {
            IpFiling created = ipFilingService.createOrUpdateFiling(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "IP filing record created successfully",
                    "ipFiling", created
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFiling(@PathVariable Long id, @RequestBody IpFilingRequest request) {
        try {
            IpFiling updated = ipFilingService.updateFiling(id, request);
            return ResponseEntity.ok(Map.of(
                    "message", "IP filing updated successfully",
                    "filing", updated
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }
}
