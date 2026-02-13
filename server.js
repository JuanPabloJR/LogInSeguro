const crypto = require('crypto');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const users = {};

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required.' });
    }
    if (users[username]) {
        return res.status(400).json({ message: 'User already exists.' });
    }
    registerUser(username, password);
    res.status(201).json({ message: 'User registered successfully.' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required.' });
    }
    if (loginUser(username, password)) {
        res.json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ message: 'Invalid username or password.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT}/index.html`);
});

function registerUser(username, password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .createHash('sha256')
    .update(password + salt)
    .digest('hex');
  users[username] = { salt, hash };
  console.log(`User ${username} registered successfully.`);
  console.log(users);
}

function loginUser(username, password) {
    const user = users[username];

    if (!user) {
        console.log('User not found.');
        return false;
    }

    const loginHash = crypto
        .createHash('sha256')
        .update(password + user.salt)
        .digest('hex');
    
    if (loginHash === user.hash) {
        console.log('Login successful!');
        return true;
    } else {
        console.log('Invalid password.');
        return false;
    }
}