const API_BASE_URL = 'https://ais-dev-w2a7jxyi3yzmolfvmfwmxy-13842340585.us-east5.run.app/api/menuzap';
let currentLead = null;
let allLeads = [];
let activeTab = 'kanban';

console.log('Menuzap Pro Advanced Sidebar Loaded');

async function apiCall(endpoint, method = 'GET', body = null) {
    const tokenData = await chrome.storage.local.get(['menuzap_token']);
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({
            type: 'API_CALL',
            endpoint,
            method,
            token: tokenData.menuzap_token,
            body
        }, (response) => resolve(response));
    });
}

async function checkAuth() {
    const response = await apiCall('/auth');
    const authSection = document.getElementById('menuzap-auth-section');
    const mainContent = document.getElementById('menuzap-main-content');
    const iconBar = document.getElementById('menuzap-icon-bar');
    
    if (response && response.ok) {
        if (authSection) authSection.style.display = 'none';
        if (mainContent) mainContent.style.display = 'block';
        if (iconBar) iconBar.style.display = 'flex';
        document.getElementById('menuzap-business-name').innerText = response.data.businessName || 'Conectado';
        loadKanbanLeads();
        loadLeadInfo();
    } else {
        if (authSection) authSection.style.display = 'block';
        if (mainContent) mainContent.style.display = 'none';
        if (iconBar) iconBar.style.display = 'none';
        chrome.storage.local.remove('menuzap_token');
    }
}

async function loadKanbanLeads() {
    const response = await apiCall('/leads');
    if (response && response.ok) {
        allLeads = response.data.leads || [];
        renderKanban();
    }
}

async function loadLeadInfo() {
    const phone = window.location.pathname.split('/').pop()?.replace(/\D/g, '') || '';
    if (!phone) return;

    const response = await apiCall(`/lead-info?phone=${phone}`);
    if (response && response.ok) {
        currentLead = response.data.lead;
        updateLeadUI();
    }
}

function updateLeadUI() {
    const clientName = document.querySelector('header [title]')?.title || 'Cliente WhatsApp';
    const nameEl = document.getElementById('current-client-name');
    if (nameEl) nameEl.innerText = clientName;

    const notesEl = document.getElementById('menuzap-notes-input');
    if (notesEl && currentLead) {
        notesEl.value = currentLead.notes || '';
    }
}

function renderKanban() {
    const stages = {
        'new': { id: 'kanban-new-list', countId: 'count-new' },
        'negotiation': { id: 'kanban-neg-list', countId: 'count-neg' },
        'closed': { id: 'kanban-closed-list', countId: 'count-closed' }
    };

    Object.values(stages).forEach(s => {
        const el = document.getElementById(s.id);
        if (el) el.innerHTML = '';
    });

    const counts = { new: 0, negotiation: 0, closed: 0 };

    allLeads.forEach(lead => {
        const stageKey = lead.stage || 'new';
        const stage = stages[stageKey];
        if (stage) {
            counts[stageKey]++;
            const el = document.getElementById(stage.id);
            const card = document.createElement('div');
            card.className = 'kanban-card';
            card.innerHTML = `
                <div class="kanban-card-name">${lead.name}</div>
                <div class="kanban-card-phone">${lead.phone}</div>
            `;
            el.appendChild(card);
        }
    });

    Object.keys(counts).forEach(k => {
        const countEl = document.getElementById(stages[k].countId);
        if (countEl) countEl.innerText = counts[k];
    });
}

function switchTab(tabId) {
    activeTab = tabId;
    document.querySelectorAll('.menuzap-icon-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.menuzap-section').forEach(sec => {
        sec.classList.toggle('active', sec.id === `section-${tabId}`);
    });
    
    const titles = {
        kanban: 'Quadro Kanban',
        schedule: 'Agendamentos',
        notes: 'Bloco de Notas',
        ai: 'Assistente IA',
        settings: 'Configurações'
    };
    document.getElementById('panel-title').innerText = titles[tabId] || 'Menuzap Pro';
}

function createSidebar() {
    if (document.getElementById('menuzap-sidebar-container')) return;

    const container = document.createElement('div');
    container.id = 'menuzap-sidebar-container';
    container.innerHTML = `
        <div id="menuzap-icon-bar">
            <div class="menuzap-icon-btn active" data-tab="kanban" title="Kanban">📊</div>
            <div class="menuzap-icon-btn" data-tab="schedule" title="Agendar">📅</div>
            <div class="menuzap-icon-btn" data-tab="notes" title="Notas">📝</div>
            <div class="menuzap-icon-btn" data-tab="ai" title="IA">🤖</div>
            <div class="menuzap-icon-btn" data-tab="settings" title="Ajustes">⚙️</div>
        </div>
        <div id="menuzap-panel">
            <div class="menuzap-panel-header">
                <h2 id="panel-title">Quadro Kanban</h2>
                <button id="menuzap-close" style="background:none; border:none; cursor:pointer; font-size:18px;">&times;</button>
            </div>
            <div class="menuzap-panel-content">
                <div id="menuzap-auth-section">
                    <p class="menuzap-label">Token de Acesso</p>
                    <input type="text" id="menuzap-token-input" class="menuzap-input" placeholder="Cole seu token...">
                    <button id="menuzap-save-token" class="menuzap-btn">Conectar</button>
                    <p style="font-size:11px; color:#64748b;">Pegue seu token no painel do Menu CRM.</p>
                </div>

                <div id="menuzap-main-content" style="display:none;">
                    <!-- KANBAN -->
                    <div id="section-kanban" class="menuzap-section active">
                        <button id="btn-export-crm" class="menuzap-btn" style="background:#4F46E5;">Exportar Contato Atual</button>
                        <p id="current-client-name" style="font-size:12px; font-weight:700; margin-bottom:15px; color:#1e293b;"></p>
                        
                        <div class="kanban-column">
                            <div class="kanban-column-header"><span>Novos Leads</span> <span id="count-new" class="menuzap-badge">0</span></div>
                            <div id="kanban-new-list" class="kanban-list"></div>
                        </div>
                        <div class="kanban-column">
                            <div class="kanban-column-header"><span>Em Negociação</span> <span id="count-neg" class="menuzap-badge">0</span></div>
                            <div id="kanban-neg-list" class="kanban-list"></div>
                        </div>
                        <div class="kanban-column">
                            <div class="kanban-column-header"><span>Fechados</span> <span id="count-closed" class="menuzap-badge">0</span></div>
                            <div id="kanban-closed-list" class="kanban-list"></div>
                        </div>
                    </div>

                    <!-- SCHEDULE -->
                    <div id="section-schedule" class="menuzap-section">
                        <p class="menuzap-label">Novo Agendamento</p>
                        <input type="date" id="sched-date" class="menuzap-input">
                        <input type="time" id="sched-time" class="menuzap-input">
                        <textarea id="sched-msg" class="menuzap-input" style="height:80px;" placeholder="Mensagem do lembrete..."></textarea>
                        <button id="btn-save-sched" class="menuzap-btn" style="background:#10b981;">Salvar Agendamento</button>
                    </div>

                    <!-- NOTES -->
                    <div id="section-notes" class="menuzap-section">
                        <p class="menuzap-label">Anotações do Cliente</p>
                        <textarea id="menuzap-notes-input" class="menuzap-input" style="height:250px; resize:none;" placeholder="Escreva aqui detalhes importantes..."></textarea>
                        <button id="btn-save-notes" class="menuzap-btn">Salvar Notas</button>
                    </div>

                    <!-- AI -->
                    <div id="section-ai" class="menuzap-section">
                        <p class="menuzap-label">Assistente Gemini</p>
                        <button id="btn-ai-suggest" class="menuzap-btn" style="background:#8b5cf6;">Sugerir Resposta</button>
                        <div id="ai-suggestion-box" class="ai-suggestion-box">Clique acima para analisar as últimas mensagens e sugerir uma resposta.</div>
                    </div>

                    <!-- SETTINGS -->
                    <div id="section-settings" class="menuzap-section">
                        <p class="menuzap-label">Empresa Conectada</p>
                        <div id="menuzap-business-name" style="font-weight:700; margin-bottom:20px;">...</div>
                        <button id="btn-logout" class="menuzap-btn" style="background:#ef4444;">Desconectar Token</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // Listeners
    document.getElementById('menuzap-close').onclick = () => {
        container.style.display = 'none';
    };

    document.querySelectorAll('.menuzap-icon-btn').forEach(btn => {
        btn.onclick = () => switchTab(btn.dataset.tab);
    });

    document.getElementById('menuzap-save-token').onclick = () => {
        const token = document.getElementById('menuzap-token-input').value.trim();
        if (token) {
            chrome.storage.local.set({ menuzap_token: token }, () => checkAuth());
        }
    };

    document.getElementById('btn-export-crm').onclick = async () => {
        const name = document.querySelector('header [title]')?.title || 'Cliente WhatsApp';
        const phone = window.location.pathname.split('/').pop()?.replace(/\D/g, '') || '';
        const response = await apiCall('/lead', 'POST', { name, phone });
        if (response && response.ok) {
            alert('✅ Lead exportado com sucesso!');
            loadKanbanLeads();
        }
    };

    document.getElementById('btn-save-notes').onclick = async () => {
        const phone = window.location.pathname.split('/').pop()?.replace(/\D/g, '') || '';
        const notes = document.getElementById('menuzap-notes-input').value;
        const response = await apiCall('/lead/notes', 'POST', { phone, notes });
        if (response && response.ok) alert('✅ Notas salvas!');
    };

    document.getElementById('btn-ai-suggest').onclick = async () => {
        const messages = Array.from(document.querySelectorAll('.message-in, .message-out'))
            .slice(-5).map(m => m.innerText).join('\n');
        const box = document.getElementById('ai-suggestion-box');
        box.innerText = 'Analisando conversa...';
        const response = await apiCall('/ai/suggest', 'POST', { 
            messages, 
            businessName: document.getElementById('menuzap-business-name').innerText 
        });
        if (response && response.ok) box.innerText = response.data.suggestion;
    };

    document.getElementById('btn-logout').onclick = () => {
        chrome.storage.local.remove('menuzap_token', () => checkAuth());
    };
}

function injectToggleButton() {
    setInterval(() => {
        const header = document.querySelector('header');
        if (header && !document.getElementById('menuzap-toggle')) {
            const btn = document.createElement('button');
            btn.id = 'menuzap-toggle';
            btn.innerHTML = '⚡';
            btn.style.cssText = 'background:#F67C01; color:white; border:none; border-radius:50%; width:35px; height:35px; cursor:pointer; margin-left:10px; font-size:18px; z-index:999;';
            btn.onclick = () => {
                let c = document.getElementById('menuzap-sidebar-container');
                if (!c) {
                    createSidebar();
                    c = document.getElementById('menuzap-sidebar-container');
                }
                c.style.display = c.style.display === 'none' ? 'flex' : 'none';
                if (c.style.display === 'flex') checkAuth();
            };
            header.appendChild(btn);
        }
    }, 2000);
}

// URL Observer
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        if (document.getElementById('menuzap-sidebar-container')?.style.display === 'flex') {
            loadLeadInfo();
        }
    }
}).observe(document, {subtree: true, childList: true});

injectToggleButton();
