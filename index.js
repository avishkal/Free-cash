const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let users = {
    "avishkal907@gmail.com": { password: "avishkal@23", balance: 5.00, isAdmin: true }
};

let withdrawalRequests = []; // බැංකු මුදල් ඉල්ලුම් ගබඩා කිරීමට

let ads = [
    { id: 1, title: "Crypto Exchange Banner Ad", reward: 5.00, duration: 5 },
    { id: 2, title: "Online Shopping Promo Ad", reward: 3.50, duration: 5 },
    { id: 3, title: "Web Hosting Special Offer", reward: 4.00, duration: 5 }
];

// --- API ROUTES ---

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ success: false, message: "කරුණාකර සියලුම තොරතුරු ඇතුළත් කරන්න!" });
    }
    if (users[username]) {
        return res.json({ success: false, message: "මෙම ඊමේල් ලිපිනයෙන් දැනටමත් ගිණුමක් ඇත!" });
    }
    users[username] = { password, balance: 0.00, isAdmin: false };
    res.json({ success: true, message: "ලියාපදිංචිය සාර්ථකයි! දැන් ඔබට Login විය හැක." });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username].password === password) {
        res.json({ 
            success: true, 
            username, 
            balance: users[username].balance,
            isAdmin: users[username].isAdmin 
        });
    } else {
        res.json({ success: false, message: "ඊමේල් ලිපිනය හෝ මුරපදය වැරදිය!" });
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

// බැංකු මුදල් ඉල්ලුම් API එක
app.post('/api/withdraw', (req, res) => {
    const { username, bankName, accName, accNumber, branch } = req.body;
    if (!users[username]) {
        return res.json({ success: false, message: "පරිශීලකයා හමු නොවීය." });
    }

    const balance = users[username].balance;
    if (balance < 100) {
        return res.json({ success: false, message: "මුදල් ලබා ගැනීමට අවම ශේෂය LKR 100.00 ක් විය යුතුය!" });
    }

    withdrawalRequests.push({
        username,
        bankName,
        accName,
        accNumber,
        branch,
        amount: balance,
        date: new Date().toLocaleString()
    });

    users[username].balance = 0.00; // ඉල්ලුම් කළ පසු ශේෂය ශුන්‍ය වේ

    res.json({ success: true, message: "බැංකු මුදල් ඉල්ලුම සාර්ථකව යොමු කරන ලදී!", newBalance: 0.00 });
});


// --- FRONTEND (DARK THEME HTML / CSS / JS) ---
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="si">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PTC Earn Money - Dark Edition</title>
            <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body class="bg-gray-950 text-gray-100 font-sans flex justify-center items-center min-h-screen p-4">

            <div class="max-w-md w-full bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-2xl">
                
                <!-- AUTHENTICATION SECTION -->
                <div id="auth-section">
                    <h1 class="text-3xl font-extrabold text-center text-indigo-400 mb-1">PTC Earn Money</h1>
                    <p class="text-xs text-center text-gray-400 mb-6">Ads නරඹමින් ආදායම් උපයන වේදිකාව</p>
                    
                    <div class="flex mb-6 border-b border-gray-800">
                        <button onclick="switchTab('login')" id="login-tab" class="w-1/2 py-2 font-bold text-indigo-400 border-b-2 border-indigo-500 cursor-pointer">Login</button>
                        <button onclick="switchTab('register')" id="register-tab" class="w-1/2 py-2 font-bold text-gray-500 cursor-pointer">Register</button>
                    </div>

                    <!-- Login Form -->
                    <div id="login-form" class="space-y-4">
                        <div>
                            <label class="text-xs text-gray-400 mb-1 block">Email (Admin හෝ User)</label>
                            <input type="email" id="login-username" placeholder="name@example.com" class="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-indigo-500">
                        </div>
                        <div>
                            <label class="text-xs text-gray-400 mb-1 block">Password</label>
                            <input type="password" id="login-password" placeholder="••••••••" class="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-indigo-500">
                        </div>
                        <button onclick="loginUser()" class="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-500 transition cursor-pointer">Login</button>
                        
                        <div class="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-800 text-xs text-gray-400">
                            <span class="text-indigo-400 font-bold">Admin Login:</span><br>
                            Email: <code class="text-gray-200">avishkal907@gmail.com</code><br>
                            Pass: <code class="text-gray-200">avishkal@23</code>
                        </div>
                    </div>

                    <!-- Register Form -->
                    <div id="register-form" class="space-y-4 hidden">
                        <div>
                            <label class="text-xs text-gray-400 mb-1 block">Email Address</label>
                            <input type="email" id="reg-username" placeholder="name@example.com" class="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-emerald-500">
                        </div>
                        <div>
                            <label class="text-xs text-gray-400 mb-1 block">Password</label>
                            <input type="password" id="reg-password" placeholder="••••••••" class="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-emerald-500">
                        </div>
                        <button onclick="registerUser()" class="w-full bg-emerald-600 text-white p-3 rounded-lg font-bold hover:bg-emerald-500 transition cursor-pointer">Create Account</button>
                    </div>
                </div>

                <!-- DASHBOARD SECTION -->
                <div id="dashboard-section" class="hidden">
                    <div class="flex justify-between items-center mb-6">
                        <h1 class="text-xl font-bold text-indigo-400">ඩෑෂ්බෝඩ්</h1>
                        <button onclick="logoutUser()" class="text-rose-400 text-xs font-bold border border-rose-500/50 px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition cursor-pointer">Logout</button>
                    </div>
                    
                    <div class="bg-gray-800/60 border border-gray-800 p-4 rounded-xl mb-4 space-y-1">
                        <p class="text-xs text-gray-400">පරිශීලකයා: <span id="dash-username" class="font-bold text-gray-200"></span></p>
                        <p class="text-xs text-gray-400">ශේෂය (Balance): <span class="font-bold text-emerald-400 text-base">LKR <span id="dash-balance">0.00</span></span></p>
                        <div id="admin-badge" class="hidden pt-1">
                            <span class="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">Admin Account</span>
                        </div>
                    </div>

                    <!-- Withdraw Button -->
                    <button onclick="openWithdrawModal()" class="w-full bg-purple-600 text-white py-2.5 rounded-lg font-bold text-sm mb-6 hover:bg-purple-500 transition cursor-pointer shadow-lg shadow-purple-900/30">බැංකුවට මුදල් ඉල්ලා සිටින්න (Withdraw)</button>

                    <h2 class="text-sm font-semibold text-gray-300 mb-3">නරඹන්න ඇති දැන්වීම්</h2>
                    <div id="ads-container" class="space-y-3 max-h-60 overflow-y-auto pr-1"></div>
                </div>

            </div>

            <!-- Ad Timer Modal -->
            <div id="modal" class="hidden fixed inset-0 bg-black/80 backdrop-blur-xs flex justify-center items-center p-4">
                <div class="bg-gray-900 border border-gray-800 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl">
                    <h3 class="text-base font-bold text-gray-200 mb-1">දැන්වීම නරඹමින් පවතී...</h3>
                    <p id="timer" class="text-5xl font-black text-indigo-400 my-4">5</p>
                    <p class="text-xs text-gray-400">ටයිමර් එක අවසන් වනතුරු මෙම කවුළුවේ රැඳී සිටින්න.</p>
                </div>
            </div>

            <!-- Bank Withdraw Modal -->
            <div id="withdraw-modal" class="hidden fixed inset-0 bg-black/80 backdrop-blur-xs flex justify-center items-center p-4">
                <div class="bg-gray-900 border border-gray-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl space-y-3">
                    <h3 class="text-base font-bold text-purple-400">බැංකු ගිණුම් විස්තර</h3>
                    <p class="text-[11px] text-gray-400">අවම මුදල් ඉල්ලුම් කිරීමේ සීමාව LKR 100.00 කි.</p>
                    
                    <div>
                        <label class="text-[11px] text-gray-400 block mb-1">බැංකුවේ නම (Bank Name)</label>
                        <input type="text" id="bank-name" placeholder="உദാ: BOC / Commercial Bank" class="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs">
                    </div>
                    <div>
                        <label class="text-[11px] text-gray-400 block mb-1">ගිණුම් හිමියාගේ නම</label>
                        <input type="text" id="acc-name" placeholder="Account Holder Name" class="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs">
                    </div>
                    <div>
                        <label class="text-[11px] text-gray-400 block mb-1">ගිණුම් අංකය</label>
                        <input type="text" id="acc-number" placeholder="Account Number" class="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs">
                    </div>
                    <div>
                        <label class="text-[11px] text-gray-400 block mb-1">ශාഖාව (Branch)</label>
                        <input type="text" id="branch" placeholder="Branch Name" class="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs">
                    </div>
                    
                    <div class="flex space-x-2 pt-2">
                        <button onclick="submitWithdraw()" class="w-1/2 bg-emerald-600 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-emerald-500 cursor-pointer">ඉල්ලුම් කරන්න</button>
                        <button onclick="closeWithdrawModal()" class="w-1/2 bg-gray-700 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-gray-600 cursor-pointer">අවලංගුයි</button>
                    </div>
                </div>
            </div>

            <script>
                let currentUser = localStorage.getItem('ptc_user') || null;
                let currentBalance = parseFloat(localStorage.getItem('ptc_balance')) || 0.00;
                let isAdmin = localStorage.getItem('ptc_is_admin') === 'true';

                function switchTab(tab) {
                    if (tab === 'login') {
                        document.getElementById('login-form').classList.remove('hidden');
                        document.getElementById('register-form').classList.add('hidden');
                        document.getElementById('login-tab').className = "w-1/2 py-2 font-bold text-indigo-400 border-b-2 border-indigo-500 cursor-pointer";
                        document.getElementById('register-tab').className = "w-1/2 py-2 font-bold text-gray-500 cursor-pointer";
                    } else {
                        document.getElementById('login-form').classList.add('hidden');
                        document.getElementById('register-form').classList.remove('hidden');
                        document.getElementById('register-tab').className = "w-1/2 py-2 font-bold text-emerald-400 border-b-2 border-emerald-500 cursor-pointer";
                        document.getElementById('login-tab').className = "w-1/2 py-2 font-bold text-gray-500 cursor-pointer";
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
                        isAdmin = data.isAdmin;
                        
                        localStorage.setItem('ptc_user', currentUser);
                        localStorage.setItem('ptc_balance', currentBalance);
                        localStorage.setItem('ptc_is_admin', isAdmin);
                        loadDashboard();
                    } else {
                        alert(data.message);
                    }
                }

                function logoutUser() {
                    currentUser = null;
                    currentBalance = 0.00;
                    isAdmin = false;
                    localStorage.clear();
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
                    
                    if (isAdmin) {
                        document.getElementById('admin-badge').classList.remove('hidden');
                    } else {
                        document.getElementById('admin-badge').classList.add('hidden');
                    }
                    
                    const res = await fetch('/api/ads');
                    const ads = await res.json();
                    const container = document.getElementById('ads-container');
                    container.innerHTML = '';

                    ads.forEach(ad => {
                        container.innerHTML += \`
                            <div class="p-3 bg-gray-800/40 border border-gray-800 rounded-lg flex justify-between items-center hover:bg-gray-800 transition">
                                <div>
                                    <h4 class="font-bold text-xs text-gray-200">\${ad.title}</h4>
                                    <p class="text-[11px] text-emerald-400 font-semibold mt-0.5">+ LKR \${ad.reward}</p>
                                </div>
                                <button onclick="watchAd(\${ad.id}, \${ad.duration})" class="bg-indigo-600 text-white px-3 py-1.5 text-xs font-bold rounded-md hover:bg-indigo-500 transition cursor-pointer">View Ad</button>
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

                function openWithdrawModal() {
                    if (currentBalance < 100) {
                        alert("මුදල් ලබා ගැනීමට අවම ශේෂය LKR 100.00 ක් විය යුතුය!");
                        return;
                    }
                    document.getElementById('withdraw-modal').classList.remove('hidden');
                }

                function closeWithdrawModal() {
                    document.getElementById('withdraw-modal').classList.add('hidden');
                }

                async function submitWithdraw() {
                    const bankName = document.getElementById('bank-name').value.trim();
                    const accName = document.getElementById('acc-name').value.trim();
                    const accNumber = document.getElementById('acc-number').value.trim();
                    const branch = document.getElementById('branch').value.trim();

                    if (!bankName || !accName || !accNumber || !branch) {
                        alert("කරුණාකර සියලුම බැංකු තොරතුරු පුරවන්න!");
                        return;
                    }

                    const res = await fetch('/api/withdraw', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: currentUser, bankName, accName, accNumber, branch })
                    });
                    const data = await res.json();
                    alert(data.message);
                    if (data.success) {
                        currentBalance = data.newBalance;
                        localStorage.setItem('ptc_balance', currentBalance);
                        document.getElementById('dash-balance').innerText = currentBalance.toFixed(2);
                        closeWithdrawModal();
                    }
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
