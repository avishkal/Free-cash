const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let users = {
    "avishkal907@gmail.com": { password: "avishkal@23", balance: 14.50, isAdmin: true }
};

let withdrawalRequests = [];

let ads = [
    { 
        id: 1, 
        title: "Crypto Exchange Banner Ad", 
        reward: 5.00, 
        type: "banner",
        content: `<script src="https://pl31523805.profitableratecpmnetwork.com/d5/03/82/d50382b8c9fcd1632430879e8c5ffc14.js"></script>`,
        url: "https://www.profitableratecpmnetwork.com/sa6isizp1?key=16f08e32604d1a72f879384b894d9b64"
    },
    { 
        id: 2, 
        title: "High Revenue Banner Ad (300x250)", 
        reward: 4.00, 
        type: "banner",
        content: `
            <script>
              atOptions = {
                'key' : '2e779619893af02539fc45624ffb5c30',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            </script>
            <script src="https://www.highrevenueformat.com/2e779619893af02539fc45624ffb5c30/invoke.js"></script>
        `,
        url: "https://www.profitableratecpmnetwork.com/sa6isizp1?key=16f08e32604d1a72f879384b894d9b64"
    },
    { 
        id: 3, 
        title: "Social Bar / Native Ad Unit", 
        reward: 6.00, 
        type: "banner",
        content: `
            <script async="async" data-cfasync="false" src="https://pl31523808.profitableratecpmnetwork.com/6fdb76ef128e51cb4508880e53f89b7c/invoke.js"></script>
            <div id="container-6fdb76ef128e51cb4508880e53f89b7c"></div>
        `,
        url: "https://www.profitableratecpmnetwork.com/sa6isizp1?key=16f08e32604d1a72f879384b894d9b64"
    },
    { 
        id: 4, 
        title: "Direct Link Promotional Ad", 
        reward: 4.50, 
        type: "link",
        content: `<p class="text-xs text-gray-400">Click below to visit our promotional partner link.</p>`,
        url: "https://www.profitableratecpmnetwork.com/sa6isizp1?key=16f08e32604d1a72f879384b894d9b64"
    }
];

// --- API ROUTES ---

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ success: false, message: "Please fill in all required fields!" });
    }
    if (users[username]) {
        return res.json({ success: false, message: "An account with this email already exists!" });
    }
    users[username] = { password, balance: 0.00, isAdmin: false };
    res.json({ success: true, message: "Registration successful! You can now log in." });
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
        res.json({ success: false, message: "Invalid email address or password!" });
    }
});

app.get('/api/ads', (req, res) => {
    res.json(ads);
});

app.post('/api/watch-ad', (req, res) => {
    const { username, adId } = req.body;
    if (!users[username]) {
        return res.json({ success: false, message: "User not found." });
    }
    const ad = ads.find(a => a.id === adId);
    if (!ad) {
        return res.json({ success: false, message: "Advertisement not found." });
    }

    users[username].balance += ad.reward;
    res.json({ success: true, newBalance: users[username].balance, reward: ad.reward });
});

app.post('/api/withdraw', (req, res) => {
    const { username, bankName, accName, accNumber, branch } = req.body;
    if (!users[username]) {
        return res.json({ success: false, message: "User not found." });
    }

    const balance = users[username].balance;
    if (balance < 100) {
        return res.json({ success: false, message: "Minimum withdrawal threshold is LKR 100.00!" });
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

    users[username].balance = 0.00;
    res.json({ success: true, message: "Bank withdrawal request submitted successfully!", newBalance: 0.00 });
});


// --- FRONTEND ---
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PTC Earn Money</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-950 text-gray-100 font-sans flex justify-center items-center min-h-screen p-4">

            <div class="max-w-md w-full bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-2xl">
                
                <!-- AUTH SECTION -->
                <div id="auth-section">
                    <h1 class="text-3xl font-extrabold text-center text-indigo-400 mb-1">PTC Earn Money</h1>
                    <p class="text-xs text-center text-gray-400 mb-6">Earn money by viewing online advertisements</p>
                    
                    <div class="flex mb-6 border-b border-gray-800">
                        <button type="button" onclick="switchTab('login')" id="login-tab" class="w-1/2 py-2 font-bold text-indigo-400 border-b-2 border-indigo-500 cursor-pointer">Login</button>
                        <button type="button" onclick="switchTab('register')" id="register-tab" class="w-1/2 py-2 font-bold text-gray-500 cursor-pointer">Register</button>
                    </div>

                    <div id="login-form" class="space-y-4">
                        <div>
                            <label class="text-xs text-gray-400 mb-1 block">Email</label>
                            <input type="email" id="login-username" placeholder="name@example.com" class="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                        </div>
                        <div>
                            <label class="text-xs text-gray-400 mb-1 block">Password</label>
                            <input type="password" id="login-password" placeholder="••••••••" class="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500">
                        </div>
                        <button type="button" onclick="loginUser()" class="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-500 transition cursor-pointer">Login</button>
                    </div>

                    <div id="register-form" class="space-y-4 hidden">
                        <div>
                            <label class="text-xs text-gray-400 mb-1 block">Email Address</label>
                            <input type="email" id="reg-username" placeholder="name@example.com" class="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="text-xs text-gray-400 mb-1 block">Password</label>
                            <input type="password" id="reg-password" placeholder="••••••••" class="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                        </div>
                        <button type="button" onclick="registerUser()" class="w-full bg-emerald-600 text-white p-3 rounded-lg font-bold hover:bg-emerald-500 transition cursor-pointer">Create Account</button>
                    </div>
                </div>

                <!-- DASHBOARD SECTION -->
                <div id="dashboard-section" class="hidden">
                    <div class="flex justify-between items-center mb-6">
                        <h1 class="text-xl font-bold text-indigo-400">Dashboard</h1>
                        <button type="button" onclick="logoutUser()" class="text-rose-400 text-xs font-bold border border-rose-500/50 px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition cursor-pointer">Logout</button>
                    </div>
                    
                    <div class="bg-gray-800/60 border border-gray-800 p-4 rounded-xl mb-4 space-y-1">
                        <p class="text-xs text-gray-400">User: <span id="dash-username" class="font-bold text-gray-200"></span></p>
                        <p class="text-xs text-gray-400">Account Balance: <span class="font-bold text-emerald-400 text-base">LKR <span id="dash-balance">0.00</span></span></p>
                        <div id="admin-badge" class="hidden pt-1">
                            <span class="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">Admin Account</span>
                        </div>
                    </div>

                    <button type="button" onclick="openWithdrawModal()" class="w-full bg-purple-600 text-white py-2.5 rounded-lg font-bold text-sm mb-6 hover:bg-purple-500 transition cursor-pointer shadow-lg shadow-purple-900/30">Request Bank Withdrawal</button>

                    <h2 class="text-sm font-semibold text-gray-300 mb-3">Available Advertisements</h2>
                    <div id="ads-container" class="space-y-4 max-h-80 overflow-y-auto pr-1"></div>
                </div>

            </div>

            <!-- Bank Withdraw Modal -->
            <div id="withdraw-modal" class="hidden fixed inset-0 bg-black/80 flex justify-center items-center p-4 z-50">
                <div class="bg-gray-900 border border-gray-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl space-y-3">
                    <h3 class="text-base font-bold text-purple-400">Bank Account Details</h3>
                    <p class="text-[11px] text-gray-400">Minimum withdrawal limit is LKR 100.00.</p>
                    
                    <div>
                        <label class="text-[11px] text-gray-400 block mb-1">Bank Name</label>
                        <input type="text" id="bank-name" placeholder="e.g., BOC / Commercial Bank" class="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs">
                    </div>
                    <div>
                        <label class="text-[11px] text-gray-400 block mb-1">Account Holder Name</label>
                        <input type="text" id="acc-name" placeholder="Account Holder Name" class="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs">
                    </div>
                    <div>
                        <label class="text-[11px] text-gray-400 block mb-1">Account Number</label>
                        <input type="text" id="acc-number" placeholder="Account Number" class="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs">
                    </div>
                    <div>
                        <label class="text-[11px] text-gray-400 block mb-1">Branch Name</label>
                        <input type="text" id="branch" placeholder="Branch Name" class="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs">
                    </div>
                    
                    <div class="flex space-x-2 pt-2">
                        <button type="button" onclick="submitWithdraw()" class="w-1/2 bg-emerald-600 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-emerald-500 cursor-pointer">Submit</button>
                        <button type="button" onclick="closeWithdrawModal()" class="w-1/2 bg-gray-700 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-gray-600 cursor-pointer">Cancel</button>
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
                    if (!username || !password) { alert("Please fill in all fields!"); return; }

                    try {
                        const res = await fetch('/api/register', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username, password })
                        });
                        const data = await res.json();
                        alert(data.message);
                        if (data.success) switchTab('login');
                    } catch (err) { alert("Connection error!"); }
                }

                async function loginUser() {
                    const username = document.getElementById('login-username').value.trim();
                    const password = document.getElementById('login-password').value.trim();
                    if (!username || !password) { alert("Please fill in all fields!"); return; }

                    try {
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
                        } else { alert(data.message); }
                    } catch (err) { alert("Connection error!"); }
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
                    
                    try {
                        const res = await fetch('/api/ads');
                        const ads = await res.json();
                        const container = document.getElementById('ads-container');
                        container.innerHTML = '';

                        ads.forEach(ad => {
                            container.innerHTML += \`
                                <div class="p-3 bg-gray-800/40 border border-gray-800 rounded-xl space-y-2">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <h4 class="font-bold text-xs text-gray-200">\${ad.title}</h4>
                                            <p class="text-[11px] text-emerald-400 font-semibold mt-0.5">+ LKR \${ad.reward}</p>
                                        </div>
                                        <button onclick="watchAd(\${ad.id}, '\${ad.url}')" class="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer">View Ad</button>
                                    </div>
                                    <div class="my-2 p-2 bg-gray-900 rounded flex justify-center overflow-hidden">
                                        \${ad.content}
                                    </div>
                                </div>
                            \`;
                        });
                    } catch (err) { console.error(err); }
                }

                async function watchAd(adId, url) {
                    if (url) {
                        window.open(url, '_blank');
                    }

                    try {
                        const res = await fetch('/api/watch-ad', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: currentUser, adId: adId })
                        });
                        const data = await res.json();
                        if (data.success) {
                            currentBalance = data.newBalance;
                            localStorage.setItem('ptc_balance', currentBalance);
                            document.getElementById('dash-balance').innerText = currentBalance.toFixed(2);
                            alert("Reward added successfully!");
                        }
                    } catch (err) { console.error(err); }
                }

                function openWithdrawModal() {
                    if (currentBalance < 100) {
                        alert("Minimum withdrawal limit is LKR 100.00!");
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
                        alert("Please fill in all bank details!");
                        return;
                    }

                    try {
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
                    } catch (err) { alert("Connection error!"); }
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
