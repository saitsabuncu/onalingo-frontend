// src/components/LoginForm.js
import React, { useState } from "react";

export default function LoginForm({ onLogin, error }) {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(form);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
          OnaLingo Giriş
        </h1>

        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="border p-2 w-full rounded"
            placeholder="Kullanıcı adı"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value.trim() })}
          />
          <input
            type="password"
            className="border p-2 w-full rounded"
            placeholder="Şifre"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 w-full rounded hover:bg-blue-600 transition"
            type="submit"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
