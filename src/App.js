// OnaLingo Demo UI (sağlamlaştırılmış)
// - Login + JWT (username/password)
// - Lesson list + detail (audio + transcript)
// - Token persistence + 401 handling + loading/error

import React, { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

// axios varsayılan ayar (baseURL)
axios.defaults.baseURL = API;

function setAuthHeader(token) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [form, setForm] = useState({ username: "", password: "" });
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // İlk yüklemede token varsa header’a koy
  useEffect(() => {
    setAuthHeader(token);
  }, []); // sadece mount’ta

  // Token değiştiğinde header’ı güncelle ve dersleri çek
  useEffect(() => {
    setAuthHeader(token);
    fetchLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleLogin(e) {
    e.preventDefault();
    setErrMsg("");
    setLoading(true);
    try {
      const payload = {
        username: form.username.trim(),
        password: form.password, // password'a trim önermem
      };
      const res = await axios.post("/api/token/", payload, {
        headers: { "Content-Type": "application/json" },
      });
      const access = res.data?.access;
      if (access) {
        setToken(access); // useEffect header’ı ayarlayıp dersleri çekecek
      } else {
        setErrMsg("Beklenmeyen yanıt: access token yok.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Giriş başarısız. Bilgileri kontrol edin.";
      setErrMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  async function fetchLessons() {
  setErrMsg("");
  setLoading(true);
  try {
    const res = await axios.get("/api/lessons/");
    setLessons(res.data || []);
  } catch (err) {
    console.log("LESSONS ERROR =>", err?.response?.status, err?.response?.data || err?.message);
    if (err?.response?.status === 401) {
      setToken("");
      setAuthHeader("");
      setErrMsg("Oturum süresi doldu veya yetki yok. Tekrar giriş yapın.");
    } else {
      setErrMsg("Dersler alınamadı.");
    }
  } finally {
    setLoading(false);
  }
}

  function handleLogout() {
    setToken("");
    setAuthHeader("");
    setSelectedLesson(null);
    setForm({ username: "", password: "" });
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">OnaLingo Demo</h1>

        {!token ? (
          <form onSubmit={handleLogin} className="flex gap-2 items-center">
            <input
              className="border p-1"
              placeholder="Kullanıcı adı"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />
            <input
              type="password"
              className="border p-1"
              placeholder="Şifre"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded"
              type="submit"
              disabled={loading}
            >
              {loading ? "Giriş..." : "Giriş"}
            </button>
          </form>
        ) : (
          <div className="flex gap-3 items-center">
            <span className="text-sm text-gray-600">Giriş yapıldı</span>
            <button className="text-sm underline" onClick={handleLogout}>
              Çıkış
            </button>
          </div>
        )}
      </div>

      {errMsg && (
        <div className="mb-3 p-2 rounded bg-red-50 text-red-700 text-sm">
          {errMsg}
        </div>
      )}

      {loading && <div className="mb-2 text-sm text-gray-600">Yükleniyor...</div>}

      {!selectedLesson ? (
        <>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold">📚 Dersler</h2>
            <button
              className="text-sm underline"
              onClick={fetchLessons}
              disabled={loading}
            >
              Yenile
            </button>
          </div>

          {lessons.length === 0 ? (
            <div className="text-gray-600 text-sm">
              Henüz ders görünmüyor. Admin panelinden ders ekleyin.
            </div>
          ) : (
            <ul className="space-y-2">
              {lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className="border p-3 rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedLesson(lesson)}
                >
                  <strong>{lesson.title}</strong>
                  {/* backend listte level’i string döndürmüyorsa burayı gösterme */}
                  {lesson.level ? <> — {lesson.level}</> : null}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="space-y-3">
          <button
            onClick={() => setSelectedLesson(null)}
            className="text-blue-600 underline"
          >
            ← Geri dön
          </button>
          <h3 className="text-xl font-bold">🎧 {selectedLesson.title}</h3>

          {selectedLesson.audio_url ? (
            <audio controls src={selectedLesson.audio_url} className="w-full" />
          ) : (
            <div className="text-sm text-gray-600">Ses bulunamadı</div>
          )}

          <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap">
            {selectedLesson.transcript || "Transcript yok"}
          </pre>
        </div>
      )}
    </div>
  );
}
