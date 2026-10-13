package com.nexus.erp.controller;

import com.nexus.erp.dto.ChatDTOs.*;
import com.nexus.erp.service.AiRagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Week 7-8: AI Integration & RAG Chatbot Controller
 * Accepts user queries, retrieves live ERP database context, and generates grounded answers
 */
@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class ChatbotController {

    private final AiRagService aiRagService;

    @Autowired
    public ChatbotController(AiRagService aiRagService) {
        this.aiRagService = aiRagService;
    }

    // POST /api/ai/chat -> RAG context injection conversational endpoint
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chatWithCopilot(@RequestBody ChatRequest request) {
        ChatResponse response = aiRagService.processChatQuery(request);
        return ResponseEntity.ok(response);
    }
}
