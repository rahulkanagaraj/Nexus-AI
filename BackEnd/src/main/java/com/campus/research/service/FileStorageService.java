package com.campus.research.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public FileStorageService() {
        try {
            Files.createDirectories(this.uploadLocation);
        } catch (Exception ex) {
            System.err.println("Could not create uploads directory: " + ex.getMessage());
        }
    }

    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            String originalFileName = file.getOriginalFilename();
            String cleanFileName = (originalFileName != null) ? Paths.get(originalFileName).getFileName().toString() : "document.pdf";
            String uniqueFileName = UUID.randomUUID().toString().substring(0, 8) + "_" + cleanFileName;

            Path targetLocation = this.uploadLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file. Please try again!", ex);
        }
    }

    public Path getFileAsPath(String fileName) {
        return this.uploadLocation.resolve(fileName).normalize();
    }
}
