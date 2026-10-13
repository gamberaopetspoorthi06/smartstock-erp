import React, { useState } from 'react';
import { 
  GraduationCap, Database, GitBranch, Layers, ShieldCheck, 
  HelpCircle, ChevronDown, ChevronUp, CheckCircle, Code, Cpu,
  BookCheck, Bot, Box, Lock, CheckSquare
} from 'lucide-react';

export const ArchitectureInspector: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [syllabusTab, setSyllabusTab] = useState<'SYLLABUS' | 'SCHEMA' | 'VIVA'>('SYLLABUS');

  const syllabusWeeks = [
    {
      week: 'Week 1',
      title: 'Setup & REST API Basics',
      concepts: 'Vite React Setup, Spring Boot MVC Architecture, @RestController, @GetMapping, JSON Responses, HTTP Status Codes',
      files: 'ItemController.java, ErpApplication.java, App.tsx',
      status: 'Implemented'
    },
    {
      week: 'Week 2',
      title: 'Dynamic UI + CRUD Operations',
      concepts: 'Table Rendering, useEffect, CRUD APIs (GET/POST/PUT/DELETE), ResponseEntity, Service Layer, Repository Layer, MySQL/H2 CRUD',
      files: 'ItemService.java, ItemRepository.java, ItemCatalog.tsx',
      status: 'Implemented'
    },
    {
      week: 'Week 3',
      title: 'Forms, Validation & Registration',
      concepts: 'Controlled Components, Form Validation, Entity vs DTO, @Valid Bean Validation, Global Exception Handling (@ControllerAdvice)',
      files: 'ItemDTO.java, GlobalExceptionHandler.java, AuthModal.tsx',
      status: 'Implemented'
    },
    {
      week: 'Week 4',
      title: 'JPA Relations + Advanced CRUD',
      concepts: 'Edit/Delete Modals, Loading States, JPA Mappings (@OneToMany, @ManyToOne), Master-Detail Purchase Orders',
      files: 'PurchaseOrder.java, POLineItem.java, ItemModal.tsx',
      status: 'Implemented'
    },
    {
      week: 'Week 5',
      title: 'Authentication Foundations',
      concepts: 'Login Form, Auth Context, Role Enum (ROLE_ADMIN, ROLE_USER), Role-Based UI Permissions',
      files: 'AuthContext.tsx, User.java, Role.java, Header.tsx',
      status: 'Implemented'
    },
    {
      week: 'Week 6',
      title: 'JWT + Spring Security',
      concepts: 'Token Storage, Security Configuration, Filter Chain, JWT Generation & Validation, BCrypt Password Encoding',
      files: 'SecurityConfig.java, JwtTokenProvider.java, JwtAuthenticationFilter.java',
      status: 'Implemented'
    },
    {
      week: 'Week 7-8',
      title: 'AI Integration + Chatbot + RAG',
      concepts: 'Chat UI, Message List, Typing Indicator, Context Injection, RAG Basics (Live Database Retrieval into Prompt)',
      files: 'AiRagService.java, ChatbotController.java, ChatbotDrawer.tsx',
      status: 'Implemented'
    },
    {
      week: 'Week 9-10',
      title: 'Performance Optimization & Logging',
      concepts: 'Error Boundaries, Retry Logic, Caching (@Cacheable, @CacheEvict), Spring Boot Actuator (/actuator/health)',
      files: 'ItemService.java, ErrorBoundary.tsx, application.yml',
      status: 'Implemented'
    },
    {
      week: 'Week 11-12',
      title: 'Testing & Containerization',
      concepts: 'Unit Testing with JUnit 5 & Mockito, Dockerfile for Backend & Frontend, Docker Compose with MySQL Container',
      files: 'ItemServiceTest.java, backend/Dockerfile, docker-compose.yml',
      status: 'Implemented'
    }
  ];

  const vivaQuestions = [
    {
      q: 'Q1: Why did you choose to scope only one primary module (Inventory) instead of building a superficial monolithic ERP?',
      a: 'In enterprise architecture, building a deep, resilient single module with genuine inter-module transaction integrity is far more realistic and technically rigorous than building a wide CRUD system with disconnected tables. By focusing on Inventory and bridging it with Procurement and Finance, we demonstrate cross-domain event orchestration, double-entry financial posting, and optimistic concurrency control without creating spaghetti code.'
    },
    {
      q: 'Q2: How does the system enforce Optimistic Concurrency Control (OCC) and handle stale data?',
      a: 'Every mutable entity (e.g. Item Master, Purchase Order) maintains an incremental "version" token and an "updatedAt" ISO timestamp. When a client submits an update, the backend compares clientVersion === serverVersion. If another transaction has modified the row in the interim, the transaction is rejected with an OCC Version Collision (HTTP 409 Conflict), and the user is provided a side-by-side diff resolution screen to prevent dirty overwrites.'
    },
    {
      q: 'Q3: Explain the exact transactional mechanics when a Purchase Order is Received (GRN).',
      a: 'When an issued Purchase Order transitions to RECEIVED (Goods Receipt Note): (1) PurchaseOrder.status updates to RECEIVED. (2) For each line item, an immutable StockMovement entry is recorded (audit trail). (3) The Item master on-hand currentStock is incremented and status is re-evaluated. (4) An automated double-entry journal entry is dispatched to the General Ledger: Debit Account 1300 (Inventory Asset) and Credit Account 2000 (Accounts Payable) for the total monetary value. (5) All actions are committed atomically and logged in the immutable AuditLog.'
    },
    {
      q: 'Q4: How does this ERP adhere to Database Normalization (3NF)?',
      a: 'The relational schema is structured into distinct third-normal-form entities: Warehouses, Suppliers, Items, PurchaseOrders, POLineItems, StockMovements, and LedgerEntries. Transitive dependencies are removed; for example, vendor details live in the Supplier table and are referenced by vendorId in PurchaseOrders. Historical unit costs are captured in line items and stock movements to preserve point-in-time financial audit trails even if the catalog price changes later.'
    },
    {
      q: 'Q5: How does the Week 7-8 AI Chatbot implement RAG (Retrieval-Augmented Generation)?',
      a: 'When a user queries the AI Assistant (e.g. "Which items are low in stock?"), AiRagService first executes a database retrieval step over the live items table. It formats these live records into a structured context snapshot and injects it into the reasoning prompt. This prevents hallucination and allows the AI to provide exact, real-time figures about current stock and purchase orders.'
    },
    {
      q: 'Q6: What is the purpose of @Valid and @ControllerAdvice in Week 3?',
      a: '@Valid triggers Spring Bean Validation on DTO inputs (e.g., checking @NotBlank on SKU or @Min(0) on stock). If validation fails, @ControllerAdvice intercepts the resulting MethodArgumentNotValidException globally and returns a clean, structured JSON response with HTTP 400 Bad Request and field-specific error messages.'
    },
    {
      q: 'Q7: Explain the JPA @OneToMany and @ManyToOne mapping in Week 4.',
      a: 'PurchaseOrder has a @OneToMany relationship mapped to POLineItem with cascade = CascadeType.ALL and orphanRemoval = true. Conversely, POLineItem has a @ManyToOne relationship with @JoinColumn(name = "purchase_order_id"). This enforces referential integrity: saving or deleting a PurchaseOrder automatically manages all of its associated line items in MySQL.'
    },
    {
      q: 'Q8: How does Spring Security authenticate users using JWT in Week 5-6?',
      a: 'When a user posts credentials to /api/auth/login, AuthService verifies the password using BCrypt. If valid, JwtTokenProvider issues a cryptographically signed HMAC SHA-256 token containing the username and role. On subsequent requests, JwtAuthenticationFilter intercepts the HTTP Authorization: Bearer <token> header, validates the signature, and sets the SecurityContext.'
    },
    {
      q: 'Q9: How are performance optimization and caching handled in Week 9-10?',
      a: 'The ItemService leverages Spring Cache annotations: @Cacheable("items") caches the product catalog in memory to avoid repetitive database reads. When an item is added, updated, or deleted, @CacheEvict(value = "items", allEntries = true) flushes the cache to ensure eventual consistency without stale data.'
    },
    {
      q: 'Q10: How does docker-compose.yml orchestrate the application in Week 11-12?',
      a: 'docker-compose.yml defines three isolated containers: (1) mysql-db running official MySQL 8 with persistent volume storage, (2) backend running the Spring Boot JAR built via multi-stage OpenJDK 17 Dockerfile, and (3) frontend running React Vite served via Nginx. It configures network bridge and environment variables so backend connects to mysql-db automatically.'
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Hero Header */}
      <div className="viva-card" style={{ 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
        borderColor: 'rgba(99, 102, 241, 0.35)',
        padding: '1.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.5rem' }}>
          <div className="brand-icon">
            <GraduationCap size={22} />
          </div>
          <div>
            <span className="viva-badge">B.Tech (AU-R24) 3rd & 4th Year Minor Project</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>NEXUS ERP - Curriculum & Viva Defense Suite</h2>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
          Built directly according to the <strong>12-Week University Syllabus</strong> (Page 260 of AU-R24). Integrates Spring Boot 3 REST APIs, MySQL, JPA Relations, JWT Spring Security, AI RAG Copilot, and Docker containerization.
        </p>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
          <button
            className={`btn ${syllabusTab === 'SYLLABUS' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSyllabusTab('SYLLABUS')}
          >
            <BookCheck size={15} />
            <span>12-Week Syllabus Matrix</span>
          </button>
          <button
            className={`btn ${syllabusTab === 'SCHEMA' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSyllabusTab('SCHEMA')}
          >
            <Database size={15} />
            <span>Database Schema (3NF)</span>
          </button>
          <button
            className={`btn ${syllabusTab === 'VIVA' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSyllabusTab('VIVA')}
          >
            <HelpCircle size={15} />
            <span>10 Viva Q&As for Defense</span>
          </button>
        </div>
      </div>

      {/* Tab 1: 12-Week Syllabus Matrix */}
      {syllabusTab === 'SYLLABUS' && (
        <div className="viva-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <BookCheck size={20} color="#818cf8" />
            <h3 style={{ fontSize: '1.15rem' }}>AU-R24 12-Week Curriculum Implementation Checklist</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {syllabusWeeks.map((w, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  display: 'grid',
                  gridTemplateColumns: '110px 1.8fr 1.2fr 90px',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div>
                  <span className="badge badge-info" style={{ fontWeight: 800 }}>{w.week}</span>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: '0.25rem' }}>{w.title}</div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {w.concepts}
                </div>

                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Source Files:</span>
                  <code className="mono" style={{ fontSize: '0.75rem', color: '#93c5fd' }}>{w.files}</code>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-optimal" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <CheckCircle size={11} />
                    <span>Done</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Database Schema (3NF) */}
      {syllabusTab === 'SCHEMA' && (
        <div className="viva-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Database size={20} color="#818cf8" />
            <h3 style={{ fontSize: '1.15rem' }}>Relational Data Models & Schema Design (3NF)</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {/* Table 1: Item */}
            <div style={{ background: 'var(--bg-surface-2)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="mono" style={{ fontWeight: 800, color: '#93c5fd', fontSize: '0.9rem' }}>TABLE: items</span>
                <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Week 2 CRUD</span>
              </div>
              <ul style={{ listStyle: 'none', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <li><code className="mono" style={{ color: '#fbbf24' }}>id (PK)</code> : BIGINT AUTO_INCREMENT</li>
                <li><code className="mono" style={{ color: '#34d399' }}>sku (UNIQUE)</code> : VARCHAR(32)</li>
                <li><code className="mono">name, category</code> : VARCHAR</li>
                <li><code className="mono">currentStock, reorderPoint</code> : INT</li>
                <li><code className="mono">unitCost</code> : DOUBLE</li>
                <li><code className="mono" style={{ color: '#818cf8' }}>version (@Version OCC)</code> : INT</li>
              </ul>
            </div>

            {/* Table 2: PurchaseOrder */}
            <div style={{ background: 'var(--bg-surface-2)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="mono" style={{ fontWeight: 800, color: '#93c5fd', fontSize: '0.9rem' }}>TABLE: purchase_orders</span>
                <span className="badge badge-draft" style={{ fontSize: '0.65rem' }}>Week 4 JPA</span>
              </div>
              <ul style={{ listStyle: 'none', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <li><code className="mono" style={{ color: '#fbbf24' }}>id (PK)</code> : BIGINT</li>
                <li><code className="mono" style={{ color: '#34d399' }}>poNumber (UNIQUE)</code> : VARCHAR(24)</li>
                <li><code className="mono">vendorName, status</code> : VARCHAR</li>
                <li><code className="mono">totalAmount, paymentStatus</code> : DOUBLE, VARCHAR</li>
                <li><code className="mono" style={{ color: '#818cf8' }}>@OneToMany items</code> : List&lt;POLineItem&gt;</li>
              </ul>
            </div>

            {/* Table 3: Users */}
            <div style={{ background: 'var(--bg-surface-2)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="mono" style={{ fontWeight: 800, color: '#93c5fd', fontSize: '0.9rem' }}>TABLE: users</span>
                <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Week 5-6 Security</span>
              </div>
              <ul style={{ listStyle: 'none', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <li><code className="mono" style={{ color: '#fbbf24' }}>id (PK)</code> : BIGINT</li>
                <li><code className="mono" style={{ color: '#34d399' }}>username (UNIQUE)</code> : VARCHAR(50)</li>
                <li><code className="mono">email (UNIQUE)</code> : VARCHAR(100)</li>
                <li><code className="mono" style={{ color: '#f43f5e' }}>password (BCrypt Hash)</code> : VARCHAR(255)</li>
                <li><code className="mono">role (ENUM)</code> : ROLE_ADMIN, ROLE_USER</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Viva Defense Q&As */}
      {syllabusTab === 'VIVA' && (
        <div className="viva-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <HelpCircle size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '1.15rem' }}>3rd-Year Viva Examination Questions & Model Answers</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {vivaQuestions.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  style={{ 
                    background: 'var(--bg-surface-2)', 
                    border: '1px solid var(--border-subtle)', 
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    type="button"
                    style={{ 
                      width: '100%', 
                      padding: '1.15rem 1.25rem', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.92rem',
                      fontWeight: 700
                    }}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <span style={{ color: isOpen ? '#818cf8' : 'var(--text-primary)' }}>{item.q}</span>
                    {isOpen ? <ChevronUp size={18} color="#818cf8" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                  </button>
                  {isOpen && (
                    <div style={{ 
                      padding: '0 1.25rem 1.25rem 1.25rem', 
                      fontSize: '0.86rem', 
                      color: 'var(--text-secondary)',
                      lineHeight: 1.65,
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '0.85rem'
                    }}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
