package com.nexus.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * ============================================================================
 * Week 1: Spring Boot Main Application Class
 * 3rd Year B.Tech Minor Project - ERP System
 * ============================================================================
 */
@SpringBootApplication
@EnableCaching   // Week 9: Enable caching support (@Cacheable)
@EnableAsync     // Week 9: Enable asynchronous processing (@Async)
public class ErpApplication {

    public static void main(String[] args) {
        SpringApplication.run(ErpApplication.class, args);
        System.out.println("==========================================================");
        System.out.println("  NEXUS ERP Backend Started Successfully on Port 8080!    ");
        System.out.println("  H2 DB Console: http://localhost:8080/h2-console         ");
        System.out.println("  Swagger/Health: http://localhost:8080/actuator/health   ");
        System.out.println("==========================================================");
    }
}
