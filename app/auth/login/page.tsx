"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../hooks"; // Importa o hook useAuth
import * as api from "../../../lib/api"; // Importa as funções da API

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isRequestingReset, setIsRequestingReset] = useState(false);
  const { login, loading } = useAuth(); // Usa o hook de autenticação

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores
    setSuccessMessage("");

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    if (!email) {
      setError("Por favor, informe seu email para redefinir a senha.");
      return;
    }
    
    try {
      setIsRequestingReset(true);
      await api.requestPasswordReset(email);
      setSuccessMessage("Enviamos um email com instruções para redefinir sua senha.");
      setShowForgotPassword(false);
    } catch (err: any) {
      setError(err.message || "Erro ao solicitar redefinição de senha. Tente novamente.");
      console.error("Erro ao solicitar redefinição de senha:", err);
    } finally {
      setIsRequestingReset(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div>
          <div className="flex justify-center">
            <Image src="/images/v2_marca_dta_gummy.png" alt="Gummy Original" width={200} height={80} className="mb-4" />
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Relatórios e Dashboards</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            {showForgotPassword ? "Redefinir sua senha" : "Faça login para acessar os dashboards"}
          </p>
        </div>
        
        {successMessage && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        {showForgotPassword ? (
          <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isRequestingReset}
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-sm font-medium text-pink-600 hover:text-pink-500"
              >
                Voltar ao login
              </button>
              <button
                type="submit"
                disabled={isRequestingReset}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
              >
                {isRequestingReset ? "Enviando..." : "Enviar instruções"}
              </button>
            </div>
          </form>
        ) : (
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

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="font-medium text-pink-600 hover:text-pink-500"
                >
                  Esqueceu sua senha?
                </button>
              </div>
            </div>

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
        )}
      </div>
    </div>
  );
}

