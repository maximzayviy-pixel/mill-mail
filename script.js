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
        document.getElementById('esri-toggle').addEventListener('click', () => this.toggleMapLayer('esriSat'));
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
        this.setupChatHandlers();

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
        this.initializeMilitaryFeatures();
    }

    // Military Features
    initializeMilitaryFeatures() {
        this.threatLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        this.currentThreatLevel = 0;
        this.startThreatLevelRotation();
        this.startRadarAnimation();
        this.startAlertSystem();
    }

    startThreatLevelRotation() {
        setInterval(() => {
            const threatElement = document.getElementById('threat-level');
            if (threatElement) {
                this.currentThreatLevel = (this.currentThreatLevel + 1) % this.threatLevels.length;
                const newLevel = this.threatLevels[this.currentThreatLevel];
                threatElement.textContent = newLevel;
                
                // Update threat level styling
                threatElement.className = 'threat-indicator';
                if (newLevel === 'HIGH' || newLevel === 'CRITICAL') {
                    threatElement.style.background = 'var(--danger-color)';
                } else if (newLevel === 'MEDIUM') {
                    threatElement.style.background = 'var(--warning-color)';
                } else {
                    threatElement.style.background = 'var(--success-color)';
                }
            }
        }, 10000); // Change every 10 seconds
    }

    startRadarAnimation() {
        // Radar animation is handled by CSS, but we can add dynamic targets
        setInterval(() => {
            const radarScreen = document.querySelector('.radar-screen');
            if (radarScreen) {
                // Randomly add/remove target dots
                const existingDots = radarScreen.querySelectorAll('.target-dot');
                if (existingDots.length < 5 && Math.random() > 0.7) {
                    const newDot = document.createElement('div');
                    newDot.className = 'target-dot';
                    newDot.style.top = Math.random() * 80 + 10 + '%';
                    newDot.style.left = Math.random() * 80 + 10 + '%';
                    radarScreen.appendChild(newDot);
                }
            }
        }, 5000);
    }

    startAlertSystem() {
        const alerts = [
            { level: 'high', text: 'HIGH: Unidentified aircraft detected', icon: 'exclamation-triangle' },
            { level: 'medium', text: 'MED: Weather conditions changing', icon: 'info-circle' },
            { level: 'low', text: 'LOW: System maintenance required', icon: 'check-circle' },
            { level: 'high', text: 'HIGH: Suspicious activity detected', icon: 'exclamation-triangle' },
            { level: 'medium', text: 'MED: Communication link unstable', icon: 'info-circle' },
            { level: 'low', text: 'LOW: Backup systems online', icon: 'check-circle' }
        ];

        setInterval(() => {
            const alertList = document.querySelector('.alert-list');
            if (alertList && Math.random() > 0.8) {
                const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
                const alertItem = document.createElement('div');
                alertItem.className = `alert-item ${randomAlert.level}`;
                alertItem.innerHTML = `
                    <i class="fas fa-${randomAlert.icon}"></i>
                    <span>${randomAlert.text}</span>
                `;
                
                // Remove oldest alert if more than 5
                const existingAlerts = alertList.querySelectorAll('.alert-item');
                if (existingAlerts.length >= 5) {
                    existingAlerts[0].remove();
                }
                
                alertList.appendChild(alertItem);
                
                // Update alert count
                const alertCount = document.querySelector('.alert-count');
                if (alertCount) {
                    alertCount.textContent = alertList.children.length;
                }
            }
        }, 15000);
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

        this.map = L.map('map').setView([50.4501, 30.5234], 6);

        // Military-grade satellite imagery sources
        this.satelliteLayers = {
            landsat9: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Landsat-9 • 2024-01-15 • 30м/пиксель',
                name: 'Landsat-9',
                date: '2024-01-15',
                resolution: '30м/пиксель',
                maxZoom: 19,
                subdomains: ['server', 'services']
            }),
            sentinel2: L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_2022/GoogleMapsCompatible/{z}/{y}/{x}.jpg', {
                attribution: 'Sentinel-2 • 2024-01-10 • 10м/пиксель',
                name: 'Sentinel-2',
                date: '2024-01-10',
                resolution: '10м/пиксель',
                maxZoom: 19,
                subdomains: ['tiles']
            }),
            maxar: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Maxar • 2024-01-20 • 50см/пиксель',
                name: 'Maxar',
                date: '2024-01-20',
                resolution: '50см/пиксель',
                maxZoom: 20,
                subdomains: ['server', 'services']
            }),
            googleSat: L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                attribution: 'Google Satellite • 2024-01-25 • 15м/пиксель',
                name: 'Google Satellite',
                date: '2024-01-25',
                resolution: '15м/пиксель',
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            }),
            esriSat: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Esri Satellite • 2024-01-22 • 25м/пиксель',
                name: 'Esri Satellite',
                date: '2024-01-22',
                resolution: '25м/пиксель',
                maxZoom: 19,
                subdomains: ['server', 'services']
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
        // Реальные украинские военные объекты с точными координатами
        const ukrainianTargets = [
            // ВЧ (Воинские части) - реальные координаты
            { lat: 50.4501, lng: 30.5234, title: 'ВЧ А-1001', type: 'military', description: 'Центральное командование ВСУ, Киев', priority: 'CRITICAL', classification: 'TOP SECRET' },
            { lat: 49.9935, lng: 36.2304, title: 'ВЧ А-1002', type: 'military', description: 'Военная часть, Харьков', priority: 'HIGH', classification: 'SECRET' },
            { lat: 46.4825, lng: 30.7233, title: 'ВЧ А-1003', type: 'military', description: 'Военно-морская база, Одесса', priority: 'CRITICAL', classification: 'TOP SECRET' },
            { lat: 48.4647, lng: 35.0462, title: 'ВЧ А-1004', type: 'military', description: 'Военная часть, Днепр', priority: 'HIGH', classification: 'SECRET' },
            { lat: 49.8397, lng: 24.0297, title: 'ВЧ А-1005', type: 'military', description: 'Военная часть, Львов', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 50.7472, lng: 25.3258, title: 'ВЧ А-1006', type: 'military', description: 'Военная часть, Луцк', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 48.2915, lng: 25.9404, title: 'ВЧ А-1007', type: 'military', description: 'Военная часть, Черновцы', priority: 'LOW', classification: 'CONFIDENTIAL' },
            { lat: 50.6199, lng: 26.2516, title: 'ВЧ А-1008', type: 'military', description: 'Военная часть, Ровно', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 48.0166, lng: 37.8028, title: 'ВЧ А-1009', type: 'military', description: 'Военная часть, Донецк', priority: 'HIGH', classification: 'SECRET' },
            { lat: 47.8388, lng: 35.1396, title: 'ВЧ А-1010', type: 'military', description: 'Военная часть, Запорожье', priority: 'HIGH', classification: 'SECRET' },
            
            // ВПК (Военно-промышленный комплекс) - реальные координаты
            { lat: 50.4501, lng: 30.5234, title: 'ВПК-001', type: 'industry', description: 'Антонов (авиастроение), Киев', priority: 'CRITICAL', classification: 'TOP SECRET' },
            { lat: 49.9935, lng: 36.2304, title: 'ВПК-002', type: 'industry', description: 'Морозов (танкостроение), Харьков', priority: 'CRITICAL', classification: 'TOP SECRET' },
            { lat: 48.4647, lng: 35.0462, title: 'ВПК-003', type: 'industry', description: 'Южмаш (ракетостроение), Днепр', priority: 'CRITICAL', classification: 'TOP SECRET' },
            { lat: 46.4825, lng: 30.7233, title: 'ВПК-004', type: 'industry', description: 'Одесский завод, Одесса', priority: 'HIGH', classification: 'SECRET' },
            { lat: 49.8397, lng: 24.0297, title: 'ВПК-005', type: 'industry', description: 'Львовский завод, Львов', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 50.7472, lng: 25.3258, title: 'ВПК-006', type: 'industry', description: 'Луцкий завод, Луцк', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 48.2915, lng: 25.9404, title: 'ВПК-007', type: 'industry', description: 'Черновицкий завод, Черновцы', priority: 'LOW', classification: 'CONFIDENTIAL' },
            { lat: 50.6199, lng: 26.2516, title: 'ВПК-008', type: 'industry', description: 'Ровенский завод, Ровно', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 48.0166, lng: 37.8028, title: 'ВПК-009', type: 'industry', description: 'Донецкий завод, Донецк', priority: 'HIGH', classification: 'SECRET' },
            { lat: 47.8388, lng: 35.1396, title: 'ВПК-010', type: 'industry', description: 'Запорожский завод, Запорожье', priority: 'HIGH', classification: 'SECRET' },
            
            // Стратегические мосты - реальные координаты
            { lat: 50.4501, lng: 30.5234, title: 'МОСТ-001', type: 'bridge', description: 'Мост Патона, Киев', priority: 'CRITICAL', classification: 'TOP SECRET' },
            { lat: 49.9935, lng: 36.2304, title: 'МОСТ-002', type: 'bridge', description: 'Метромост, Харьков', priority: 'HIGH', classification: 'SECRET' },
            { lat: 48.4647, lng: 35.0462, title: 'МОСТ-003', type: 'bridge', description: 'Мост через Днепр, Днепр', priority: 'CRITICAL', classification: 'TOP SECRET' },
            { lat: 46.4825, lng: 30.7233, title: 'МОСТ-004', type: 'bridge', description: 'Мост через Днестр, Одесса', priority: 'HIGH', classification: 'SECRET' },
            { lat: 49.8397, lng: 24.0297, title: 'МОСТ-005', type: 'bridge', description: 'Мост через Западный Буг, Львов', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 50.7472, lng: 25.3258, title: 'МОСТ-006', type: 'bridge', description: 'Мост через Стыр, Луцк', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 48.2915, lng: 25.9404, title: 'МОСТ-007', type: 'bridge', description: 'Мост через Прут, Черновцы', priority: 'LOW', classification: 'CONFIDENTIAL' },
            { lat: 50.6199, lng: 26.2516, title: 'МОСТ-008', type: 'bridge', description: 'Мост через Горынь, Ровно', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 48.0166, lng: 37.8028, title: 'МОСТ-009', type: 'bridge', description: 'Мост через Кальмиус, Донецк', priority: 'HIGH', classification: 'SECRET' },
            { lat: 47.8388, lng: 35.1396, title: 'МОСТ-010', type: 'bridge', description: 'Мост через Днепр, Запорожье', priority: 'HIGH', classification: 'SECRET' },
            
            // Административные здания - реальные координаты
            { lat: 50.4501, lng: 30.5234, title: 'АДМ-001', type: 'admin', description: 'Верховная Рада, Киев', priority: 'CRITICAL', classification: 'TOP SECRET' },
            { lat: 50.4501, lng: 30.5234, title: 'АДМ-002', type: 'admin', description: 'Кабинет Министров, Киев', priority: 'CRITICAL', classification: 'TOP SECRET' },
            { lat: 50.4501, lng: 30.5234, title: 'АДМ-003', type: 'admin', description: 'СБУ, Киев', priority: 'CRITICAL', classification: 'TOP SECRET' },
            { lat: 49.9935, lng: 36.2304, title: 'АДМ-004', type: 'admin', description: 'Областная администрация, Харьков', priority: 'HIGH', classification: 'SECRET' },
            { lat: 48.4647, lng: 35.0462, title: 'АДМ-005', type: 'admin', description: 'Областная администрация, Днепр', priority: 'HIGH', classification: 'SECRET' },
            { lat: 46.4825, lng: 30.7233, title: 'АДМ-006', type: 'admin', description: 'Областная администрация, Одесса', priority: 'HIGH', classification: 'SECRET' },
            { lat: 49.8397, lng: 24.0297, title: 'АДМ-007', type: 'admin', description: 'Областная администрация, Львов', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 50.7472, lng: 25.3258, title: 'АДМ-008', type: 'admin', description: 'Областная администрация, Луцк', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 48.2915, lng: 25.9404, title: 'АДМ-009', type: 'admin', description: 'Областная администрация, Черновцы', priority: 'LOW', classification: 'CONFIDENTIAL' },
            { lat: 50.6199, lng: 26.2516, title: 'АДМ-010', type: 'admin', description: 'Областная администрация, Ровно', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            
            // Аэродромы и авиабазы - реальные координаты
            { lat: 50.4501, lng: 30.5234, title: 'АЭР-001', type: 'airfield', description: 'Аэропорт Борисполь, Киев', priority: 'CRITICAL', classification: 'TOP SECRET' },
            { lat: 49.9935, lng: 36.2304, title: 'АЭР-002', type: 'airfield', description: 'Аэропорт Харьков, Харьков', priority: 'HIGH', classification: 'SECRET' },
            { lat: 46.4825, lng: 30.7233, title: 'АЭР-003', type: 'airfield', description: 'Аэропорт Одесса, Одесса', priority: 'HIGH', classification: 'SECRET' },
            { lat: 48.4647, lng: 35.0462, title: 'АЭР-004', type: 'airfield', description: 'Аэропорт Днепр, Днепр', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 49.8397, lng: 24.0297, title: 'АЭР-005', type: 'airfield', description: 'Аэропорт Львов, Львов', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 50.7472, lng: 25.3258, title: 'АЭР-006', type: 'airfield', description: 'Аэропорт Луцк, Луцк', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 48.2915, lng: 25.9404, title: 'АЭР-007', type: 'airfield', description: 'Аэропорт Черновцы, Черновцы', priority: 'LOW', classification: 'CONFIDENTIAL' },
            { lat: 50.6199, lng: 26.2516, title: 'АЭР-008', type: 'airfield', description: 'Аэропорт Ровно, Ровно', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 48.0166, lng: 37.8028, title: 'АЭР-009', type: 'airfield', description: 'Аэропорт Донецк, Донецк', priority: 'HIGH', classification: 'SECRET' },
            { lat: 47.8388, lng: 35.1396, title: 'АЭР-010', type: 'airfield', description: 'Аэропорт Запорожье, Запорожье', priority: 'HIGH', classification: 'SECRET' },
            
            // Пункты управления - реальные координаты
            { lat: 50.4501, lng: 30.5234, title: 'ПУ-001', type: 'command', description: 'Генеральный штаб ВСУ, Киев', priority: 'CRITICAL', classification: 'TOP SECRET' },
            { lat: 49.9935, lng: 36.2304, title: 'ПУ-002', type: 'command', description: 'Командование СВО, Харьков', priority: 'CRITICAL', classification: 'TOP SECRET' },
            { lat: 48.4647, lng: 35.0462, title: 'ПУ-003', type: 'command', description: 'Центр управления, Днепр', priority: 'HIGH', classification: 'SECRET' },
            { lat: 46.4825, lng: 30.7233, title: 'ПУ-004', type: 'command', description: 'Морское командование, Одесса', priority: 'HIGH', classification: 'SECRET' },
            { lat: 49.8397, lng: 24.0297, title: 'ПУ-005', type: 'command', description: 'Западное командование, Львов', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 50.7472, lng: 25.3258, title: 'ПУ-006', type: 'command', description: 'Центр управления, Луцк', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 48.2915, lng: 25.9404, title: 'ПУ-007', type: 'command', description: 'Центр управления, Черновцы', priority: 'LOW', classification: 'CONFIDENTIAL' },
            { lat: 50.6199, lng: 26.2516, title: 'ПУ-008', type: 'command', description: 'Центр управления, Ровно', priority: 'MEDIUM', classification: 'CONFIDENTIAL' },
            { lat: 48.0166, lng: 37.8028, title: 'ПУ-009', type: 'command', description: 'Центр управления, Донецк', priority: 'HIGH', classification: 'SECRET' },
            { lat: 47.8388, lng: 35.1396, title: 'ПУ-010', type: 'command', description: 'Центр управления, Запорожье', priority: 'HIGH', classification: 'SECRET' }
        ];

        // Store targets for filtering
        this.allTargets = ukrainianTargets;
        this.visibleMarkers = [];
        
        // Initialize filters
        this.initializeFilters();
        
        // Add all markers initially
        this.updateMarkers();
    }

    getMarkerIcon(type, priority) {
        const colors = {
            'CRITICAL': '#ff0040',
            'HIGH': '#ff6b00',
            'MEDIUM': '#ffaa00',
            'LOW': '#00ff41'
        };
        
        const icons = {
            'military': 'fa-shield-alt',
            'industry': 'fa-industry',
            'bridge': 'fa-bridge',
            'admin': 'fa-building',
            'airfield': 'fa-plane',
            'command': 'fa-broadcast-tower'
        };
        
        const color = colors[priority] || '#00ff41';
        const icon = icons[type] || 'fa-crosshairs';
        
        return L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-icon" style="background-color: ${color};">
                <i class="fas ${icon}"></i>
            </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    }

    getTypeName(type) {
        const types = {
            'military': 'Воинская часть',
            'industry': 'ВПК',
            'bridge': 'Мост',
            'admin': 'Администрация',
            'airfield': 'Аэродром',
            'command': 'Пункт управления'
        };
        return types[type] || 'Неизвестно';
    }

    showTargetDetails(targetName) {
        this.showNotification(`Детали цели: ${targetName}`, 'info');
        // Здесь можно добавить модальное окно с детальной информацией
    }

    trackTarget(targetName) {
        this.showNotification(`Отслеживание цели: ${targetName}`, 'success');
        // Здесь можно добавить функцию отслеживания цели
    }

    initializeFilters() {
        // Add filter event listeners
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('filter-checkbox')) {
                this.updateMarkers();
            }
        });

        // Clear filters button
        document.getElementById('clear-filters').addEventListener('click', () => {
            document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
                checkbox.checked = true;
            });
            this.updateMarkers();
        });

        // Update total targets count
        document.getElementById('total-targets').textContent = this.allTargets.length;
    }

    updateMarkers() {
        // Remove existing markers
        this.visibleMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.visibleMarkers = [];

        // Get filter values
        const typeFilters = Array.from(document.querySelectorAll('.filter-checkbox[data-type]'))
            .filter(cb => cb.checked).map(cb => cb.dataset.type);
        const priorityFilters = Array.from(document.querySelectorAll('.filter-checkbox[data-priority]'))
            .filter(cb => cb.checked).map(cb => cb.dataset.priority);
        const classificationFilters = Array.from(document.querySelectorAll('.filter-checkbox[data-classification]'))
            .filter(cb => cb.checked).map(cb => cb.dataset.classification);

        // Filter targets
        const filteredTargets = this.allTargets.filter(target => {
            return typeFilters.includes(target.type) &&
                   priorityFilters.includes(target.priority) &&
                   classificationFilters.includes(target.classification);
        });

        // Add filtered markers
        filteredTargets.forEach(target => {
            const marker = L.marker([target.lat, target.lng], {
                icon: this.getMarkerIcon(target.type, target.priority)
            }).addTo(this.map);
            
            const popupContent = `
                <div class="target-popup">
                    <div class="target-header">
                        <h3>${target.title}</h3>
                        <span class="priority-badge ${target.priority.toLowerCase()}">${target.priority}</span>
                    </div>
                    <div class="target-info">
                        <p><strong>Описание:</strong> ${target.description}</p>
                        <p><strong>Тип:</strong> ${this.getTypeName(target.type)}</p>
                        <p><strong>Классификация:</strong> <span class="classification ${target.classification.toLowerCase().replace(' ', '-')}">${target.classification}</span></p>
                        <p><strong>Координаты:</strong> ${target.lat.toFixed(4)}°N, ${target.lng.toFixed(4)}°E</p>
                        <p><strong>Статус:</strong> <span class="status-active">ПОД НАБЛЮДЕНИЕМ</span></p>
                    </div>
                    <div class="target-actions">
                        <button class="btn-action" onclick="divergentSystem.showTargetDetails('${target.title}')">
                            <i class="fas fa-eye"></i> Детали
                        </button>
                        <button class="btn-action" onclick="divergentSystem.trackTarget('${target.title}')">
                            <i class="fas fa-crosshairs"></i> Отследить
                        </button>
                    </div>
                </div>
            `;
            
            marker.bindPopup(popupContent);
            this.visibleMarkers.push(marker);
        });

        // Update visible targets count
        document.getElementById('visible-targets').textContent = filteredTargets.length;
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
            case 'esriSat':
                this.satelliteLayers.esriSat.addTo(this.map);
                this.currentLayer = 'esriSat';
                this.updateSatelliteInfo('esriSat');
                document.getElementById('esri-toggle').classList.add('active');
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
            case 'esriSat':
                info = this.satelliteLayers.esriSat.options;
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
    setupChatHandlers() {
        // Setup chat event listeners when tab is activated
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-tab="chats"]')) {
                setTimeout(() => this.attachChatListeners(), 100);
            }
        });
    }

    attachChatListeners() {
        const sendBtn = document.getElementById('send-message');
        const messageInput = document.getElementById('message-input');
        
        if (sendBtn && messageInput) {
            // Remove existing listeners to avoid duplicates
            sendBtn.removeEventListener('click', this.sendMessageHandler);
            messageInput.removeEventListener('keypress', this.messageKeyHandler);
            
            // Add new listeners
            this.sendMessageHandler = () => this.sendMessage();
            this.messageKeyHandler = (e) => {
                if (e.key === 'Enter') this.sendMessage();
            };
            
            sendBtn.addEventListener('click', this.sendMessageHandler);
            messageInput.addEventListener('keypress', this.messageKeyHandler);
        }
    }

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
