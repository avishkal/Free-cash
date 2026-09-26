const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// දත්ත ගබඩාව (පරිශීලක විස්තර සඳහා)
let users = {};

// දැන්වීම් ලැයිස්තුව (මෙහි ඔබට Ad Network එකක Ad Codes හෝ බාහිර දැන්වීම් ලින්ක් දමාගත හැක)
let ads = [
    { id: 1, title: "Crypto Exchange Banner Ad", reward: 2.00, duration: 5, adUrl: "https://example.com/ad1" },
    { id: 2, title: "Online Shopping Promo Ad", reward: 1.50, duration: 5, adUrl: "https://example.com/ad2" },
    { id: 3, title: "Web Hosting Special Offer", reward: 2.50, duration: 5, adUrl: "https://example.com/ad3" }
];

// --- API ROUTES ---

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ success: false, message: "කරුණාකර සියලුම තොරතුරු ඇතුළත් කරන්න!" });
    }
    if (users[username]) {
        return res.json({ success: false, message: "මෙම නමින් දැනටමත් ගිණුමක් ඇත!" });
    }
    users[username] = { password, balance: 0.00 };
    res.json({ success: true, message: "ලියාපදිංචිය සාර්ථකයි!" });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username].password === password) {
        res.json({ success: true, username, balance: users[username].balance });
    } else {
        res.json({ success: false, message: "පරිශීලක නාමය හෝ මුරපදය වැරදිය!" });
    }
});

app.get('/api/ads', (req, res) => {
    res.json(ads);
});

app.post('/api/watch-ad', (req, res) => {
    const { username, adId } = req.body;
    if (!users[username]) {
        return res.json({ success: false, message: "පරිශීලකයා හමු නොවීය." });
    }
    const ad = ads.find(a => a.id === adId);
    if (!ad) {
        return res.json({ success: false, message: "දැන්වීම හමු නොවීය." });
    }

    users[username].balance += ad.reward;
    res.json({ success: true, newBalance: users[username].balance, reward: ad.reward });
});


// --- FRONTEND (HTML / CSS / JS) ---
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="si">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PTC Earn Money Website</title>
            <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body class="bg-gray-100 font-sans flex justify-center items-center min-h-screen">

            <div class="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
                
                <!-- AUTHENTICATION SECTION -->
                <div id="auth-section">
                    <h1 class="text-2xl font-bold text-center text-blue-600 mb-2">PTC Earn Money</h1>
                    <p class="text-xs text-center text-gray-500 mb-6">Ads බලා ආදායම් උපයන වේදිකාව</p>
                    
                    <div class="flex mb-4 border-b">
                        <button onclick="switchTab('login')" id="login-tab" class="w-1/2 py-2 font-bold text-blue-600 border-b-2 border-blue-600 cursor-pointer">Login</button>
                        <button onclick="switchTab('register')" id="register-tab" class="w-1/2 py-2 font-bold text-gray-400 cursor-pointer">Register</button>
                    </div>

                    <!-- Login Form -->
                    <div id="login-form" class="space-y-4">
                        <input type="text" id="login-username" placeholder="පරිශීලක නාමය" class="w-full p-3 border rounded">
                        <input type="password" id="login-password" placeholder="මුරපදය" class="w-full p-3 border rounded">
                        <button onclick="loginUser()" class="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 cursor-pointer">Login</button>
                    </div>

                    <!-- Register Form -->
                    <div id="register-form" class="space-y-4 hidden">
                        <input type="text" id="reg-username" placeholder="පරිශීලක නාමය" class="w-full p-3 border rounded">
                        <input type="password" id="reg-password" placeholder="මුරපදය" class="w-full p-3 border rounded">
                        <button onclick="registerUser()" class="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 cursor-pointer">Register</button>
                    </div>
                </div>

                <!-- DASHBOARD SECTION -->
                <div id="dashboard-section" class="hidden">
                    <div class="flex justify-between items-center mb-4">
                        <h1 class="text-xl font-bold text-blue-600">ডෑෂ්බෝඩ්</h1>
                        <button onclick="logoutUser()" class="text-red-500 text-sm font-bold border border-red-500 px-3 py-1 rounded hover:bg-red-50 cursor-pointer">Logout</button>
                    </div>
                    
                    <div class="bg-blue-50 p-4 rounded-md mb-6">
                        <p class="text-gray-600">පරිශීලකයා: <span id="dash-username" class="font-bold text-gray-800"></span></p>
                        <p class="text-gray-600">ඔබේ ඉපැයීම් ශේෂය: LKR <span id="dash-balance" class="font-bold text-green-600">0.00</span></p>
                    </div>

                    <div class="bg-amber-50 border border-amber-200 p-3 rounded-md mb-6 text-xs text-amber-800">
                        💡 <b>Admin සටහන:</b> මෙම වෙබ් අඩවියේ ඇති දැන්වීම් හරහා ලැබෙන ප්‍රධාන ආදායම ඔබ සම්බන්ධ කර ඇති Ad Network ගිණුම හරහා ඔබේ බැංකු ගිණුමට එකතු වේ.
                    </div>

                    <h2 class="text-lg font-semibold mb-3">නරඹන්න ඇති දැන්වීම්</h2>
                    <div id="ads-container" class="space-y-3 max-h-60 overflow-y-auto"></div>
                </div>

            </div>

            <!-- Ad Timer Modal -->
            <div id="modal" class="hidden fixed inset-0 bg-black/50 flex justify-center items-center">
                <div class="bg-white p-6 rounded-lg max-w-sm w-full text-center shadow-xl">
                    <h3 class="text-lg font-bold mb-2">දැන්වීම නරඹමින් පවතී...</h3>
                    <p id="timer" class="text-4xl font-bold text-blue-600 my-4">5</p>
                    <p class="text-sm text-gray-500">ටයිමර් එක අවසන් වනතුරු රැඳී සිටින්න.</p>
                </div>
            </div>

            <script>
                let currentUser = localStorage.getItem('ptc_user') || null;
                let currentBalance = parseFloat(localStorage.getItem('ptc_balance')) || 0.00;

                function switchTab(tab) {
                    if (tab === 'login') {
                        document.getElementById('login-form').classList.remove('hidden');
                        document.getElementById('register-form').classList.add('hidden');
                        document.getElementById('login-tab').className = "w-1/2 py-2 font-bold text-blue-600 border-b-2 border-blue-600 cursor-pointer";
                        document.getElementById('register-tab').className = "w-1/2 py-2 font-bold text-gray-400 cursor-pointer";
                    } else {
                        document.getElementById('login-form').classList.add('hidden');
                        document.getElementById('register-form').classList.remove('hidden');
                        document.getElementById('register-tab').className = "w-1/2 py-2 font-bold text-green-600 border-b-2 border-green-600 cursor-pointer";
                        document.getElementById('login-tab').className = "w-1/2 py-2 font-bold text-gray-400 cursor-pointer";
                    }
                }

                async function registerUser() {
                    const username = document.getElementById('reg-username').value.trim();
                    const password = document.getElementById('reg-password').value.trim();
                    
                    const res = await fetch('/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });
                    const data = await res.json();
                    alert(data.message);
                    if (data.success) switchTab('login');
                }

                async function loginUser() {
                    const username = document.getElementById('login-username').value.trim();
                    const password = document.getElementById('login-password').value.trim();

                    const res = await fetch('/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });
                    const data = await res.json();
                    
                    if (data.success) {
                        currentUser = data.username;
                        currentBalance = data.balance;
                        localStorage.setItem('ptc_user', currentUser);
                        localStorage.setItem('ptc_balance', currentBalance);
                        loadDashboard();
                    } else {
                        alert(data.message);
                    }
                }

                function logoutUser() {
                    currentUser = null;
                    localStorage.removeItem('ptc_user');
                    localStorage.removeItem('ptc_balance');
                    checkAuth();
                }

                function checkAuth() {
                    if (currentUser) {
                        loadDashboard();
                    } else {
                        document.getElementById('auth-section').classList.remove('hidden');
                        document.getElementById('dashboard-section').classList.add('hidden');
                    }
                }

                async function loadDashboard() {
                    document.getElementById('auth-section').classList.add('hidden');
                    document.getElementById('dashboard-section').classList.remove('hidden');
                    document.getElementById('dash-username').innerText = currentUser;
                    document.getElementById('dash-balance').innerText = currentBalance.toFixed(2);
                    
                    const res = await fetch('/api/ads');
                    const ads = await res.json();
                    const container = document.getElementById('ads-container');
                    container.innerHTML = '';

                    ads.forEach(ad => {
                        container.innerHTML += \`
                            <div class="p-3 border rounded flex justify-between items-center bg-gray-50">
                                <div>
                                    <h4 class="font-bold text-sm">\${ad.title}</h4>
                                    <p class="text-xs text-green-600 font-semibold">+ LKR \${ad.reward}</p>
                                </div>
                                <button onclick="watchAd(\${ad.id}, \${ad.duration})" class="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 cursor-pointer">View Ad</button>
                            </div>
                        \`;
                    });
                }

                function watchAd(adId, duration) {
                    const modal = document.getElementById('modal');
                    const timerEl = document.getElementById('timer');
                    modal.classList.remove('hidden');
                    
                    let timeLeft = duration;
                    timerEl.innerText = timeLeft;

                    const interval = setInterval(async () => {
                        timeLeft--;
                        timerEl.innerText = timeLeft;

                        if (timeLeft <= 0) {
                            clearInterval(interval);
                            modal.classList.add('hidden');

                            const res = await fetch('/api/watch-ad', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ username: currentUser, adId })
                            });
                            const data = await res.json();
                            if (data.success) {
                                currentBalance = data.newBalance;
                                localStorage.setItem('ptc_balance', currentBalance);
                                document.getElementById('dash-balance').innerText = currentBalance.toFixed(2);
                                alert(\`සුභ පැතුම්! LKR \${data.reward} ක් එකතු විය.\`);
                            }
                        }
                    }, 1000);
                }

                checkAuth();
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
