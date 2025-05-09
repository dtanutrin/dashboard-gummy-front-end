"use client";

import { useEffect, type ReactNode, type ComponentPropsWithoutRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/auth'; // Ajuste o caminho se necessário

// Definindo tipos para os componentes de UI
interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  children: ReactNode;
}

interface InputProps extends ComponentPropsWithoutRef<'input'> {}

interface TableProps extends ComponentPropsWithoutRef<'table'> {
  children: ReactNode;
}

interface ThProps extends ComponentPropsWithoutRef<'th'> {
  children: ReactNode;
}

interface TdProps extends ComponentPropsWithoutRef<'td'> {
  children: ReactNode;
}

// Componentes de UI (exemplo, serão substituídos pelos seus componentes reais ou criados)
const Button = ({ children, ...props }: ButtonProps) => <button {...props} className={`px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 ${props.className || ''}`}>{children}</button>;
const Input = (props: InputProps) => <input {...props} className={`border p-2 rounded w-full ${props.className || ''}`} />;
const Table = ({ children, ...props }: TableProps) => <table {...props} className={`min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden ${props.className || ''}`}>{children}</table>;
const Th = ({ children, ...props }: ThProps) => <th {...props} className={`py-3 px-4 bg-gray-100 dark:bg-gray-700 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider ${props.className || ''}`}>{children}</th>;
const Td = ({ children, ...props }: TdProps) => <td {...props} className={`py-3 px-4 border-b border-gray-200 dark:border-gray-700 ${props.className || ''}`}>{children}</td>;

export default function AdminPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role?.toLowerCase() !== 'admin')) {
      router.push('/dashboard'); // Redireciona se não for admin ou não estiver logado
    }
  }, [user, loading, router]);

  if (loading || !user || user.role?.toLowerCase() !== 'admin') {
    // Pode mostrar um loader ou uma mensagem enquanto verifica
    return <div className="p-8 text-center">Carregando ou acesso negado...</div>;
  }

  // TODO: Implementar abas para Usuários e Dashboards
  // TODO: Implementar CRUD para Usuários
  // TODO: Implementar CRUD para Dashboards

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Painel de Administração</h1>
      
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-pink-600 dark:text-pink-400">Gerenciamento de Usuários</h2>
        {/* Placeholder para CRUD de Usuários */}
        <p className="text-gray-600 dark:text-gray-300">Aqui você poderá criar, visualizar, editar e excluir usuários.</p>
        {/* Exemplo de como poderia ser um botão para adicionar usuário */}
        <div className="mt-4">
          <Button>Adicionar Novo Usuário</Button>
        </div>
        {/* Exemplo de tabela de usuários */}
        <div className="mt-6 overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Email</Th>
                <Th>Cargo</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {/* Linhas da tabela de usuários virão da API */}
              <tr>
                <Td>1</Td>
                <Td>exemplo@usuario.com</Td>
                <Td>Usuário</Td>
                <Td>
                  <Button className="mr-2 text-sm py-1 px-2 bg-blue-500 hover:bg-blue-600">Editar</Button>
                  <Button className="text-sm py-1 px-2 bg-red-500 hover:bg-red-600">Excluir</Button>
                </Td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-pink-600 dark:text-pink-400">Gerenciamento de Dashboards</h2>
        {/* Placeholder para CRUD de Dashboards */}
        <p className="text-gray-600 dark:text-gray-300">Aqui você poderá adicionar, visualizar, editar e remover dashboards e associá-los a áreas.</p>
        <div className="mt-4">
          <Button>Adicionar Novo Dashboard</Button>
        </div>
      </div>

    </div>
  );
}