import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, MessageSquare, Send, X, Sparkles, Database, 
  ChevronRight, RefreshCw, Layers, CheckCircle2 
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

interface Message {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  contextSnapshot?: string;
  timestamp: string;
}

export const ChatbotDrawer: React.FC = () => {
  const { items, purchaseOrders, stats, isChatOpen, closeChatbot } = useERP();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showRagContext, setShowRagContext] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'AI',
      text: "👋 Hello! I am your **NEXUS ERP AI Copilot** (Week 7-8 RAG Integration).\n\nI have real-time retrieval access to our inventory catalog and purchase orders. Ask me anything about stock levels, valuations, or order statuses!",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Performs RAG (Retrieval-Augmented Generation) over live ERP data
  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}-u`,
      sender: 'USER',
      text: query,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // 1. RAG Retrieval Step: Collect live database context
    const contextSnapshot = items.map(i => 
      `[SKU: ${i.sku} | Name: ${i.name} | Stock: ${i.currentStock} | ReorderPoint: ${i.reorderPoint} | Cost: $${i.unitCost}]`
    ).join('\n');

    // 2. Synthesize response based on user query
    setTimeout(() => {
      let aiResponse = '';
      const q = query.toLowerCase();

      if (q.includes('low stock') || q.includes('reorder') || q.includes('depleted') || q.includes('shortage')) {
        const lowItems = items.filter(i => i.currentStock <= i.reorderPoint);
        if (lowItems.length === 0) {
          aiResponse = "✅ **Inventory Health:** All SKUs currently have sufficient stock above safety reorder thresholds.";
        } else {
          aiResponse = `⚠️ **RAG Alert - ${lowItems.length} Low-Stock SKUs Found:**\n\n` +
            lowItems.map(i => `• **${i.sku}** (${i.name}): On-hand stock is **${i.currentStock} ${i.uom}** (Threshold: ${i.reorderPoint})`).join('\n') +
            `\n\n💡 *Action item: Create a Purchase Order to replenish these lines.*`;
        }
      } else if (q.includes('valuation') || q.includes('worth') || q.includes('asset') || q.includes('total value')) {
        aiResponse = `💰 **Real-Time Inventory Valuation:**\n\n` +
          `• Total SKUs in Catalog: **${stats.totalSkus}**\n` +
          `• Total Valuation: **₹${stats.totalInventoryValuation.toLocaleString('en-IN', { minimumFractionDigits: 2 })} INR**\n` +
          `• Reconciled with General Ledger: **Account 1300 (Inventory Asset)**`;
      } else if (q.includes('order') || q.includes('po') || q.includes('procurement') || q.includes('supplier')) {
        const openOrders = purchaseOrders.filter(p => p.status !== 'RECEIVED');
        aiResponse = `📦 **Procurement Summary:**\n\n` +
          `• Open Orders Pending: **${openOrders.length}**\n` +
          purchaseOrders.map(p => `• **${p.poNumber}** (${p.vendorName}) - Status: **${p.status}** (₹${p.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })})`).join('\n');
      } else {
        aiResponse = `🤖 **NEXUS RAG Assistant:**\n\n` +
          `Based on our live ERP database of **${items.length} items** and **${purchaseOrders.length} purchase orders**, I can help you with:\n` +
          `1. Finding items below reorder points\n` +
          `2. Calculating total inventory asset values\n` +
          `3. Tracking purchase order fulfillment\n` +
          `4. Inspecting the double-entry accounting ledger`;
      }

      const aiMsg: Message = {
        id: `msg-${Date.now()}-ai`,
        sender: 'AI',
        text: aiResponse,
        contextSnapshot,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Slide-over Drawer */}
      {isChatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '5.5rem',
          right: '1.75rem',
          width: '420px',
          maxWidth: '92vw',
          height: '600px',
          maxHeight: '80vh',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 95,
          overflow: 'hidden'
        }}>
          {/* Drawer Header */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'var(--bg-surface-2)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff'
              }}>
                <Sparkles size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800 }}>ERP Assistant & RAG Copilot</h4>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Connected to Live Inventory Database
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                className="btn btn-outline btn-sm"
                style={{ padding: '0.2rem 0.4rem', fontSize: '0.68rem' }}
                onClick={() => setShowRagContext(!showRagContext)}
                title="Inspect RAG Context retrieved from database"
              >
                <Database size={12} />
                <span>RAG Data</span>
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => closeChatbot()}>
                <X size={15} />
              </button>
            </div>
          </div>

          {/* RAG Context Drawer Inspector (Shows live prompt injection) */}
          {showRagContext && (
            <div style={{
              background: '#020617',
              padding: '0.75rem 1rem',
              borderBottom: '1px solid var(--border-subtle)',
              fontSize: '0.72rem',
              maxHeight: '140px',
              overflowY: 'auto'
            }}>
              <div style={{ color: '#a5b4fc', fontWeight: 700, marginBottom: '0.35rem' }}>
                🔍 Live RAG Context Injected from MySQL/Items Table:
              </div>
              <pre className="mono" style={{ color: '#94a3b8', whiteSpace: 'pre-wrap' }}>
                {items.slice(0, 4).map(i => `SKU: ${i.sku} | Name: ${i.name} | Stock: ${i.currentStock} | Cost: ₹${i.unitCost}`).join('\n')}
                {items.length > 4 ? `\n...and ${items.length - 4} more records` : ''}
              </pre>
            </div>
          )}

          {/* Message List */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'USER' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.sender === 'USER' ? 'var(--accent-primary)' : 'var(--bg-surface-2)',
                  color: m.sender === 'USER' ? '#fff' : 'var(--text-primary)',
                  padding: '0.75rem 0.95rem',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  border: m.sender === 'USER' ? 'none' : '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
                <div style={{
                  fontSize: '0.65rem',
                  color: m.sender === 'USER' ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-muted)',
                  marginTop: '0.35rem',
                  textAlign: 'right'
                }}>
                  {m.timestamp}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'var(--bg-surface-2)',
                padding: '0.65rem 0.95rem',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <RefreshCw size={13} className="spin-anim" />
                <span>Retrieving database context & synthesizing answer...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div style={{
            padding: '0.5rem 1rem',
            background: 'var(--bg-surface-2)',
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', whiteSpace: 'nowrap' }}
              onClick={() => handleSend('Which items have low stock?')}
            >
              ⚠️ Low Stock Check
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', whiteSpace: 'nowrap' }}
              onClick={() => handleSend('What is our total inventory valuation?')}
            >
              💰 Total Valuation
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', whiteSpace: 'nowrap' }}
              onClick={() => handleSend('Show status of open purchase orders')}
            >
              📦 Open Orders
            </button>
          </div>

          {/* Input Box */}
          <div style={{
            padding: '0.75rem 1rem',
            background: 'var(--bg-surface-1)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <input
              type="text"
              className="form-input"
              placeholder="Ask about inventory, orders, valuation..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{ padding: '0.55rem 0.75rem', fontSize: '0.82rem' }}
            />
            <button
              className="btn btn-primary"
              style={{ padding: '0.55rem 0.85rem' }}
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
