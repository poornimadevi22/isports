// pages/api/login.js
export default function handler(req, res) {
  const { email, password } = req.body;

  if (email === 'admin@test.com' && password === 'admin@test.com') {
    res.status(200).json({ token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}
