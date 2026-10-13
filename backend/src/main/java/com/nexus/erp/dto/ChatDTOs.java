package com.nexus.erp.dto;

import java.util.List;

/**
 * Week 7-8: DTOs for AI Chatbot and RAG Context Retrieval
 */
public class ChatDTOs {

    public static class ChatRequest {
        private String message;
        private List<String> conversationHistory;

        public ChatRequest() {}

        public ChatRequest(String message) {
            this.message = message;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public List<String> getConversationHistory() { return conversationHistory; }
        public void setConversationHistory(List<String> conversationHistory) { this.conversationHistory = conversationHistory; }
    }

    public static class ChatResponse {
        private String reply;
        private String retrievedContext; // The RAG injected context snapshot
        private long tokensUsedEstimate;

        public ChatResponse() {}

        public ChatResponse(String reply, String retrievedContext, long tokensUsedEstimate) {
            this.reply = reply;
            this.retrievedContext = retrievedContext;
            this.tokensUsedEstimate = tokensUsedEstimate;
        }

        public String getReply() { return reply; }
        public void setReply(String reply) { this.reply = reply; }
        public String getRetrievedContext() { return retrievedContext; }
        public void setRetrievedContext(String retrievedContext) { this.retrievedContext = retrievedContext; }
        public long getTokensUsedEstimate() { return tokensUsedEstimate; }
        public void setTokensUsedEstimate(long tokensUsedEstimate) { this.tokensUsedEstimate = tokensUsedEstimate; }
    }
}
