// Starter React App for OnaLingo Demo UI
// 1. Login + JWT token
// 2. Lesson List with level
// 3. Lesson Detail (audio + transcript)

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [form, setForm] = useState({ username: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/token/', form);
      setToken(res.data.access);
    } catch (err) {
      alert('Giriş başarısız');
    }
  };

  const fetchLessons = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/lessons/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLessons(res.data);
  };

  useEffect(() => {
    if (token) fetchLessons();
  }, [token]);

  if (!token) {
    return (
      <div className="p-4 max-w-sm mx-auto">
        <h1 className="text-xl font-bold mb-4">OnaLingo Giriş</h1>
        <form onSubmit={handleLogin} className="space-y-2">
          <input
            className="border p-2 w-full"
            placeholder="Kullanıcı adı"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            className="border p-2 w-full"
            placeholder="Şifre"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
            Giriş Yap
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">📚 Dersler</h2>
      {!selectedLesson ? (
        <ul className="space-y-2">
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              className="border p-4 rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => setSelectedLesson(lesson)}
            >
              <strong>{lesson.title}</strong> – {lesson.level}
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-4">
          <button onClick={() => setSelectedLesson(null)} className="text-blue-600 underline">
            ← Geri dön
          </button>
          <h3 className="text-xl font-bold">🎧 {selectedLesson.title}</h3>
          <audio controls src={selectedLesson.audio_url} className="w-full" />
          <p className="bg-gray-100 p-3 rounded whitespace-pre-wrap">
            {selectedLesson.transcript}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
