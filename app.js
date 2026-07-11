// State Management
let chats = [];
let currentChatId = null;
let settings = {
  apiKey: '',
  model: 'gemini-3.5-flash',
  persona: 'general',
  autoRead: false
};
let currentTheme = 'dark';

// DOM Elements
const sidebar = document.getElementById('sidebar');
const menuToggleBtn = document.getElementById('menu-toggle-btn');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
const modalOverlay = document.getElementById('modal-overlay');
const settingsModal = document.getElementById('settings-modal');
const settingsBtn = document.getElementById('settings-btn');
const modalCloseBtn = document.getElementById('modal-close-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const themeBtn = document.getElementById('theme-btn');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');

const apiKeyInput = document.getElementById('api-key-input');
const apiKeyToggle = document.getElementById('api-key-toggle');
const modelSelect = document.getElementById('model-select');
const personaSelect = document.getElementById('persona-select');
const clearAllBtn = document.getElementById('clear-all-btn');

const chatList = document.getElementById('chat-list');
const newChatBtn = document.getElementById('new-chat-btn');
const chatTitle = document.getElementById('chat-title');
const headerModelName = document.getElementById('header-model-name');
const headerNewChatBtn = document.getElementById('header-new-chat-btn');
const headerModelBadgeBtn = document.getElementById('header-model-badge-btn');
const headerModelDropdown = document.getElementById('header-model-dropdown');
const activeSettingsSummary = document.getElementById('active-settings-summary');
const apiStatusIndicator = document.getElementById('api-status-indicator');
const apiStatusText = document.getElementById('api-status-text');
const pdfSummaryBtn = document.getElementById('pdf-summary-btn');
const chatSummaryBtn = document.getElementById('chat-summary-btn');
const reportModal = document.getElementById('report-modal');
const reportModalOverlay = document.getElementById('report-modal-overlay');
const reportModalBody = document.getElementById('report-modal-body');
const printReportBtn = document.getElementById('print-report-btn');
const reportCloseBtn = document.getElementById('report-close-btn');

const chatMessages = document.getElementById('chat-messages');
const emptyState = document.getElementById('empty-state');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const quickPromptCards = document.querySelectorAll('.prompt-card');
const micBtn = document.getElementById('mic-btn');
const autoReadCheckbox = document.getElementById('auto-read-checkbox');
const attachBtn = document.getElementById('attach-btn');
const pdfInput = document.getElementById('pdf-input');
const pdfBadgeContainer = document.getElementById('pdf-badge-container');
const pdfBadgeName = document.getElementById('pdf-badge-name');
const pdfDetachBtn = document.getElementById('pdf-detach-btn');
const dragDropOverlay = document.getElementById('drag-drop-overlay');
const searchBtn = document.getElementById('search-btn');

// 현재 임시로 첨부된 PDF 데이터 상태
let attachedPdfData = null;
let isSearchGroundingActive = false;

// Persona Prompts Definitions
const personas = {
  general: {
    name: '일반 AI 어시스턴트',
    systemInstruction: '너는 Aiden이며, 사용자의 질문에 친절하고 정중하게 대답하는 다재다능한 AI 비서(가장 스마트한 당신의 AI 메이트)이다. 모든 답변은 가독성이 높도록 단락을 나누고 핵심 내용은 강조해서 한국어로 작성해줘.',
    avatar: '<i class="fa-solid fa-robot"></i>',
    greeting: '안녕하세요! 가장 스마트한 당신의 AI 메이트, Aiden입니다. 어떤 주제든 궁금한 점이 있으시면 편하게 물어보세요.'
  },
  developer: {
    name: '숙련된 소프트웨어 엔지니어',
    systemInstruction: '너는 Aiden이며, 노련하고 숙련된 소프트웨어 엔지니어(개발 비서)이다. 코드 중심의 명확한 해결책을 제시하며, 실무 예제와 최적화 팁을 포함하되 설명은 간결하게 하라. 마크다운 코드 블록(```언어)을 적극적으로 사용하고, 한국어로 답변하라.',
    avatar: '<i class="fa-solid fa-code"></i>',
    greeting: '코드 분석, 디버깅, 시스템 설계 등 원하시는 개발 관련 작업을 입력해주세요. 바로 구현 코드를 제공해 드립니다!'
  },
  writer: {
    name: '창의적인 카피라이터',
    systemInstruction: '너는 Aiden이며, 매력적인 문장과 마케팅 문구를 창작하는 전문 카피라이터이다. 풍부하고 독창적인 어휘를 사용하고, 독자의 시선을 사로잡는 스타일로 감성적이고 정교하게 한국어로 글을 작성하라.',
    avatar: '<i class="fa-solid fa-pen-nib"></i>',
    greeting: '블로그 포스팅, 광고 카피, 소설 작성 등 어떤 창의적인 글쓰기를 원하시나요? 아이디어를 알려주세요.'
  },
  philosopher: {
    name: '깊이 있는 철학자',
    systemInstruction: '너는 Aiden이며, 깊이 있는 지혜를 제공하는 철학자이다. 질문의 단편적 대답을 넘어 기술적, 윤리적, 인문학적 관점에서 입체적이고 신중하게 사색할 수 있는 통찰력 있는 답변을 제공하라. 한국어를 사용하며 진중하고 지적인 톤앤매너를 유지하라.',
    avatar: '<i class="fa-solid fa-brain"></i>',
    greeting: '삶의 가치, 문명의 방향, AI와 인간의 미래 등 깊은 통찰을 나누고 싶은 주제에 대해 질문해 주세요.'
  }
};

// Model Display Names mapping
const modelNames = {
  'gemini-3.5-flash': 'Gemini 3.5 Flash',
  'gemini-3.1-pro': 'Gemini 3.1 Pro',
  'gemini-3.1-flash-lite': 'Gemini 3.1 Flash Lite',
  'gemini-2.5-flash': 'Gemini 2.5 Flash',
  'gemini-2.5-flash-lite': 'Gemini 2.5 Flash Lite',
  'gemini-2.5-pro': 'Gemini 2.5 Pro'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadLocalStorage();
  setupEventListeners();
  initHeaderModelDropdown(); // 헤더 모델 드롭다운 연동
  renderChatList();
  applyTheme();
  updateApiStatusUI();
  
  if (chats.length > 0) {
    // Load last active chat or the first one
    const lastChatId = localStorage.getItem('lastActiveChatId') || chats[0].id;
    const exists = chats.some(c => c.id === lastChatId);
    selectChat(exists ? lastChatId : chats[0].id);
  } else {
    showEmptyState();
  }
});

// Load Settings, Chats and Theme from localStorage
function loadLocalStorage() {
  // 마이그레이션: 이전 키 데이터가 존재하면 새 데이터 네임스페이스로 이전
  if (localStorage.getItem('kay_lab_chat_settings') && !localStorage.getItem('aiden_chat_settings')) {
    localStorage.setItem('aiden_chat_settings', localStorage.getItem('kay_lab_chat_settings'));
  }
  if (localStorage.getItem('kay_lab_chats') && !localStorage.getItem('aiden_chats')) {
    localStorage.setItem('aiden_chats', localStorage.getItem('kay_lab_chats'));
  }
  if (localStorage.getItem('kay_lab_chat_theme') && !localStorage.getItem('aiden_chat_theme')) {
    localStorage.setItem('aiden_chat_theme', localStorage.getItem('kay_lab_chat_theme'));
  }

  // Load settings
  const storedSettings = localStorage.getItem('aiden_chat_settings');
  if (storedSettings) {
    try {
      settings = JSON.parse(storedSettings);
    } catch (e) {
      console.error("Error parsing settings", e);
    }
  }
  
  // Load theme
  const storedTheme = localStorage.getItem('aiden_chat_theme');
  if (storedTheme) {
    currentTheme = storedTheme;
  }
  
  // Load chats
  const storedChats = localStorage.getItem('aiden_chats');
  if (storedChats) {
    try {
      chats = JSON.parse(storedChats);
    } catch (e) {
      console.error("Error parsing chats", e);
    }
  }

  // Populate settings modal fields with stored values
  apiKeyInput.value = settings.apiKey || '';
  modelSelect.value = settings.model || 'gemini-3.5-flash';
  personaSelect.value = settings.persona || 'general';
  autoReadCheckbox.checked = settings.autoRead || false;
}

// Save data to localStorage
function saveChatsToStorage() {
  localStorage.setItem('aiden_chats', JSON.stringify(chats));
}

function saveSettingsToStorage() {
  localStorage.setItem('aiden_chat_settings', JSON.stringify(settings));
}

// Setup Event Listeners
function setupEventListeners() {
  // Sidebar toggles
  menuToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.add('active');
  });
  
  sidebarCloseBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
  });

  // 모바일 환경: 사이드바 외부 클릭 시 닫기
  window.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
      // 클릭 대상이 사이드바 내부이거나 메뉴 토글 버튼인 경우 제외
      if (!sidebar.contains(e.target) && !menuToggleBtn.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    }
  });
  
  // Modal open/close
  settingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('active');
    modalOverlay.classList.add('active');
  });
  
  modalCloseBtn.addEventListener('click', () => {
    settingsModal.classList.remove('active');
    modalOverlay.classList.remove('active');
  });
  
  modalOverlay.addEventListener('click', () => {
    settingsModal.classList.remove('active');
    modalOverlay.classList.remove('active');
  });
  
  // API Key Visibility Toggle
  apiKeyToggle.addEventListener('click', () => {
    const isPassword = apiKeyInput.type === 'password';
    apiKeyInput.type = isPassword ? 'text' : 'password';
    apiKeyToggle.innerHTML = isPassword ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
  });
  
  // Save Settings
  saveSettingsBtn.addEventListener('click', () => {
    settings.apiKey = apiKeyInput.value.trim();
    settings.model = modelSelect.value;
    settings.persona = personaSelect.value;
    settings.autoRead = autoReadCheckbox.checked;
    saveSettingsToStorage();
    
    // Update Active Chat's metadata if there is an active chat
    if (currentChatId) {
      const activeChat = chats.find(c => c.id === currentChatId);
      if (activeChat) {
        activeChat.model = settings.model;
        activeChat.persona = settings.persona;
        saveChatsToStorage();
      }
    }
    
    updateApiStatusUI();
    
    // Close modal
    settingsModal.classList.remove('active');
    modalOverlay.classList.remove('active');
    
    // Show notification or just render
    renderChatMessages();
    renderChatList();
  });
  
  // Theme Toggle
  themeBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('aiden_chat_theme', currentTheme);
    applyTheme();
  });
  
  // Clear All Chats
  clearAllBtn.addEventListener('click', () => {
    if (confirm('정말로 모든 대화 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      chats = [];
      currentChatId = null;
      localStorage.removeItem('lastActiveChatId');
      saveChatsToStorage();
      renderChatList();
      showEmptyState();
      
      // Close modal
      settingsModal.classList.remove('active');
      modalOverlay.classList.remove('active');
    }
  });
  
  // New Chat
  newChatBtn.addEventListener('click', () => {
    startNewChat();
  });
  
  if (headerNewChatBtn) {
    headerNewChatBtn.addEventListener('click', () => {
      startNewChat();
    });
  }
  
  // Send Message
  sendBtn.addEventListener('click', () => {
    handleSendMessage();
  });
  
  // Textarea handle Enter and Shift+Enter
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });
  
  // Auto-resize textarea
  chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });
  
  // Edit Chat Title
  chatTitle.addEventListener('blur', () => {
    const newTitle = chatTitle.innerText.trim();
    if (newTitle && currentChatId) {
      const chat = chats.find(c => c.id === currentChatId);
      if (chat && chat.title !== newTitle) {
        chat.title = newTitle;
        saveChatsToStorage();
        renderChatList();
      }
    }
  });
  
  chatTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      chatTitle.blur();
    }
  });
  
  // Quick Prompt Cards
  quickPromptCards.forEach(card => {
    card.addEventListener('click', () => {
      const promptText = card.getAttribute('data-prompt');
      chatInput.value = promptText;
      chatInput.style.height = 'auto';
      chatInput.style.height = (chatInput.scrollHeight) + 'px';
      handleSendMessage();
    });
  });

  // 요약 버튼 이벤트 바인딩
  if (pdfSummaryBtn) {
    pdfSummaryBtn.addEventListener('click', () => {
      generatePDFSummary();
    });
  }
  
  if (chatSummaryBtn) {
    chatSummaryBtn.addEventListener('click', () => {
      generateChatSummary();
    });
  }
  
  // 보고서 모달 닫기
  if (reportCloseBtn && reportModal && reportModalOverlay) {
    const closeReport = () => {
      reportModal.classList.remove('active');
      reportModalOverlay.classList.remove('active');
    };
    reportCloseBtn.addEventListener('click', closeReport);
    reportModalOverlay.addEventListener('click', closeReport);
  }
  
  // 보고서 인쇄하기
  if (printReportBtn) {
    printReportBtn.addEventListener('click', () => {
      window.print();
    });
  }

  
  // Speech Recognition 초기화
  initSpeechRecognition();
  
  // PDF 업로드 관련 이벤트
  if (attachBtn && pdfInput) {
    attachBtn.addEventListener('click', () => {
      pdfInput.value = ''; // 동일 파일 재업로드 지원
      pdfInput.click();
    });
    
    pdfInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handlePdfUpload(e.target.files[0]);
      }
    });
  }
  
  if (pdfDetachBtn) {
    pdfDetachBtn.addEventListener('click', () => {
      detachPdf();
    });
  }

  // 드래그 앤 드롭 파일 업로드 이벤트 바인딩
  initDragAndDrop();

  // 구글 검색 그라운딩 활성화 토글 이벤트
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      isSearchGroundingActive = !isSearchGroundingActive;
      if (isSearchGroundingActive) {
        searchBtn.classList.add('active');
        searchBtn.title = "실시간 구글 검색 그라운딩 활성화됨";
      } else {
        searchBtn.classList.remove('active');
        searchBtn.title = "실시간 구글 검색 그라운딩 비활성화됨";
      }
    });
  }
}

// Apply Theme (Dark/Light)
function applyTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (currentTheme === 'dark') {
    themeIcon.className = 'fa-solid fa-sun';
    themeText.innerText = '라이트 모드';
  } else {
    themeIcon.className = 'fa-solid fa-moon';
    themeText.innerText = '다크 모드';
  }
}

// Update API Status Banner & Indicators
function updateApiStatusUI() {
  const modelText = modelNames[settings.model] || settings.model;
  const personaText = personas[settings.persona]?.name || settings.persona;
  
  activeSettingsSummary.innerText = `${modelText} | ${personaText}`;
  headerModelName.innerText = modelText;
  
  if (settings.apiKey) {
    apiStatusIndicator.className = 'api-status-connected';
    apiStatusText.innerText = 'API 연동 모드';
  } else {
    apiStatusIndicator.className = 'api-status-disconnected';
    apiStatusText.innerText = '시뮬레이터 모드';
  }
  
  // 헤더 모델 드롭다운 선택상태 갱신
  renderHeaderModelDropdown();
}

// Render Chat History list
function renderChatList() {
  chatList.innerHTML = '';
  
  if (chats.length === 0) {
    chatList.innerHTML = `<div class="sidebar-info-text" style="color: var(--text-muted); font-size: 0.8rem; text-align: center; padding: 20px 10px;">저장된 대화가 없습니다.</div>`;
    return;
  }
  
  chats.forEach(chat => {
    const chatItem = document.createElement('div');
    chatItem.className = `chat-item ${chat.id === currentChatId ? 'active' : ''}`;
    chatItem.setAttribute('data-id', chat.id);
    
    // Choose appropriate icon for active persona in the chat
    const personaIcon = personas[chat.persona]?.avatar || '<i class="fa-regular fa-comment"></i>';
    
    chatItem.innerHTML = `
      <div class="chat-item-left">
        ${personaIcon}
        <span class="chat-item-title">${escapeHTML(chat.title)}</span>
      </div>
      <button class="chat-item-delete" title="대화 삭제" data-id="${chat.id}">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    
    // Select chat on click
    chatItem.addEventListener('click', (e) => {
      // Don't select if user clicked delete button
      if (e.target.closest('.chat-item-delete')) return;
      selectChat(chat.id);
      
      // Close sidebar on mobile
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
      }
    });
    
    // Delete chat event listener
    const deleteBtn = chatItem.querySelector('.chat-item-delete');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteChat(chat.id);
    });
    
    chatList.appendChild(chatItem);
  });
}

// Start a New Chat
function startNewChat() {
  // 기존 재생 중인 음성 중지
  window.speechSynthesis.cancel();
  resetSpeakingButton();
  
  // 임시 첨부 파일 초기화 및 배지 가리기
  attachedPdfData = null;
  if (pdfBadgeContainer) {
    pdfBadgeContainer.style.display = 'none';
  }
  
  currentChatId = null;
  localStorage.removeItem('lastActiveChatId');
  showEmptyState();
  chatTitle.innerText = '새 채팅';
  renderChatList();
  updateSummaryButtonsVisibility();
  
  // 모바일 환경: 새 대화 시작 시 사이드바 자동 닫기
  if (window.innerWidth <= 768) {
    sidebar.classList.remove('active');
  }
  
  chatInput.focus();
}

// Select a Chat room
function selectChat(id) {
  // 기존 재생 중인 음성 중지
  window.speechSynthesis.cancel();
  resetSpeakingButton();
  
  // 임시 첨부 파일 초기화
  attachedPdfData = null;
  
  currentChatId = id;
  localStorage.setItem('lastActiveChatId', id);
  
  const chat = chats.find(c => c.id === id);
  if (chat) {
    // Temp override active settings based on the chat's metadata
    settings.model = chat.model || settings.model;
    settings.persona = chat.persona || settings.persona;
    
    // Sync Select options in Settings modal just in case
    modelSelect.value = settings.model;
    personaSelect.value = settings.persona;
    
    updateApiStatusUI();
    
    // PDF 배지 표시 동기화
    if (chat.pdfData && pdfBadgeContainer && pdfBadgeName) {
      pdfBadgeName.innerText = `${chat.pdfData.filename} (총 ${chat.pdfData.pages.length}페이지)`;
      pdfBadgeContainer.style.display = 'flex';
    } else if (pdfBadgeContainer) {
      pdfBadgeContainer.style.display = 'none';
    }
    
    chatTitle.innerText = chat.title;
    renderChatMessages();
  }
  
  renderChatList();
  updateSummaryButtonsVisibility();
}

// Delete Chat Room
function deleteChat(id) {
  const index = chats.findIndex(c => c.id === id);
  if (index !== -1) {
    chats.splice(index, 1);
    saveChatsToStorage();
    
    if (currentChatId === id) {
      if (chats.length > 0) {
        selectChat(chats[0].id);
      } else {
        startNewChat();
      }
    } else {
      renderChatList();
    }
  }
}

// Show welcome state
function showEmptyState() {
  chatMessages.innerHTML = '';
  chatMessages.appendChild(emptyState);
  emptyState.style.display = 'flex';
  chatTitle.innerText = '새 채팅';
}

// Render Messages inside active chat
function renderChatMessages() {
  const activeChat = chats.find(c => c.id === currentChatId);
  if (!activeChat) {
    showEmptyState();
    return;
  }
  
  emptyState.style.display = 'none';
  chatMessages.innerHTML = '';
  
  activeChat.messages.forEach(msg => {
    appendMessageHTML(msg.role, msg.content);
  });
  
  scrollToBottom();
  updateSummaryButtonsVisibility();
}

// Append a single message block in the DOM
function appendMessageHTML(role, content) {
  const messageRow = document.createElement('div');
  messageRow.className = `message-row ${role}`;
  
  const isUser = role === 'user';
  const senderName = isUser ? 'User' : (personas[settings.persona]?.name || 'AI');
  
  // Decide avatar
  let avatarHTML = '';
  if (isUser) {
    avatarHTML = '<i class="fa-solid fa-user"></i>';
  } else {
    avatarHTML = '<img src="kay_lab_logo_transparent.png" alt="Kay Lab Logo" style="width: 22px; height: auto;">';
  }
  
  // Format content (Markdown-like rendering)
  const renderedContent = isUser ? escapeHTML(content).replace(/\n/g, '<br>') : parseMarkdown(content);
  
  messageRow.innerHTML = `
    <div class="avatar">${avatarHTML}</div>
    <div class="message-container">
      <div class="message-sender">
        <span>${escapeHTML(senderName)}</span>
        ${!isUser ? `<button class="speak-msg-btn" title="음성으로 듣기"><i class="fa-solid fa-volume-high"></i></button>` : ''}
      </div>
      <div class="message-bubble">${renderedContent}</div>
    </div>
  `;
  
  chatMessages.appendChild(messageRow);
  
  // Setup copy buttons in this new message if AI response
  if (!isUser) {
    setupCopyCodeButtons(messageRow);
    setupSpeakButtons(messageRow, content);
  }
}

// Set up copy buttons for code blocks
function setupCopyCodeButtons(container) {
  const copyButtons = container.querySelectorAll('.copy-code-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const codeElement = btn.closest('.code-container').querySelector('code');
      const textToCopy = codeElement.textContent;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> 복사 완료!';
        btn.style.color = '#10b981';
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.color = '';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  });
}

// Scroll chat log to bottom
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send Message Handler
async function handleSendMessage() {
  const content = chatInput.value.trim();
  if (!content) return;
  
  // Reset textarea height
  chatInput.value = '';
  chatInput.style.height = 'auto';
  
  // 1. Create chat room if it's a new chat
  if (!currentChatId) {
    const newId = 'chat_' + Date.now();
    const truncatedTitle = content.length > 15 ? content.substring(0, 15) + '...' : content;
    
    const newChat = {
      id: newId,
      title: truncatedTitle,
      model: settings.model,
      persona: settings.persona,
      messages: []
    };
    
    chats.unshift(newChat);
    currentChatId = newId;
    localStorage.setItem('lastActiveChatId', newId);
    
    chatTitle.innerText = truncatedTitle;
    emptyState.style.display = 'none';
    chatMessages.innerHTML = '';
  }
  
  // Get active chat structure
  const activeChat = chats.find(c => c.id === currentChatId);
  if (!activeChat) return;

  // 임시 첨부된 PDF가 있다면 대화방 데이터에 저장
  if (attachedPdfData) {
    activeChat.pdfData = attachedPdfData;
    attachedPdfData = null;
  }
  
  // 2. Append User Message
  const userMsg = {
    role: 'user',
    content: content,
    timestamp: Date.now()
  };
  activeChat.messages.push(userMsg);
  saveChatsToStorage();
  updateSummaryButtonsVisibility();
  
  appendMessageHTML('user', content);
  scrollToBottom();
  
  // 3. Show Loading Indicator
  const typingIndicator = showTypingIndicator();
  scrollToBottom();
  
  // 4. 스트리밍 방식으로 답변 생성 및 출력
  try {
    if (settings.apiKey) {
      // 실시간 SSE 스트리밍 호출
      await handleRealtimeStreaming(activeChat, typingIndicator);
    } else {
      // 로컬 시뮬레이터 호출 (더 빠른 가상 스트리밍)
      await handleSimulatedStreaming(content, activeChat, typingIndicator);
    }
  } catch (error) {
    console.error("Error generating content", error);
    hideTypingIndicator(typingIndicator);
    
    const errorText = `🚨 **에러 발생**: 응답을 가져오는 중 문제가 발생했습니다.\n\n상세 정보: \`${error.message || '네트워크 오류'}\`\n\n설정에서 **API Key**가 올바르게 입력되었는지 확인해 주시거나 잠시 후 다시 시도해 주세요.`;
    const errorMsg = {
      role: 'model',
      content: errorText,
      timestamp: Date.now()
    };
    activeChat.messages.push(errorMsg);
    saveChatsToStorage();
    appendMessageHTML('model', errorText);
    scrollToBottom();
  }
}

// Show Typing Loading Dots
function showTypingIndicator() {
  const typingRow = document.createElement('div');
  typingRow.className = 'message-row ai temp-typing';
  
  typingRow.innerHTML = `
    <div class="avatar"><img src="kay_lab_logo_transparent.png" alt="Kay Lab Logo" style="width: 22px; height: auto;"></div>
    <div class="message-container">
      <div class="message-sender">${personas[settings.persona]?.name || 'AI'}</div>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  chatMessages.appendChild(typingRow);
  return typingRow;
}

// Hide Typing Loading Dots
function hideTypingIndicator(indicatorElement) {
  if (indicatorElement) {
    indicatorElement.remove();
  }
}

// Google Gemini API 실시간 SSE 스트리밍 호출 및 화면 출력
async function handleRealtimeStreaming(activeChat, typingIndicator) {
  const apiContents = activeChat.messages.map(msg => {
    return {
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    };
  });
  
  const modelEndpoint = settings.model;
  // streamGenerateContent 엔드포인트 및 alt=sse 쿼리 사용
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelEndpoint}:streamGenerateContent?alt=sse&key=${settings.apiKey}`;
  
  let systemInstructionText = personas[settings.persona]?.systemInstruction || '';
  
  // PDF 문서 내용 및 엄격한 Grounding 지시사항 주입
  if (activeChat.pdfData) {
    const pdf = activeChat.pdfData;
    const documentContent = pdf.pages.map(p => `--- ${p.pageNum}페이지 ---\n${p.text}`).join('\n\n');
    
    systemInstructionText = `당신은 제공된 PDF 문서의 정보만을 근거로 질문에 대답하는 엄격한 Q&A 어시스턴트입니다.
답변할 때 반드시 아래의 지침을 절대적으로 따라주세요:
1. 오직 아래에 제공된 [PDF 문서 내용]에 명시된 사실만을 기반으로 답변을 구성하십시오.
2. 당신의 배경지식, 외부 정보, 추측, 유추는 일절 사용하지 마십시오.
3. 답변을 할 때는 연관된 사실 근처에 반드시 해당 정보가 위치한 페이지 출처를 명확히 표기하십시오. 예: (출처: X페이지) 또는 [X페이지]
4. 제공된 [PDF 문서 내용]에서 답변을 도출할 수 없는 질문인 경우, 다른 답변을 꾸며내지 말고 정중하게 "제공된 문서(PDF)에 관련 정보가 나와있지 않습니다."라고만 말하십시오.

[PDF 파일명: ${pdf.filename}]

[PDF 문서 내용]
${documentContent}

---------------------
기본 페르소나 스타일 지침:
${systemInstructionText}`;
  }
  
  const requestBody = {
    contents: apiContents
  };
  
  if (isSearchGroundingActive) {
    requestBody.tools = [
      {
        googleSearch: {}
      }
    ];
  }
  
  if (systemInstructionText) {
    requestBody.systemInstruction = {
      parts: [{ text: systemInstructionText }]
    };
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errMsg = errorData.error?.message || `HTTP ${response.status}`;
    
    // Quota Exceeded (할당량 초과) 오류 친화적으로 재가공
    if (errMsg.includes("quota") || errMsg.includes("Quota") || response.status === 429) {
      errMsg = `Google API 할당량(Quota) 초과 및 이용 제한 오류가 발생했습니다.
      
상세 원인: 현재 사용 중이신 **Google AI Studio 무료 API Key**는 분당 요청 제한(무료 플랜 1분당 최대 15회 등) 또는 일일 사용량이 모두 소진되었을 가능성이 큽니다.

💡 **중요 안내**: 
만약 **무료 등급(Free Tier) API Key**를 사용하시는 경우, 구글 실시간 검색 연동 기능(돋보기 버튼)은 **Gemini 2.5 Flash** 및 **Gemini 2.5 Flash Lite** 모델에서만 지원됩니다. 타 모델(예: Gemini 3.5 Flash, Gemini 3.1 Pro 등)에서 실시간 검색 기능을 켠 채 질문하면 할당량 초과나 권한 오류가 발생하게 됩니다.

해결 방법:
1. 채팅창 왼쪽 아래의 돋보기[실시간 검색] 버튼을 클릭하여 **비활성화(회색 상태)**한 후 질문을 다시 보내주세요.
2. 실시간 검색 기능을 꼭 이용하셔야 한다면, 설정이나 헤더에서 모델을 **Gemini 2.5 Flash** 또는 **Gemini 2.5 Flash Lite**로 변경한 뒤 시도해 주세요.
3. 약 1분에서 수분 대기 후 API 요청 속도 제한(Rate Limit)이 풀리면 다시 질문을 전송해 주세요.`;
    }
    throw new Error(errMsg);
  }
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let fullText = "";
  let isFirstChunk = true;
  
  let messageRow = null;
  let bubble = null;
  const senderName = personas[settings.persona]?.name || 'AI';
  
  // 스트림 청크 수신 루프
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop(); // 미완성 행 저장
    
    for (const line of lines) {
      const cleanLine = line.trim();
      if (cleanLine.startsWith("data: ")) {
        const jsonStr = cleanLine.substring(6);
        try {
          const chunkData = JSON.parse(jsonStr);
          const textChunk = chunkData.candidates?.[0]?.content?.parts?.[0]?.text || "";
          
          if (textChunk) {
            fullText += textChunk;
            
            // 첫 번째 텍스트 청크 수신 시 말풍선 및 아바타 초기화 후 로딩 점 가리기
            if (isFirstChunk) {
              isFirstChunk = false;
              hideTypingIndicator(typingIndicator);
              
              messageRow = document.createElement('div');
              messageRow.className = 'message-row ai';
              messageRow.innerHTML = `
                <div class="avatar"><img src="kay_lab_logo_transparent.png" alt="Kay Lab Logo" style="width: 22px; height: auto;"></div>
                <div class="message-container">
                  <div class="message-sender">
                    <span>${escapeHTML(senderName)}</span>
                    <button class="speak-msg-btn" title="음성으로 듣기"><i class="fa-solid fa-volume-high"></i></button>
                  </div>
                  <div class="message-bubble"></div>
                </div>
              `;
              chatMessages.appendChild(messageRow);
              bubble = messageRow.querySelector('.message-bubble');
            }
            
            // 실시간 텍스트 출력
            bubble.innerHTML = parseMarkdown(fullText);
            setupCopyCodeButtons(messageRow);
            scrollToBottom();
          }
        } catch (e) {
          console.error("Error parsing stream chunk", e);
        }
      }
    }
  }
  
  if (isFirstChunk) {
    hideTypingIndicator(typingIndicator);
    throw new Error("API로부터 응답 데이터를 받지 못했습니다.");
  }
  
  // 대화 기록에 저장
  const aiMsg = {
    role: 'model',
    content: fullText,
    timestamp: Date.now()
  };
  activeChat.messages.push(aiMsg);
  saveChatsToStorage();
  renderChatList();
  
  // 최종 스피커 이벤트 바인딩
  setupSpeakButtons(messageRow, fullText);
  
  // 자동 재생 활성화 시 음성 낭독
  if (settings.autoRead) {
    const speakBtn = messageRow.querySelector('.speak-msg-btn');
    speakText(fullText, speakBtn);
  }
}

// 모의 스트리밍 응답 래퍼 함수 (시뮬레이터용)
async function handleSimulatedStreaming(userInput, activeChat, typingIndicator) {
  const responseText = await getSimulatedResponse(userInput);
  hideTypingIndicator(typingIndicator);
  await streamAIMessage(responseText, activeChat);
}

// Stream AI response letter by letter (모의 스트리밍 또는 에러 출력용)
function streamAIMessage(fullText, activeChat) {
  return new Promise((resolve) => {
    // Append blank bubble row
    const messageRow = document.createElement('div');
    messageRow.className = 'message-row ai';
    
    const senderName = personas[settings.persona]?.name || 'AI';
    
    messageRow.innerHTML = `
      <div class="avatar"><img src="kay_lab_logo_transparent.png" alt="Kay Lab Logo" style="width: 22px; height: auto;"></div>
      <div class="message-container">
        <div class="message-sender">
          <span>${escapeHTML(senderName)}</span>
          <button class="speak-msg-btn" title="음성으로 듣기"><i class="fa-solid fa-volume-high"></i></button>
        </div>
        <div class="message-bubble"></div>
      </div>
    `;
    chatMessages.appendChild(messageRow);
    
    const bubble = messageRow.querySelector('.message-bubble');
    
    let currentIdx = 0;
    const intervalTime = 6; // 모의 타이핑 반응 속도 6ms로 대폭 단축
    
    // 긴 대화의 경우 속도를 유지하기 위해 출력 글자 수 청크 조절
    const chunkSize = fullText.length > 300 ? 8 : 4;
    
    function type() {
      if (currentIdx < fullText.length) {
        const nextChunk = fullText.substring(currentIdx, currentIdx + chunkSize);
        currentIdx += chunkSize;
        
        // Update temporary bubble contents
        const partialText = fullText.substring(0, currentIdx);
        bubble.innerHTML = parseMarkdown(partialText);
        
        setupCopyCodeButtons(messageRow);
        scrollToBottom();
        
        setTimeout(type, intervalTime);
      } else {
        // Typing finished. Finalize message state
        const aiMsg = {
          role: 'model',
          content: fullText,
          timestamp: Date.now()
        };
        activeChat.messages.push(aiMsg);
        saveChatsToStorage();
        renderChatList(); // Refresh sidebar info
        
        // 스피커 버튼 이벤트 연결
        setupSpeakButtons(messageRow, fullText);
        
        // 자동 읽기가 켜져있을 경우 자동 음성 출력
        if (settings.autoRead) {
          const speakBtn = messageRow.querySelector('.speak-msg-btn');
          speakText(fullText, speakBtn);
        }
        
        resolve();
      }
    }
    
    type();
  });
}

// Generate smart mock responses based on inputs and selected persona
function getSimulatedResponse(userInput) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const personaKey = settings.persona;
      const modelName = modelNames[settings.model] || settings.model;
      const cleanInput = userInput.toLowerCase();
      
      let answer = '';
      
      // PDF 데이터가 첨부된 방이라면 로컬 키워드 매칭 시뮬레이터 구동
      const activeChat = chats.find(c => c.id === currentChatId);
      if (activeChat && activeChat.pdfData) {
        const pdf = activeChat.pdfData;
        const keywords = cleanInput.split(/\s+/).filter(k => k.length > 1);
        
        let bestPageNum = -1;
        let highestScore = 0;
        let matchSnippet = '';
        
        pdf.pages.forEach(page => {
          let score = 0;
          const pageTextLower = page.text.toLowerCase();
          
          keywords.forEach(keyword => {
            if (pageTextLower.includes(keyword)) {
              score += 10;
              const occurrences = pageTextLower.split(keyword).length - 1;
              score += occurrences;
            }
          });
          
          if (score > highestScore) {
            highestScore = score;
            bestPageNum = page.pageNum;
            
            // 본문 주변 맥락 발췌
            const firstKeyword = keywords.find(k => pageTextLower.includes(k)) || '';
            const idx = firstKeyword ? pageTextLower.indexOf(firstKeyword) : -1;
            if (idx !== -1) {
              const start = Math.max(0, idx - 80);
              const end = Math.min(page.text.length, idx + 120);
              matchSnippet = page.text.substring(start, end).trim();
              if (start > 0) matchSnippet = '...' + matchSnippet;
              if (end < page.text.length) matchSnippet = matchSnippet + '...';
            } else {
              matchSnippet = page.text.substring(0, 180).trim() + '...';
            }
          }
        });
        
        if (bestPageNum !== -1) {
          answer = `📋 **제공된 문서(${pdf.filename})의 ${bestPageNum}페이지 내용을 바탕으로 답변드립니다.**

... "${matchSnippet}" ...

위 문서 정보에 근거해 질문하신 "${userInput}" 관련 사실을 전해 드립니다.

(출처: ${bestPageNum}페이지)

---
*참고: 시뮬레이션 모드에서는 간단한 텍스트 키워드 스코어링 방식으로 연관 페이지를 발췌하여 보여줍니다. 실제 문서의 복잡한 맥락 및 깊이 있는 연관성 분석 답변을 원하시면 우측 하단 **설정** 메뉴에서 **Gemini API Key**를 등록하여 사용하세요.*`;
        } else {
          answer = `제공된 문서(${pdf.filename})에서 질문하신 "${userInput}"과 관련된 핵심 정보를 찾을 수 없습니다.

(출처: 문서에 정보 없음)

---
*참고: 시뮬레이션 모드에서는 단어 일치 방식의 한계가 있을 수 있습니다. 실제 답변을 원하시면 설정에서 **Gemini API Key**를 입력하여 대화해 주세요.*`;
        }
        resolve(answer);
        return;
      }
      
      // Greetings
      if (cleanInput.includes('안녕') || cleanInput.includes('반갑') || cleanInput.includes('hello') || cleanInput.includes('hi')) {
        answer = `${personas[personaKey].greeting}\n\n현재 가동 중인 모델은 **${modelName}** 시뮬레이터입니다. 실습 및 테스트를 위해 실제 대화를 나누시려면 우측 하단의 **설정(톱니바퀴) 아이콘**을 클릭하고, **Google Gemini API Key**를 등록하여 사용하세요.`;
      } 
      // Coding questions
      else if (cleanInput.includes('코드') || cleanInput.includes('프로그래밍') || cleanInput.includes('closure') || cleanInput.includes('클로저') || cleanInput.includes('코딩')) {
        if (personaKey === 'developer') {
          answer = `### 💻 클로저(Closure) 핵심 요약 및 예제

JavaScript에서 **클로저(Closure)**는 함수와 그 함수가 선언된 **렉시컬 환경(Lexical Environment)**과의 조합입니다. 내부 함수가 외부 함수의 스코프(변수)에 접근할 수 있게 해주는 기능이죠.

#### 실무 카운터 예제 코드
\`\`\`javascript
function createCounter() {
  let count = 0; // 프라이빗 변수
  
  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getValue() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getValue());   // 2
// count 변수는 외부에서 직접 수정할 수 없으므로 안전하게 캡슐화됩니다.
\`\`\`

#### 주요 용도
1. **데이터 캡슐화(Private 변수 구현)**: 외부로부터 변수를 보호합니다.
2. **상태 유지**: 함수 호출 간에 상태를 격리하고 저장합니다.

*이 응답은 **${modelName}** 개발자 페르소나 시뮬레이션입니다.*`;
        } else {
          answer = `요청하신 개발 관련 내용을 답변해 드립니다.

JavaScript의 **클로저(Closure)**는 외부 함수의 실행이 끝났음에도 내부 함수가 외부 함수의 지역 변수에 접근할 수 있는 메커니즘입니다.

\`\`\`javascript
function outer() {
  const name = "Aiden";
  return function inner() {
    console.log(name); // 외부 함수의 변수에 접근
  };
}
const myFunc = outer();
myFunc(); // "Aiden" 출력
\`\`\`

코드 구현 능력이 한층 강화된 **${modelName}** 모델의 진가를 보시려면 설정 메뉴에서 실제 API Key를 저장한 후 다시 질문해 보세요!`;
      }
    } 
    // Project / Ideas
    else if (cleanInput.includes('아이디어') || cleanInput.includes('프로젝트') || cleanInput.includes('추천')) {
      answer = `💡 **Aiden이 추천하는 유니크한 웹 사이드 프로젝트 아이디어 3선**

1. **AI 기반 가상 냉장고 및 레시피 메이커**
   - 냉장고에 남은 재료를 촬영하거나 텍스트로 입력하면 AI가 맞춤형 쉐프 레시피를 제안하고 장보기 리스트를 자동 작성합니다.
   
2. **집중 유도 3D 노이즈 테라피 보드**
   - 심플한 슬라이더와 화려한 Canvas 입자 그래픽을 보며 비소리, 바람소리, 모닥불 소리를 시각적 피드백과 함께 입체적으로 커스텀 믹싱할 수 있는 생산성 앱입니다.
   
3. **가상 주식 투자 & 뉴스 감성 분석 시뮬레이터**
   - 실시간 가상 주가 흐름 데이터를 바탕으로, AI 모델들이 해당 기업에 대한 뉴스 기사의 긍부정 점수를 실시간 차트로 매핑하여 투자의사결정을 돕는 금융 학습 대시보드입니다.

---
*이 아이디어들은 **${modelName}** (${personas[personaKey].name}) 시뮬레이션을 통해 생성되었습니다.*`;
    } 
      // Default Fallback
      else {
        let personaDescription = '';
        if (personaKey === 'general') {
          personaDescription = `친절하고 올바른 정보를 주는 일반 어시스턴트 모드로 답변해 드립니다.`;
        } else if (personaKey === 'developer') {
          personaDescription = `코드의 효율성과 논리적 명확함을 추구하는 개발자 모드로 답변해 드립니다.`;
        } else if (personaKey === 'writer') {
          personaDescription = `아름다운 비유와 문장 구조를 중시하는 카피라이터 모드로 답변해 드립니다.`;
        } else if (personaKey === 'philosopher') {
          personaDescription = `근원적인 가치와 다각적 인문학 관점을 사색하는 철학자 모드로 답변해 드립니다.`;
        }

        answer = `### ℹ️ 시뮬레이터 모드 응답 안내

보내주신 질문: **"${userInput}"**

현재 **Google Gemini API Key가 설정되지 않아 가상 시뮬레이션 모드**로 작동 중입니다.
- **선택된 모델**: \`${modelName}\` (API 매핑 식별자: \`${settings.model}\`)
- **선택된 페르소나**: \`${personas[personaKey].name}\`

#### 🤖 페르소나 설정 요약
> *"${personaDescription}"*

#### 💡 실제 대화 연결 방법
실제 AI 모델을 통해 실시간으로 질문을 처리하고 정교한 답변을 받으시려면:
1. 화면 하단 왼쪽의 **설정(톱니바퀴) 아이콘**을 클릭합니다.
2. [Google AI Studio](https://aistudio.google.com/)에서 발급받은 무료 API Key를 복사하여 **Gemini API Key** 필드에 입력합니다.
3. **설정 저장**을 누르면 'API 연동 모드'로 즉시 전환되며, 실제 Google Gemini API 서버와 실시간 통신하여 원하시는 모든 질문에 대한 상세한 답변을 얻으실 수 있습니다!`;
      }
      
      if (isSearchGroundingActive) {
        answer = `🔍 **Google Search 실시간 검색결과 활용** (검색어: "${userInput}")
- 최신 정보 검색결과: \`실시간 데이터 기반 피드백\` 및 \`관련 지식 정보 참조함\`

---

` + answer;
      }
      
      resolve(answer);
    }, 400); // Simulated delay (응답 시작 반응속도 향상)
  });
}

// Light Weight Markdown Parser Helper
function parseMarkdown(text) {
  if (!text) return "";
  
  // 1. 코드 블록을 추출하여 플레이스홀더로 대체 (마크다운 규칙 오버랩 방지)
  let codeBlocks = [];
  let textWithPlaceholders = text;
  const codeBlockRegex = /```(\w*)\r?\n([\s\S]*?)```/g;
  
  textWithPlaceholders = textWithPlaceholders.replace(codeBlockRegex, (match, lang, code) => {
    const id = codeBlocks.length;
    const displayLang = lang ? lang.toUpperCase() : 'CODE';
    codeBlocks.push(`
      <div class="code-container">
        <div class="code-header-block">
          <span>${displayLang}</span>
          <button class="copy-code-btn"><i class="fa-regular fa-copy"></i> 코드 복사</button>
        </div>
        <pre><code class="language-${lang}">${code.trim()}</code></pre>
      </div>
    `);
    return `__CODE_BLOCK_PLACEHOLDER_${id}__`;
  });
  
  // 보안을 위한 HTML 이스케이프 (플레이스홀더화된 본문만 이스케이프)
  let html = escapeHTML(textWithPlaceholders);
  
  // 2. 행 단위 스캔을 통한 계층적 중첩 리스트 및 인용구 처리
  const lines = html.split('\n');
  let processedLines = [];
  let listStack = []; // 중첩 리스트의 타입과 들여쓰기를 추적: { type: 'ul'|'ol', indent: number }
  
  for (let line of lines) {
    const trimmed = line.trim();
    
    // 코드 블록 플레이스홀더가 있는 행은 리스트 처리를 건너뛰고 스택 비우기
    if (trimmed.startsWith('__CODE_BLOCK_PLACEHOLDER_') && trimmed.endsWith('__')) {
      while (listStack.length > 0) {
        processedLines.push(`</${listStack.pop().type}>`);
      }
      processedLines.push(line);
      continue;
    }
    
    // 불릿 리스트 및 순서 있는 리스트 패턴 매칭
    const bulletMatch = line.match(/^(\s*)([-*+])\s+(.*)$/);
    const orderMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
    
    if (bulletMatch || orderMatch) {
      const indent = (bulletMatch ? bulletMatch[1] : orderMatch[1]).length;
      const listType = bulletMatch ? 'ul' : 'ol';
      const content = bulletMatch ? bulletMatch[3] : orderMatch[3];
      
      // 스택이 비었거나 들여쓰기가 깊어진 경우 -> 새로운 리스트 시작
      if (listStack.length === 0 || indent > listStack[listStack.length - 1].indent) {
        processedLines.push(`<${listType}>`);
        listStack.push({ type: listType, indent: indent });
      } 
      // 들여쓰기가 얕아진 경우 -> 현재 깊이보다 깊은 리스트들은 모두 닫음
      else if (indent < listStack[listStack.length - 1].indent) {
        while (listStack.length > 0 && listStack[listStack.length - 1].indent > indent) {
          processedLines.push(`</${listStack.pop().type}>`);
        }
        // 타입이 다를 경우(예: ul이었으나 ol로 바뀜) 이전 것을 닫고 새로 열기
        if (listStack.length === 0 || listStack[listStack.length - 1].type !== listType) {
          if (listStack.length > 0) {
            processedLines.push(`</${listStack.pop().type}>`);
          }
          processedLines.push(`<${listType}>`);
          listStack.push({ type: listType, indent: indent });
        }
      }
      // 동일한 레벨인데 목록 기호 타입이 바뀐 경우
      else if (listStack[listStack.length - 1].type !== listType) {
        processedLines.push(`</${listStack.pop().type}>`);
        processedLines.push(`<${listType}>`);
        listStack[listStack.length - 1].type = listType;
      }
      
      processedLines.push(`<li>${content}</li>`);
    } else {
      // 리스트가 아닌 일반 문장인 경우 리스트 스택을 모두 닫음
      while (listStack.length > 0) {
        processedLines.push(`</${listStack.pop().type}>`);
      }
      
      // 인용구(blockquote) 처리
      const bqMatch = line.match(/^(&gt;)+\s*(.*)$/);
      if (bqMatch) {
        const depth = line.match(/&gt;/g).length;
        let prefix = '<blockquote>'.repeat(depth);
        let suffix = '</blockquote>'.repeat(depth);
        processedLines.push(`${prefix}${bqMatch[2]}${suffix}`);
      } else {
        processedLines.push(line);
      }
    }
  }
  
  // 루프 종료 후 남아있는 모든 리스트 스택을 닫음
  while (listStack.length > 0) {
    processedLines.push(`</${listStack.pop().type}>`);
  }
  
  html = processedLines.join('\n');
  
  // 3. 제목 헤더 기호 파싱 (###### ~ #)
  html = html.replace(/^###### (.*?)$/gm, '<h6>$1</h6>');
  html = html.replace(/^##### (.*?)$/gm, '<h5>$1</h5>');
  html = html.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  
  // 4. 인라인 텍스트 스타일 변환
  // 인라인 코드 `code`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // 볼드 **bold**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // 이탤릭 *italic*
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // 5. 일반 문장 행 개행 태그(<br>) 주입 (HTML 블록 태그는 개행에서 제외)
  html = html.split('\n').map(line => {
    const trimmed = line.trim();
    if (trimmed === '') return '<div class="line-gap"></div>';
    
    const isHtmlBlock = /^(<h|<ul|<ol|<li|<pre|<\/pre|<div|<\/div|<block)/i.test(trimmed);
    return isHtmlBlock ? line : line + '<br>';
  }).join('\n');
  
  html = html.replace(/<br>\s*<br>/g, '<br>');
  
  // 6. 플레이스홀더를 실제 코드 블록 구조로 복원
  codeBlocks.forEach((codeBlock, id) => {
    html = html.replace(`__CODE_BLOCK_PLACEHOLDER_${id}__`, codeBlock);
  });
  
  return html;
}

// Escape HTML utility to prevent XSS
function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Export Chat content to File (Markdown / JSON selection)
function exportCurrentChat() {
  const activeChat = chats.find(c => c.id === currentChatId);
  if (!activeChat || activeChat.messages.length === 0) {
    alert("내보낼 대화 내용이 없습니다.");
    return;
  }
  
  const format = prompt("내보낼 형식을 입력하세요 (markdown 또는 json):", "markdown");
  if (!format) return;
  
  let blobContent = '';
  let filename = '';
  let mimeType = '';
  
  const titleSlug = activeChat.title.replace(/[^a-zA-Z0-9가-힣]/g, '_');
  
  if (format.toLowerCase() === 'json') {
    blobContent = JSON.stringify(activeChat, null, 2);
    filename = `kay_lab_chat_${titleSlug}.json`;
    mimeType = 'application/json';
  } else {
    // Default to markdown
    let md = `# ${activeChat.title}\n\n`;
    md += `- **AI 모델**: ${modelNames[activeChat.model] || activeChat.model}\n`;
    md += `- **페르소나**: ${personas[activeChat.persona]?.name || activeChat.persona}\n`;
    md += `- **대화 일시**: ${new Date(activeChat.messages[0].timestamp).toLocaleString('ko-KR')}\n\n`;
    md += `---\n\n`;
    
    activeChat.messages.forEach(msg => {
      const roleName = msg.role === 'user' ? '사용자(User)' : `AI 어시스턴트(${personas[activeChat.persona]?.name || 'AI'})`;
      md += `### 👤 ${roleName}\n\n${msg.content}\n\n`;
    });
    
    blobContent = md;
    filename = `kay_lab_chat_${titleSlug}.md`;
    mimeType = 'text/markdown';
  }
  
  const blob = new Blob([blobContent], { type: mimeType + ';charset=utf-8;' });
  
  // Download action
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

// ==========================================
// 음성 인식 (STT) 및 음성 출력 (TTS) 기능 구현
// ==========================================

// Speech Recognition (STT) 변수
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

// Speech Synthesis (TTS) 변수
let speakingButton = null;

// Speech Recognition 초기화
function initSpeechRecognition() {
  if (!SpeechRecognition) {
    // 브라우저가 음성 인식을 지원하지 않는 경우 마이크 버튼 숨김
    if (micBtn) {
      micBtn.style.display = 'none';
    }
    console.warn('이 브라우저는 웹 음성 인식(SpeechRecognition)을 지원하지 않습니다.');
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = false; // 한 마디하고 멈춤
  recognition.interimResults = false; // 중간 결과 제외
  recognition.lang = 'ko-KR'; // 한국어 설정

  recognition.onstart = () => {
    isListening = true;
    micBtn.classList.add('listening');
    micBtn.title = '음성 인식 중... (클릭해서 중지)';
    micBtn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i>';
  };

  recognition.onend = () => {
    isListening = false;
    micBtn.classList.remove('listening');
    micBtn.title = '음성 인식 시작';
    micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    isListening = false;
    micBtn.classList.remove('listening');
    micBtn.title = '음성 인식 시작';
    micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
    if (event.error === 'not-allowed') {
      alert('마이크 사용 권한이 거부되었습니다. 브라우저 설정에서 마이크 권한을 허용해 주세요.');
    }
  };

  recognition.onresult = (event) => {
    const resultText = event.results[0][0].transcript;
    if (resultText && chatInput) {
      const currentText = chatInput.value;
      const spacing = currentText ? ' ' : '';
      chatInput.value = currentText + spacing + resultText;
      chatInput.focus();
      
      // 높이 조절
      chatInput.style.height = 'auto';
      chatInput.style.height = (chatInput.scrollHeight) + 'px';
    }
  };

  if (micBtn) {
    micBtn.addEventListener('click', () => {
      if (isListening) {
        recognition.stop();
      } else {
        // 음성 인식 시작 전, 재생 중인 TTS가 있다면 정지하여 울림 현상 방지
        window.speechSynthesis.cancel();
        resetSpeakingButton();
        
        recognition.start();
      }
    });
  }
}

// 스피커 버튼 이벤트 연결 헬퍼
function setupSpeakButtons(container, rawContent) {
  const speakBtn = container.querySelector('.speak-msg-btn');
  if (speakBtn) {
    speakBtn.addEventListener('click', () => {
      speakText(rawContent, speakBtn);
    });
  }
}

// 음성 텍스트 변환 출력 (TTS) 실행
function speakText(text, buttonElement) {
  // 이미 동일한 메시지가 재생 중인데 버튼을 다시 누르면 재생 정지
  if (window.speechSynthesis.speaking && speakingButton === buttonElement) {
    window.speechSynthesis.cancel();
    resetSpeakingButton();
    return;
  }
  
  // 기존 재생되던 음성이 있다면 즉시 정지
  window.speechSynthesis.cancel();
  resetSpeakingButton();
  
  if (!text) return;
  
  const cleanText = cleanTextForSpeech(text);
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'ko-KR';
  utterance.rate = 1.05; // 자연스러운 속도 조절
  
  utterance.onstart = () => {
    if (buttonElement) {
      speakingButton = buttonElement;
      buttonElement.classList.add('speaking');
      buttonElement.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      buttonElement.title = '음성 읽기 중지';
    }
  };
  
  utterance.onend = () => {
    resetSpeakingButton();
  };
  
  utterance.onerror = (event) => {
    console.error('Speech synthesis error', event);
    resetSpeakingButton();
  };
  
  window.speechSynthesis.speak(utterance);
}

// 재생 중인 스피커 버튼 상태 리셋
function resetSpeakingButton() {
  if (speakingButton) {
    speakingButton.classList.remove('speaking');
    speakingButton.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    speakingButton.title = '음성으로 듣기';
    speakingButton = null;
  }
}

// TTS 출력을 위해 마크다운과 코드 영역 정제
function cleanTextForSpeech(text) {
  if (!text) return '';
  
  let clean = text;
  
  // 1. 코드 블록(```...```) 전체 삭제 (읽기에 부적절하므로 한국어 설명으로 대체)
  clean = clean.replace(/```[\s\S]*?```/g, '[상세 코드는 음성 출력에서 제외되었습니다.]');
  
  // 2. 마크다운 기호 제거 (샵, 스타, 백틱, 대시 등)
  clean = clean.replace(/#{1,6}\s+/g, ''); // 제목 기호 제거
  clean = clean.replace(/\*\*([^*]+)\*\*/g, '$1'); // 볼드
  clean = clean.replace(/\*([^*]+)\*/g, '$1'); // 이탤릭
  clean = clean.replace(/`([^`]+)`/g, '$1'); // 인라인 코드
  clean = clean.replace(/^\s*[-*+]\s+/gm, ''); // 불릿 기호 제거
  clean = clean.replace(/^\s*\d+\.\s+/gm, ''); // 번호 리스트 기호 제거
  
  // 3. HTML 태그 제거
  clean = clean.replace(/<[^>]*>/g, '');
  
  return clean;
}

// ==========================================
// PDF 업로드 및 파싱 (PDF.js 활용) 기능 구현
// ==========================================

// PDF.js 워커 경로 설정
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// PDF 파일 업로드 및 본문 텍스트 추출
async function handlePdfUpload(file) {
  if (!file) return;
  
  if (file.type !== 'application/pdf') {
    alert('PDF 파일만 업로드 가능합니다.');
    return;
  }
  
  // UI 상태 업데이트
  if (pdfBadgeContainer && pdfBadgeName) {
    pdfBadgeName.innerText = 'PDF 문서를 로드하고 본문을 분석 중입니다...';
    pdfBadgeContainer.style.display = 'flex';
  }
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let pages = [];
    
    // 페이지 루프를 돌며 텍스트 추출
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      pages.push({
        pageNum: i,
        text: pageText
      });
    }
    
    attachedPdfData = {
      filename: file.name,
      pages: pages
    };
    
    if (pdfBadgeName) {
      pdfBadgeName.innerText = `${file.name} (총 ${pdf.numPages}페이지 분석 완료)`;
    }
    
    // 이미 활성화된 대화방이 있다면 즉시 바인딩하여 저장
    if (currentChatId) {
      const activeChat = chats.find(c => c.id === currentChatId);
      if (activeChat) {
        activeChat.pdfData = attachedPdfData;
        attachedPdfData = null;
        saveChatsToStorage();
        renderChatList();
        updateSummaryButtonsVisibility();
      }
    }
    
  } catch (error) {
    console.error('PDF parsing error:', error);
    alert(`PDF 본문 분석에 실패했습니다: ${error.message}`);
    
    attachedPdfData = null;
    if (pdfBadgeContainer) {
      pdfBadgeContainer.style.display = 'none';
    }
  }
}

// PDF 파일 첨부 해제
function detachPdf() {
  attachedPdfData = null;
  
  // 대화방에 바인딩되어 있다면 제거 및 저장
  if (currentChatId) {
    const activeChat = chats.find(c => c.id === currentChatId);
    if (activeChat && activeChat.pdfData) {
      delete activeChat.pdfData;
      saveChatsToStorage();
      renderChatList();
      updateSummaryButtonsVisibility();
    }
  }
  
  // 배지 숨김
  if (pdfBadgeContainer) {
    pdfBadgeContainer.style.display = 'none';
  }
}

// 드래그 앤 드롭 파일 업로드 초기화
function initDragAndDrop() {
  const chatWindow = document.querySelector('.chat-window');
  
  if (!chatWindow || !dragDropOverlay) return;
  
  // 브라우저 기본 드래그 앤 드롭 동작 무시
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    chatWindow.addEventListener(eventName, preventDefaults, false);
    dragDropOverlay.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  // 마우스가 영역 위로 올라왔을 때 오버레이 표시
  ['dragenter', 'dragover'].forEach(eventName => {
    chatWindow.addEventListener(eventName, () => {
      dragDropOverlay.classList.add('active');
    }, false);
  });
  
  // 마우스가 영역을 벗어나거나 파일을 드롭했을 때 오버레이 제거
  ['dragleave', 'drop'].forEach(eventName => {
    dragDropOverlay.addEventListener(eventName, () => {
      dragDropOverlay.classList.remove('active');
    }, false);
  });
  
  // 파일 드롭 핸들링 (실제 드롭은 활성화된 오버레이 위에서 발생하므로 둘 다에 등록)
  const handleDrop = (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
      handlePdfUpload(files[0]);
    }
  };

  chatWindow.addEventListener('drop', handleDrop, false);
  dragDropOverlay.addEventListener('drop', handleDrop, false);
}

// ==========================================
// PDF 및 대화 요약 보고서 작성 및 모달 연동
// ==========================================

// 요약 보고서 작성 버튼 노출 상태 갱신
function updateSummaryButtonsVisibility() {
  if (!currentChatId) {
    if (pdfSummaryBtn) pdfSummaryBtn.style.display = 'none';
    if (chatSummaryBtn) chatSummaryBtn.style.display = 'none';
    return;
  }
  
  const chat = chats.find(c => c.id === currentChatId);
  if (!chat) {
    if (pdfSummaryBtn) pdfSummaryBtn.style.display = 'none';
    if (chatSummaryBtn) chatSummaryBtn.style.display = 'none';
    return;
  }
  
  // PDF 요약 버튼: 해당 대화방에 PDF 데이터가 존재하면 보임
  if (pdfSummaryBtn) {
    if (chat.pdfData) {
      pdfSummaryBtn.style.display = 'inline-flex';
    } else {
      pdfSummaryBtn.style.display = 'none';
    }
  }
  
  // 대화 요약 버튼: 대화 메세지 이력이 있을 경우(최소 사용자 메세지 1개 이상) 보임
  if (chatSummaryBtn) {
    if (chat.messages && chat.messages.length > 0) {
      chatSummaryBtn.style.display = 'inline-flex';
    } else {
      chatSummaryBtn.style.display = 'none';
    }
  }
}

// PDF 문서 요약 보고서 생성
function generatePDFSummary() {
  const chat = chats.find(c => c.id === currentChatId);
  if (!chat || !chat.pdfData) return;
  
  const pdf = chat.pdfData;
  const documentContent = pdf.pages.map(p => `--- ${p.pageNum}페이지 ---\n${p.text}`).join('\n\n');
  
  const systemInstruction = `당신은 제공된 PDF 문서의 핵심 내용을 대한민국 정부 부처 및 공공기관의 공문서 양식(기획보고서 및 브리핑 문서 서식)에 따라 작성하는 격식 있는 행정 전문 비서입니다.
아래의 [작성 규칙]을 철저하게 준수하여 깔끔한 마크다운 보고서를 작성하십시오:
1. 오직 아래에 제공된 [PDF 문서 내용]에 적힌 정보만을 100% 근거로 삼아 핵심 내용을 정리하십시오. 외부 추측, 상상, 유추는 일절 사용하지 마십시오.
2. 이모지(Emoji)는 절대로 사용하지 마십시오.
3. 어조는 반드시 개조식 종결어미 (~함, ~임, ~바람) 및 명사형 종결로 격조 높은 공문서 스타일로 마감할 것.
4. 사전에 지정되거나 정형화된 목차(개요, 추진배경 등)를 고집하여 끼워 맞출 필요는 없습니다. 제공된 PDF 문서 본문 데이터의 성격과 논리 전개에 가장 알맞은 소제목들을 자유롭게 도출하여 깔끔하게 마크다운 형태로 구성하십시오.
5. 문서의 핵심 수치, 핵심 논점 및 시사점을 꼼꼼히 반영하고 관련된 핵심 문장 뒤에는 (출처: X페이지) 형식으로 출처 페이지를 표기할 것.`;

  const userPrompt = `다음 PDF 문서의 텍스트 분석 보고서를 공공기관 공문서 서식 규정에 맞추어 기획 보고서 형태로 작성하여 주십시오.

[PDF 파일명: ${pdf.filename}]

[PDF 문서 내용]
${documentContent}`;

  streamSummaryReport(systemInstruction, userPrompt, "PDF 문서 요약 보고서");
}

// 대화 내용 요약 보고서 생성
function generateChatSummary() {
  const chat = chats.find(c => c.id === currentChatId);
  if (!chat || !chat.messages || chat.messages.length === 0) return;
  
  const conversationHistory = chat.messages.map(m => `${m.role === 'user' ? '사용자' : 'AI'}: ${m.content}`).join('\n\n');
  
  const systemInstruction = `당신은 사용자와 AI 챗봇 간의 대화 기록을 분석하여 핵심적인 논의 내용과 도출된 지식을 요약하는 행정 요약 보고서 작성 전문가입니다.
아래의 [작성 규칙]을 준수하여 보고서를 작성해 주십시오:
1. 이모지(Emoji)는 절대로 사용하지 마십시오.
2. 문체는 개조식 및 공문서 종결어미(~함, ~임, ~바람)를 사용하고 객관적이며 명확하게 작성할 것.
3. 이 보고서는 회의록 형식이 아닙니다. 단순 회의록 서식을 탈피하여 사용자가 질문한 주요 현안 문제들과 이에 대응하여 AI가 제시한 솔루션 및 지식의 주요 요점을 중심 구조로 깔끔하게 정리하는 보고서입니다.
4. 보고서의 순서는 반드시 **사용자가 질의한 질문 및 요구사항 요약**을 첫 번째 대주제로 먼저 요약·정리하고, 그 **이후에 AI가 제공한 답변 및 솔루션 요약**을 두 번째 대주제로 이어서 작성하는 순서를 준수하십시오. (예: "1. 사용자 질문 및 요구사항", "2. AI 답변 및 해결방안")
5. AI 답변 요약 작성 시, **답변에 수록된 정보나 솔루션 내용 그 자체만** 정리하여 전달하고, 회의록 서식 같은 메타 설명인 **'~을(를) 설명함', '~임을 명시함', '~에 대해 안내함', '~를 상세히 소개함' 등의 표현은 절대 사용을 배제하십시오.** 오직 객관적인 사실과 정보 내용만 개조식으로 직접 기술하여야 합니다.`;

  const userPrompt = `다음 대화 기록을 기반으로 주요 의제 및 대화 요약 보고서를 대한민국 공공기관 공식 보고서 서식에 맞게 격식 있는 개조식으로 작성하여 주십시오.

[대화방 제목: ${chat.title}]

[대화 기록]
${conversationHistory}`;

  streamSummaryReport(systemInstruction, userPrompt, "대화 결과 요약 보고서");
}

// 요약 보고서 실시간 스트리밍 및 모달 바인딩
async function streamSummaryReport(systemInstruction, userPrompt, titleText) {
  if (!reportModal || !reportModalOverlay || !reportModalBody) return;
  
  const modalTitle = document.getElementById('report-modal-title');
  if (modalTitle) {
    modalTitle.innerHTML = `<i class="fa-solid fa-file-contract"></i> ${titleText}`;
  }
  
  // 로딩 상태 렌더링
  reportModalBody.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 16px; padding: 100px 0;">
      <div class="typing-indicator" style="display: flex; gap: 8px;">
        <div class="typing-dot" style="background-color: var(--accent-color);"></div>
        <div class="typing-dot" style="background-color: var(--accent-color);"></div>
        <div class="typing-dot" style="background-color: var(--accent-color);"></div>
      </div>
      <p style="color: var(--text-muted); font-size: 0.95rem; font-family: var(--font-display);">보고서를 작성하고 있습니다. 잠시만 기다려 주세요...</p>
    </div>
  `;
  
  // 모달 팝업 표시
  reportModalOverlay.classList.add('active');
  reportModal.classList.add('active');
  
  try {
    if (settings.apiKey) {
      const modelEndpoint = settings.model;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelEndpoint}:streamGenerateContent?alt=sse&key=${settings.apiKey}`;
      
      const requestBody = {
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errMsg = errorData.error?.message || `HTTP ${response.status}`;
        if (errMsg.includes("quota") || errMsg.includes("Quota") || response.status === 429) {
          errMsg = `Google API 할당량(Quota) 초과 및 이용 제한 오류가 발생했습니다.
          
상세 원인: 현재 사용 중이신 **Google AI Studio 무료 API Key**는 분당 요청 제한(무료 플랜 1분당 최대 15회 등) 또는 일일 사용량이 모두 소진되었을 가능성이 큽니다.

💡 **중요 안내**: 
만약 **무료 등급(Free Tier) API Key**를 사용하시는 경우, 구글 실시간 검색 연동 기능(돋보기 버튼)은 **Gemini 2.5 Flash** 및 **Gemini 2.5 Flash Lite** 모델에서만 지원됩니다. 타 모델(예: Gemini 3.5 Flash, Gemini 3.1 Pro 등)에서 실시간 검색 기능을 켠 채 질문하면 할당량 초과나 권한 오류가 발생하게 됩니다.

해결 방법:
1. 채팅창 왼쪽 아래의 돋보기[실시간 검색] 버튼을 클릭하여 **비활성화(회색 상태)**한 후 질문을 다시 보내주세요.
2. 실시간 검색 기능을 꼭 이용하셔야 한다면, 설정이나 헤더에서 모델을 **Gemini 2.5 Flash** 또는 **Gemini 2.5 Flash Lite**로 변경한 뒤 시도해 주세요.
3. 약 1분에서 수분 대기 후 API 요청 속도 제한(Rate Limit)이 풀리면 다시 질문을 전송해 주세요.`;
        }
        throw new Error(errMsg);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let fullReportText = "";
      let isFirstChunk = true;
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        
        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine.startsWith("data: ")) {
            const jsonStr = cleanLine.substring(6);
            try {
              const chunkData = JSON.parse(jsonStr);
              const textChunk = chunkData.candidates?.[0]?.content?.parts?.[0]?.text || "";
              
              if (textChunk) {
                fullReportText += textChunk;
                
                if (isFirstChunk) {
                  isFirstChunk = false;
                  reportModalBody.innerHTML = ""; // 로딩 제거
                }
                
                reportModalBody.innerHTML = parseMarkdown(fullReportText);
              }
            } catch (e) {
              console.error("Stream parse error", e);
            }
          }
        }
      }
      
      if (isFirstChunk) {
        throw new Error("API로부터 보고서 내용을 생성받지 못했습니다.");
      }
    } else {
      // 시뮬레이션 모드: 약간의 딜레이 후 로컬 모의 생성기 구동
      await new Promise(resolve => setTimeout(resolve, 800));
      reportModalBody.innerHTML = "";
      
      const simulatedText = getSimulatedReportText(titleText);
      
      let currentIdx = 0;
      const chunkSize = 15;
      const intervalTime = 10;
      
      await new Promise((resolve) => {
        function type() {
          if (currentIdx < simulatedText.length) {
            currentIdx += chunkSize;
            const partial = simulatedText.substring(0, currentIdx);
            reportModalBody.innerHTML = parseMarkdown(partial);
            setTimeout(type, intervalTime);
          } else {
            resolve();
          }
        }
        type();
      });
    }
  } catch (error) {
    console.error("Report generation failed", error);
    reportModalBody.innerHTML = `
      <div style="padding: 40px; text-align: center; color: #ef4444;">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 2.5rem; margin-bottom: 16px;"></i>
        <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">보고서 생성 실패</h4>
        <p style="font-size: 0.9rem; color: #4b5563; margin-bottom: 16px;">${error.message || '네트워크 오류가 발생했습니다.'}</p>
        <p style="font-size: 0.85rem; color: #6b7280;">설정 메뉴에서 Gemini API Key를 등록하셨는지 확인해 주십시오.</p>
      </div>
    `;
  }
}

// 시뮬레이션용 보고서 텍스트 생성기 (공문서 서식 준수, 이모지 배제, 개조식 종결)
function getSimulatedReportText(titleText) {
  const activeChat = chats.find(c => c.id === currentChatId);
  const now = new Date();
  const formattedDate = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${String(now.getDate()).padStart(2, '0')}.`;
  
  if (titleText.includes("PDF")) {
    const pdf = activeChat?.pdfData;
    const filename = pdf ? pdf.filename : "첨부파일.pdf";
    const totalPages = pdf ? pdf.pages.length : 0;
    
    let keyKeywords = "미감지";
    let firstPageSnippet = "내용을 분석할 수 없음.";
    
    if (pdf && pdf.pages.length > 0) {
      const page1 = pdf.pages[0].text;
      firstPageSnippet = page1.length > 180 ? page1.substring(0, 180) + "..." : page1;
      
      const words = page1.split(/\s+/).filter(w => w.length > 2);
      keyKeywords = [...new Set(words)].slice(0, 5).join(", ");
    }
    
    return `# ${filename} 핵심 분석 요약 보고서

보고일자 : ${formattedDate}
보고기관 : Aiden 연구단
문서정보 : 총 ${totalPages}페이지 분량

## 1. 개요 및 취지
- 본 보고서는 사용자가 첨부한 문서 \`${filename}\`에 명시된 핵심 데이터와 주요 논점사항을 한눈에 파악하기 위해 작성됨.
- 문서 내 분산된 핵심 지표를 발췌하고, 행정 및 개발 실무에 필요한 요약정보를 공문서 서식에 의거하여 제공함.

## 2. 주요 핵심 요약
- **주요 식별 키워드** : ${keyKeywords} 등
- **초반 본문 내용 요약 [1페이지]** :
  > "${firstPageSnippet}"
- 문서의 전체 영역을 통틀어 사용자가 검색/질의하고자 하는 지식베이스의 핵심을 구성하고 있음이 파악됨.

## 3. 종합 의견 및 향후 조치방안
- 본 분석 요약서는 모의(Simulation) 엔진에 의해 문서의 1페이지 및 기초 메타데이터를 기반으로 생성된 간이 보고서임.
- 보다 심층적이고 신뢰도 높은 전체 문서 Grounding 요약 보고서를 작성하기 위해서는 실제 **Gemini API Key** 연동이 요구됨.
- API Key 연동 완료 시, 인공지능이 문서의 모든 페이지를 교차 대조하여 완벽한 공문서 형태의 종합 리포트를 즉시 재생성함.`;
  } else {
    const totalMessages = activeChat ? activeChat.messages.length : 0;
    const messages = activeChat ? activeChat.messages : [];
    
    const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || "없음";
    const recentTopic = lastUserMsg.length > 30 ? lastUserMsg.substring(0, 30) + "..." : lastUserMsg;
    
    return `# 대화 결과 요약 보고서

보고일자 : ${formattedDate}
대 화 방 : ${activeChat ? activeChat.title : "새 대화"}
기록현황 : 사용자 및 AI 간 총 ${totalMessages}회 대화 진행됨

## 1. 대화 개요
- 사용자의 현안 사항 질의 및 이에 따른 AI 어시스턴트의 기술적/지식적 솔루션 제시를 중심으로 대화가 진행됨.
- 현 대화 세션에서 다뤄진 주요 지식을 정리하여 업무 효율 및 지식 보관을 돕기 위해 작성됨.

## 2. 사용자 질문 및 요구사항 요약
- **주요 관심 현안** : 사용자는 주로 "${recentTopic}" 관련 사안에 대해 질의함.
- **핵심 요구사항** :
  - 제시된 질문에 대한 명확한 핵심 스펙 및 동작 원리 설명 요구.
  - 실무 적용이 용이한 예제 코드 스니펫 및 마크다운 형식의 결과 제시 요청.

## 3. AI 답변 및 제공 솔루션 요약
- **핵심 솔루션 제안** :
  - 사용자의 요구 사항에 부합하도록 최적의 기술 구성 요소와 설계안을 상세히 제안함.
  - 특히 음성 인식(STT/TTS) 연동 및 PDF 파싱 등 고난이도 클라이언트 단독 연동 스펙에 대한 맞춤 설계와 코드 스니펫을 실시간으로 도출함.

## 4. 종합 평가 및 향후 권고사항
- 본 대화 요약 보고서는 모의(Simulation) 모드에 의해 대화방의 메타정보 및 최근 발화 내역을 바탕으로 작성됨.
- 실제 전체 대화 맥락의 논리 구조 분석 및 종합 결과 보고서를 출력하기 위해서는 우측 하단 **설정** 메뉴에서 **Gemini API Key**를 등록하여 사용할 것을 권장함.`;
  }
}

// Initialize Custom Header Model Dropdown
function initHeaderModelDropdown() {
  if (!headerModelBadgeBtn || !headerModelDropdown) return;
  
  // Toggle dropdown on click
  headerModelBadgeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = headerModelDropdown.classList.contains('active');
    if (isVisible) {
      headerModelDropdown.classList.remove('active');
    } else {
      headerModelDropdown.classList.add('active');
    }
  });
  
  // Close dropdown on outside click
  window.addEventListener('click', () => {
    headerModelDropdown.classList.remove('active');
  });
  
  // Render model list inside the dropdown
  renderHeaderModelDropdown();
}

// Render options inside custom model selector dropdown
function renderHeaderModelDropdown() {
  if (!headerModelDropdown) return;
  headerModelDropdown.innerHTML = '';
  
  Object.keys(modelNames).forEach(modelId => {
    const option = document.createElement('button');
    option.className = `header-model-dropdown-option ${settings.model === modelId ? 'active' : ''}`;
    option.innerText = modelNames[modelId];
    
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Update model settings
      settings.model = modelId;
      saveSettingsToStorage();
      
      // Sync settings modal dropdown option
      if (modelSelect) {
        modelSelect.value = modelId;
      }
      
      // Update active chat's metadata
      if (currentChatId) {
        const activeChat = chats.find(c => c.id === currentChatId);
        if (activeChat) {
          activeChat.model = modelId;
          saveChatsToStorage();
        }
      }
      
      // Update header text and status UI
      updateApiStatusUI();
      
      // Close dropdown
      headerModelDropdown.classList.remove('active');
      
      // Re-render chat list to update badge/icon if model changed
      renderChatList();
      
      // Re-render dropdown list to update active state class
      renderHeaderModelDropdown();
    });
    
    headerModelDropdown.appendChild(option);
  });
}




