package com.campus.research.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class OllamaSummarizationService {

    private static final int MAX_SOURCE_CHARS = 12000;

    private final RestClient restClient;
    private final String model;

    public OllamaSummarizationService(
            @Value("${ollama.base-url:http://localhost:11434}") String baseUrl,
            @Value("${ollama.model:llama3.2}") String model
    ) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5_000);
        factory.setReadTimeout(120_000);

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(factory)
                .build();
        this.model = model;
    }

    public String summarize(String text) {
        if (text == null || text.isBlank()) {
            return "";
        }

        String clipped = text.length() > MAX_SOURCE_CHARS
                ? text.substring(0, MAX_SOURCE_CHARS)
                : text;

        String prompt = "Summarize the following research proposal PDF in 5-8 concise sentences. "
                + "Cover the problem, method, and expected outcomes. Do not invent facts.\n\n"
                + clipped;

        @SuppressWarnings("unchecked")
        Map<String, Object> body = restClient.post()
                .uri("/api/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "model", model,
                        "prompt", prompt,
                        "stream", false
                ))
                .retrieve()
                .body(Map.class);

        if (body == null || body.get("response") == null) {
            throw new RuntimeException("Ollama returned an empty summary");
        }
        return body.get("response").toString().trim();
    }
}
