"use client";

import type React from "react";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "../hooks"; // Importa o hook useAuth

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth(); // Usa o hook de autenticação
  // const router = useRouter(); // O redirecionamento é feito dentro do hook login

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores

    try {
      await login(email, password); // Chama a função de login do contexto
      // O redirecionamento para /dashboard acontece dentro da função login no AuthProvider
    } catch (err: any) {
      // Exibe a mensagem de erro retornada pela API ou um erro genérico
      setError(err.message || "Ocorreu um erro durante o login. Por favor, tente novamente.");
      console.error("Erro no handleSubmit do Login:", err);
    } 
    // O setLoading é gerenciado pelo hook useAuth
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div>
          <div className="flex justify-center">
            <Image src="/images/gummy-logo.png" alt="Gummy Original" width={200} height={80} className="mb-4" />
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Dashboards Gummy</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Faça login para acessar os dashboards
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading} // Desabilita enquanto carrega
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading} // Desabilita enquanto carrega
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading} // Desabilita o botão enquanto carrega
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

