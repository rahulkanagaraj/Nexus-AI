package com.campus.research.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class PdfTextExtractionService {

    private final FileStorageService fileStorageService;

    public PdfTextExtractionService(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    public String extractText(String filePath) {
        if (filePath == null || filePath.isBlank()) {
            return "";
        }

        Path path = resolveToDisk(filePath);
        if (!Files.isRegularFile(path)) {
            throw new RuntimeException("PDF not found on disk: " + path);
        }

        try (PDDocument document = PDDocument.load(path.toFile())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            return text == null ? "" : text.trim();
        } catch (IOException ex) {
            throw new RuntimeException("Failed to extract text from PDF: " + path, ex);
        }
    }

    private Path resolveToDisk(String filePath) {
        Path asGiven = Paths.get(filePath);
        if (asGiven.isAbsolute() && Files.exists(asGiven)) {
            return asGiven.normalize();
        }

        String fileName = Paths.get(filePath.replace('\\', '/')).getFileName().toString();
        return fileStorageService.getFileAsPath(fileName);
    }
}
