package com.campus.research.controller;

import com.campus.research.model.MilestoneHistory;
import com.campus.research.service.MilestoneService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MilestoneController {

    private final MilestoneService milestoneService;

    public MilestoneController(MilestoneService milestoneService) {
        this.milestoneService = milestoneService;
    }

    @GetMapping("/projects/{id}/milestones")
    public ResponseEntity<List<MilestoneHistory>> getMilestones(@PathVariable Long id) {
        return ResponseEntity.ok(milestoneService.getMilestonesForProject(id));
    }
}
