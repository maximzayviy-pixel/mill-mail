// ДИВЕРГЕНТ - Система разведки
class DivergentSystem {
    constructor() {
        this.attemptsLeft = 3;
        this.isLoggedIn = false;
        this.map = null;
        this.compass = {
            degree: 0,
            direction: 'Север'
        };
        this.database = [];
        this.chats = {
            current: 'Командный канал',
            messages: []
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.simulateLoading();
        this.loadDatabase();
    }

    simulateLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressBar = document.querySelector('.loading-progress');
        const loadingText = document.querySelector('.loading-text');
        
        const loadingSteps = [
            'Инициализация системы...',
            'Загрузка модулей безопасности...',
            'Подключение к спутникам...',
            'Синхронизация базы данных...',
            'Активация интерфейса...',
            'Система готова к работе'
        ];
        
        let step = 0;
        const interval = setInterval(() => {
            if (step < loadingSteps.length) {
                loadingText.textContent = loadingSteps[step];
                progressBar.style.width = `${((step + 1) / loadingSteps.length) * 100}%`;
                step++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 500);
            }
        }, 500);
    }

    setupEventListeners() {
        // Login
        document.getElementById('login-btn').addEventListener('click', () => this.handleLogin());
        document.getElementById('access-key').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => this.handleLogout());

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.switchTab(e.currentTarget.dataset.tab));
        });

        // Map controls
        document.getElementById('satellite-toggle').addEventListener('click', () => this.toggleMapLayer('satellite'));
        document.getElementById('sentinel-toggle').addEventListener('click', () => this.toggleMapLayer('sentinel2'));
        document.getElementById('maxar-toggle').addEventListener('click', () => this.toggleMapLayer('maxar'));
        document.getElementById('google-toggle').addEventListener('click', () => this.toggleMapLayer('googleSat'));
        document.getElementById('terrain-toggle').addEventListener('click', () => this.toggleMapLayer('terrain'));
        document.getElementById('street-toggle').addEventListener('click', () => this.toggleMapLayer('street'));

        // Scanner
        document.getElementById('upload-file').addEventListener('click', () => this.uploadFile());
        document.getElementById('camera-scan').addEventListener('click', () => this.cameraScan());

        // Compass
        document.getElementById('calibrate-compass').addEventListener('click', () => this.calibrateCompass());
        document.getElementById('reset-compass').addEventListener('click', () => this.resetCompass());

        // Database
        document.getElementById('upload-database').addEventListener('click', () => this.uploadDatabase());
        document.getElementById('database-search').addEventListener('input', (e) => this.searchDatabase(e.target.value));

        // Chat functionality
        const sendBtn = document.getElementById('send-message');
        const messageInput = document.getElementById('message-input');
        if (sendBtn && messageInput) {
            sendBtn.addEventListener('click', () => this.sendMessage());
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }

        // File uploads
        document.getElementById('file-upload').addEventListener('change', (e) => this.handleFileUpload(e));
        document.getElementById('database-upload').addEventListener('change', (e) => this.handleDatabaseUpload(e));

        // Chat
        document.querySelector('.btn-send').addEventListener('click', () => this.sendMessage());
        document.querySelector('.chat-input input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    handleLogin() {
        const accessKey = document.getElementById('access-key').value;
        const errorMessage = document.getElementById('login-error');
        
        if (!accessKey) {
            this.showError('Введите ключ доступа');
            return;
        }

        // Simulate key validation
        const validKeys = ['DIVERGENT2024', 'ACCESS123', 'SECRET_KEY', 'ADMIN'];
        
        if (validKeys.includes(accessKey.toUpperCase())) {
            this.isLoggedIn = true;
            this.showMainSystem();
        } else {
            this.attemptsLeft--;
            document.getElementById('attempts-left').textContent = this.attemptsLeft;
            
            if (this.attemptsLeft <= 0) {
                this.showError('Превышено количество попыток. IP заблокирован.');
                this.blockAccess();
            } else {
                this.showError(`Неверный ключ. Осталось попыток: ${this.attemptsLeft}`);
            }
        }
    }

    showError(message) {
        const errorMessage = document.getElementById('login-error');
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }

    blockAccess() {
        document.querySelector('.login-form').innerHTML = `
            <div class="blocked-message">
                <i class="fas fa-ban"></i>
                <h3>Доступ заблокирован</h3>
                <p>Превышено количество попыток входа</p>
                <p>Обратитесь к администратору системы</p>
            </div>
        `;
    }

    showMainSystem() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-system').style.display = 'flex';
        this.initializeMap();
        this.initializeCompass();
        this.startCompassSimulation();
    }

    handleLogout() {
        this.isLoggedIn = false;
        document.getElementById('main-system').style.display = 'none';
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('access-key').value = '';
        this.attemptsLeft = 3;
        document.getElementById('attempts-left').textContent = this.attemptsLeft;
    }

    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Initialize specific tab
        if (tabName === 'map' && !this.map) {
            this.initializeMap();
        }
    }

    // Map Functions
    initializeMap() {
        if (this.map) return;

        this.map = L.map('map').setView([55.7558, 37.6176], 10);

        // Real working satellite imagery sources
        this.satelliteLayers = {
            landsat9: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Landsat-9 • 2024-01-15 • 30м/пиксель',
                name: 'Landsat-9',
                date: '2024-01-15',
                resolution: '30м/пиксель',
                maxZoom: 19
            }),
            sentinel2: L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_2022/GoogleMapsCompatible/{z}/{y}/{x}.jpg', {
                attribution: 'Sentinel-2 • 2024-01-10 • 10м/пиксель',
                name: 'Sentinel-2',
                date: '2024-01-10',
                resolution: '10м/пиксель',
                maxZoom: 19
            }),
            maxar: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Maxar • 2024-01-20 • 50см/пиксель',
                name: 'Maxar',
                date: '2024-01-20',
                resolution: '50см/пиксель',
                maxZoom: 20
            }),
            googleSat: L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                attribution: 'Google Satellite • 2024-01-25 • 15м/пиксель',
                name: 'Google Satellite',
                date: '2024-01-25',
                resolution: '15м/пиксель',
                maxZoom: 20
            })
        };

        // Add street layer
        this.streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'OpenStreetMap • 2024-01-25',
            name: 'OpenStreetMap',
            date: '2024-01-25',
            resolution: '19м/пиксель'
        });

        // Add terrain layer
        this.terrainLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'OpenTopoMap • 2024-01-20',
            name: 'OpenTopoMap',
            date: '2024-01-20',
            resolution: '25м/пиксель'
        });

        // Start with Landsat-9
        this.currentLayer = 'landsat9';
        this.satelliteLayers.landsat9.addTo(this.map);
        this.updateSatelliteInfo('landsat9');

        // Update coordinates on move
        this.map.on('mousemove', (e) => {
            document.getElementById('lat').textContent = e.latlng.lat.toFixed(4);
            document.getElementById('lng').textContent = e.latlng.lng.toFixed(4);
        });

        // Add some markers
        this.addMapMarkers();
    }

    addMapMarkers() {
        const markers = [
            { lat: 55.7558, lng: 37.6176, title: 'Центр Москвы', type: 'location' },
            { lat: 55.7522, lng: 37.6156, title: 'Красная площадь', type: 'landmark' },
            { lat: 55.7512, lng: 37.6184, title: 'Кремль', type: 'landmark' }
        ];

        markers.forEach(marker => {
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-${marker.type}"><i class="fas fa-${marker.type === 'location' ? 'map-marker-alt' : 'building'}"></i></div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            L.marker([marker.lat, marker.lng], { icon })
                .addTo(this.map)
                .bindPopup(marker.title);
        });
    }

    toggleMapLayer(layerType) {
        // Remove all layers
        Object.values(this.satelliteLayers).forEach(layer => {
            if (this.map.hasLayer(layer)) {
                this.map.removeLayer(layer);
            }
        });
        if (this.map.hasLayer(this.streetLayer)) {
            this.map.removeLayer(this.streetLayer);
        }
        if (this.map.hasLayer(this.terrainLayer)) {
            this.map.removeLayer(this.terrainLayer);
        }

        // Update button states
        document.querySelectorAll('.map-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add selected layer and update info
        switch (layerType) {
            case 'satellite':
                this.satelliteLayers.landsat9.addTo(this.map);
                this.currentLayer = 'landsat9';
                this.updateSatelliteInfo('landsat9');
                document.getElementById('satellite-toggle').classList.add('active');
                break;
            case 'sentinel2':
                this.satelliteLayers.sentinel2.addTo(this.map);
                this.currentLayer = 'sentinel2';
                this.updateSatelliteInfo('sentinel2');
                document.getElementById('sentinel-toggle').classList.add('active');
                break;
            case 'maxar':
                this.satelliteLayers.maxar.addTo(this.map);
                this.currentLayer = 'maxar';
                this.updateSatelliteInfo('maxar');
                document.getElementById('maxar-toggle').classList.add('active');
                break;
            case 'googleSat':
                this.satelliteLayers.googleSat.addTo(this.map);
                this.currentLayer = 'googleSat';
                this.updateSatelliteInfo('googleSat');
                document.getElementById('google-toggle').classList.add('active');
                break;
            case 'street':
                this.streetLayer.addTo(this.map);
                this.currentLayer = 'street';
                this.updateSatelliteInfo('street');
                document.getElementById('street-toggle').classList.add('active');
                break;
            case 'terrain':
                this.terrainLayer.addTo(this.map);
                this.currentLayer = 'terrain';
                this.updateSatelliteInfo('terrain');
                document.getElementById('terrain-toggle').classList.add('active');
                break;
        }
    }

    updateSatelliteInfo(layerType) {
        const satelliteName = document.getElementById('satellite-name');
        const imageDate = document.getElementById('image-date');
        const resolution = document.getElementById('resolution');

        let info;
        switch (layerType) {
            case 'landsat9':
                info = this.satelliteLayers.landsat9.options;
                break;
            case 'sentinel2':
                info = this.satelliteLayers.sentinel2.options;
                break;
            case 'maxar':
                info = this.satelliteLayers.maxar.options;
                break;
            case 'googleSat':
                info = this.satelliteLayers.googleSat.options;
                break;
            case 'street':
                info = this.streetLayer.options;
                break;
            case 'terrain':
                info = this.terrainLayer.options;
                break;
        }

        if (satelliteName) satelliteName.textContent = info.name;
        if (imageDate) imageDate.textContent = info.date;
        if (resolution) resolution.textContent = info.resolution;
    }

    // Compass Functions
    initializeCompass() {
        this.updateCompassDisplay();
    }

    startCompassSimulation() {
        setInterval(() => {
            if (this.isLoggedIn) {
                // Simulate compass movement
                this.compass.degree = (this.compass.degree + Math.random() * 2 - 1) % 360;
                if (this.compass.degree < 0) this.compass.degree += 360;
                
                this.updateCompassDisplay();
            }
        }, 100);
    }

    updateCompassDisplay() {
        const needle = document.getElementById('compass-needle');
        const degree = document.getElementById('compass-degree');
        const direction = document.getElementById('compass-direction');
        const speed = document.getElementById('compass-speed');
        const temp = document.getElementById('compass-temp');

        if (needle) {
            needle.style.transform = `translate(-50%, -100%) rotate(${this.compass.degree}deg)`;
        }

        if (degree) {
            degree.textContent = `${Math.round(this.compass.degree)}°`;
        }

        if (direction) {
            const directions = ['Север', 'Северо-восток', 'Восток', 'Юго-восток', 'Юг', 'Юго-запад', 'Запад', 'Северо-запад'];
            const index = Math.round(this.compass.degree / 45) % 8;
            direction.textContent = directions[index];
        }

        if (speed) {
            speed.textContent = `${Math.round(Math.random() * 50)} км/ч`;
        }

        if (temp) {
            temp.textContent = `${Math.round(15 + Math.random() * 15)}°C`;
        }
    }

    calibrateCompass() {
        this.compass.degree = 0;
        this.updateCompassDisplay();
        this.showNotification('Компас откалиброван', 'success');
    }

    resetCompass() {
        this.compass.degree = 0;
        this.updateCompassDisplay();
        this.showNotification('Компас сброшен', 'info');
    }

    // Scanner Functions
    uploadFile() {
        document.getElementById('file-upload').click();
    }

    cameraScan() {
        this.showNotification('Функция камеры будет доступна в следующей версии', 'info');
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const previewArea = document.getElementById('preview-area');
        const extractedText = document.getElementById('extracted-text');

        // Show file info
        previewArea.innerHTML = `
            <i class="fas fa-file-alt"></i>
            <p>Файл: ${file.name}</p>
            <p>Размер: ${(file.size / 1024).toFixed(2)} KB</p>
            <p>Тип: ${file.type}</p>
        `;

        // Simulate text extraction
        this.extractTextFromFile(file, extractedText);
    }

    extractTextFromFile(file, outputElement) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            let text = '';
            
            if (file.type === 'text/plain') {
                text = e.target.result;
            } else if (file.type === 'application/pdf') {
                text = 'PDF текст будет извлечен здесь...';
            } else if (file.type.includes('image')) {
                text = 'OCR распознавание текста с изображения...';
            } else {
                text = 'Обработка файла...';
            }

            outputElement.textContent = text;
            this.searchInDatabase(text);
        };

        if (file.type === 'text/plain') {
            reader.readAsText(file);
        } else {
            // Simulate processing for other file types
            setTimeout(() => {
                outputElement.textContent = 'Извлеченный текст из документа...\n\nЭто пример извлеченного текста для демонстрации работы системы сканирования документов.';
                this.searchInDatabase('извлеченный текст');
            }, 2000);
        }
    }

    searchInDatabase(text) {
        const searchResults = document.getElementById('search-results');
        const searchTerms = text.toLowerCase().split(' ');
        
        const matches = this.database.filter(item => 
            searchTerms.some(term => 
                item.name.toLowerCase().includes(term) || 
                item.description.toLowerCase().includes(term)
            )
        );

        searchResults.innerHTML = matches.map(item => `
            <div class="search-item">
                <div class="search-icon">
                    <i class="fas fa-user"></i>
                </div>
                <div class="search-content">
                    <div class="search-title">${item.name}</div>
                    <div class="search-snippet">${item.description}</div>
                </div>
                <div class="search-score">${Math.round(Math.random() * 40 + 60)}%</div>
            </div>
        `).join('') || '<div class="no-results">Совпадений не найдено</div>';
    }

    // Database Functions
    loadDatabase() {
        // Sample database
        this.database = [
            { id: 1, name: 'Иванов Иван Иванович', description: 'Агент разведки, Москва', type: 'person' },
            { id: 2, name: 'Петров Петр Петрович', description: 'Специалист по анализу', type: 'person' },
            { id: 3, name: 'Сидорова Мария', description: 'Координатор операций', type: 'person' },
            { id: 4, name: 'Здание на Тверской', description: 'Целевой объект', type: 'location' },
            { id: 5, name: 'Автомобиль BMW X5', description: 'Транспортное средство', type: 'vehicle' },
            { id: 6, name: 'Козлов Дмитрий', description: 'Технический специалист', type: 'person' },
            { id: 7, name: 'Офис на Арбате', description: 'Место встречи', type: 'location' },
            { id: 8, name: 'Мотоцикл Yamaha', description: 'Средство передвижения', type: 'vehicle' }
        ];
    }

    uploadDatabase() {
        document.getElementById('database-upload').click();
    }

    handleDatabaseUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (file.name.endsWith('.json')) {
                    this.database = JSON.parse(e.target.result);
                } else if (file.name.endsWith('.csv')) {
                    this.parseCSV(e.target.result);
                }
                this.showNotification('База данных загружена успешно', 'success');
                this.searchDatabase('');
            } catch (error) {
                this.showNotification('Ошибка загрузки базы данных', 'error');
            }
        };

        reader.readAsText(file);
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        this.database = lines.slice(1).map((line, index) => {
            const values = line.split(',');
            return {
                id: index + 1,
                name: values[0] || '',
                description: values[1] || '',
                type: values[2] || 'person'
            };
        });
    }

    searchDatabase(query) {
        const resultsContainer = document.getElementById('database-results');
        const resultsCount = document.getElementById('results-count');
        
        let filteredResults = this.database;
        
        if (query) {
            filteredResults = this.database.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase())
            );
        }

        const filterType = document.getElementById('filter-type').value;
        if (filterType !== 'all') {
            filteredResults = filteredResults.filter(item => item.type === filterType);
        }

        resultsCount.textContent = filteredResults.length;

        resultsContainer.innerHTML = filteredResults.map(item => `
            <div class="result-item">
                <div class="result-icon">
                    <i class="fas fa-${item.type === 'person' ? 'user' : item.type === 'location' ? 'map-marker-alt' : 'car'}"></i>
                </div>
                <div class="result-content">
                    <div class="result-title">${item.name}</div>
                    <div class="result-subtitle">ID: ${item.id} | Тип: ${item.type}</div>
                    <div class="result-tags">
                        <span class="tag">${item.type}</span>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn-action" onclick="divergentSystem.viewItem(${item.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action" onclick="divergentSystem.editItem(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    viewItem(id) {
        const item = this.database.find(i => i.id === id);
        if (item) {
            this.showNotification(`Просмотр: ${item.name}`, 'info');
        }
    }

    editItem(id) {
        const item = this.database.find(i => i.id === id);
        if (item) {
            this.showNotification(`Редактирование: ${item.name}`, 'info');
        }
    }

    // Chat Functions
    sendMessage() {
        const input = document.querySelector('.chat-input input');
        const message = input.value.trim();
        
        if (!message) return;

        const messagesContainer = document.querySelector('.chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">Вы</span>
                    <span class="message-time">${new Date().toLocaleTimeString()}</span>
                </div>
                <div class="message-text">${message}</div>
            </div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        input.value = '';

        // Simulate response
        setTimeout(() => {
            this.addBotMessage();
        }, 1000);
    }

    addBotMessage() {
        const messagesContainer = document.querySelector('.chat-messages');
        const responses = [
            'Понял, выполняю задачу',
            'Данные получены и обработаны',
            'Операция в процессе',
            'Требуется дополнительная информация',
            'Задача выполнена успешно'
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">Система</span>
                    <span class="message-time">${new Date().toLocaleTimeString()}</span>
                </div>
                <div class="message-text">${randomResponse}</div>
            </div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Chat Functions
    sendMessage() {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        
        if (!message) return;

        // Add message to chat
        this.addMessageToChat(message, 'outgoing');
        
        // Clear input
        messageInput.value = '';
        
        // Simulate response after delay
        setTimeout(() => {
            const responses = [
                'Понял. Выполняю команду.',
                'Данные получены. Обрабатываю.',
                'Подтверждаю. Система готова.',
                'Анализ завершен. Отчет готов.',
                'Цель обнаружена. Координаты переданы.',
                'Миссия выполнена успешно.',
                'Все системы функционируют нормально.',
                'Спутниковая связь стабильна.'
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            this.addMessageToChat(randomResponse, 'incoming');
        }, 1000 + Math.random() * 2000);
    }

    addMessageToChat(message, type) {
        const chatMessages = document.querySelector('.chat-messages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        if (type === 'outgoing') {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${message}</div>
                    <div class="message-time">${timeString}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-broadcast-tower"></i>
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-sender">Центр управления</span>
                        <span class="message-time">${timeString}</span>
                    </div>
                    <div class="message-text">${message}</div>
                </div>
            `;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Utility Functions
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add notification styles if not exists
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--bg-secondary);
                    border: 2px solid var(--border-accent);
                    border-radius: 8px;
                    padding: 1rem 1.5rem;
                    z-index: 10000;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    box-shadow: 0 0 20px var(--shadow-color);
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification-success {
                    border-color: var(--success-color);
                }
                .notification-error {
                    border-color: var(--danger-color);
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: var(--text-primary);
                }
                .notification-content i {
                    color: var(--primary-color);
                }
                .notification-success .notification-content i {
                    color: var(--success-color);
                }
                .notification-error .notification-content i {
                    color: var(--danger-color);
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize system when page loads
let divergentSystem;
document.addEventListener('DOMContentLoaded', () => {
    divergentSystem = new DivergentSystem();
    divergentSystem.startClock();
});

// Clock functionality
function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}
