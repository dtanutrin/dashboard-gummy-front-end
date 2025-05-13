"use client";

import { useEffect, useState, type ReactNode, type ComponentPropsWithoutRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
// import { useUser } from '@/hooks/auth'; // Mantido o comentário original, mas vamos usar o useAuth que já ajustamos
import { useAuth } from "../../app/auth/hooks"; // Caminho ajustado para o AuthProvider que já corrigimos
import apiClient from '../../lib/api'; // Importa o apiClient configurado que já corrigimos
import { toast, Toaster } from 'react-hot-toast';

// Tipos para os dados
interface Area {
  id: number;
  name: string;
}

interface Dashboard {
  id: number;
  name: string;
  url: string;
  areaId: number;
  areaName?: string; // Campo opcional para nome da área, se populado
}

// Definindo tipos para os componentes de UI (restaurados do original)
interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  children: ReactNode;
}

interface InputProps extends ComponentPropsWithoutRef<'input'> {}
interface SelectProps extends ComponentPropsWithoutRef<'select'> {}

interface TableProps extends ComponentPropsWithoutRef<'table'> {
  children: ReactNode;
}

interface ThProps extends ComponentPropsWithoutRef<'th'> {
  children: ReactNode;
}

interface TdProps extends ComponentPropsWithoutRef<'td'> {
  children: ReactNode;
}

// Componentes de UI (restaurados do original)
const Button = ({ children, ...props }: ButtonProps) => <button {...props} className={`px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50 ${props.className || ''}`}>{children}</button>;
const Input = (props: InputProps) => <input {...props} className={`border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white ${props.className || ''}`} />;
const Select = (props: SelectProps) => <select {...props} className={`border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white ${props.className || ''}`} />;
const Table = ({ children, ...props }: TableProps) => <table {...props} className={`min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden ${props.className || ''}`}>{children}</table>;
const Th = ({ children, ...props }: ThProps) => <th {...props} className={`py-3 px-4 bg-gray-100 dark:bg-gray-700 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider ${props.className || ''}`}>{children}</th>;
const Td = ({ children, ...props }: TdProps) => <td {...props} className={`py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 ${props.className || ''}`}>{children}</td>;

export default function AdminPage() {
  const { user, loading: userLoading, isAuthenticated } = useAuth(); // Usando useAuth que já ajustamos
  const router = useRouter();

  console.log("[AdminPage] Render - User:", user, "UserLoading:", userLoading, "IsAuthenticated:", isAuthenticated);

  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoadingDashboards, setIsLoadingDashboards] = useState(true);
  const [isLoadingAreas, setIsLoadingAreas] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState<Dashboard | null>(null);
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardUrl, setDashboardUrl] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('');

  useEffect(() => {
    console.log("[AdminPage] AuthCheckEffect - UserLoading:", userLoading, "IsAuthenticated:", isAuthenticated, "User:", user);
    if (!userLoading) {
      if (!isAuthenticated || !user || user.role?.toLowerCase() !== 'admin') {
        console.log("[AdminPage] AuthCheckEffect - Acesso negado ou usuário não é admin. Redirecionando...");
        toast.error('Acesso negado. Você precisa ser administrador para acessar esta página.');
        router.push('/dashboard'); // Ou para uma página de login/não autorizado
      }
    }
  }, [user, userLoading, isAuthenticated, router]);

  const fetchDashboardsData = async () => {
    console.log("[AdminPage] fetchDashboardsData - Chamando...");
    setIsLoadingDashboards(true);
    try {
      const response = await apiClient.get<Dashboard[]>('/dashboards');
      console.log("[AdminPage] fetchDashboardsData - Resposta de /dashboards:", response.status);
      setDashboards(response.data);
    } catch (error: any) {
      console.error("[AdminPage] fetchDashboardsData - Erro:", error);
      toast.error(error.response?.data?.message || error.message || 'Erro ao buscar dashboards.');
    }
    setIsLoadingDashboards(false);
  };

  const fetchAreasData = async () => {
    console.log("[AdminPage] fetchAreasData - Chamando...");
    setIsLoadingAreas(true);
    try {
      const response = await apiClient.get<Area[]>('/areas');
      console.log("[AdminPage] fetchAreasData - Resposta de /areas:", response.status);
      setAreas(response.data);
      if (response.data.length > 0 && !selectedAreaId) {
        setSelectedAreaId(response.data[0].id.toString());
      }
    } catch (error: any) {
      console.error("[AdminPage] fetchAreasData - Erro:", error);
      toast.error(error.response?.data?.message || error.message || 'Erro ao buscar áreas.');
    }
    setIsLoadingAreas(false);
  };

  useEffect(() => {
    console.log("[AdminPage] DataFetchEffect - UserLoading:", userLoading, "IsAuthenticated:", isAuthenticated, "User Role:", user?.role);
    if (!userLoading && isAuthenticated && user && user.role?.toLowerCase() === 'admin') {
      console.log("[AdminPage] DataFetchEffect - Usuário é admin autenticado. Chamando fetches.");
      fetchDashboardsData();
      fetchAreasData();
    } else if (!userLoading) {
      console.log("[AdminPage] DataFetchEffect - Condições para fetch não atendidas (UserLoading:", userLoading, "IsAuthenticated:", isAuthenticated, "User Role:", user?.role, ")");
    }
  }, [user, userLoading, isAuthenticated]);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!dashboardName || !dashboardUrl || !selectedAreaId) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    const payload = {
      name: dashboardName,
      url: dashboardUrl,
      areaId: parseInt(selectedAreaId)
    };

    const endpoint = editingDashboard ? `/dashboards/${editingDashboard.id}` : '/dashboards';
    const method = editingDashboard ? 'put' : 'post';
    console.log(`[AdminPage] handleFormSubmit - Enviando ${method.toUpperCase()} para ${endpoint}`);

    try {
      let response;
      if (editingDashboard) {
        response = await apiClient.put<Dashboard>(endpoint, payload);
      } else {
        response = await apiClient.post<Dashboard>(endpoint, payload);
      }
      console.log("[AdminPage] handleFormSubmit - Resposta do servidor:", response.status);
      toast.success(`Dashboard ${editingDashboard ? 'atualizado' : 'adicionado'} com sucesso!`);
      setShowForm(false);
      setEditingDashboard(null);
      fetchDashboardsData();
    } catch (error: any) {
      console.error("[AdminPage] handleFormSubmit - Erro:", error);
      toast.error(error.response?.data?.message || error.message || 'Erro ao salvar dashboard.');
    }
  };

  const handleEdit = (dashboard: Dashboard) => {
    setEditingDashboard(dashboard);
    setDashboardName(dashboard.name);
    setDashboardUrl(dashboard.url);
    setSelectedAreaId(dashboard.areaId.toString());
    setShowForm(true);
  };

  const handleDelete = async (dashboardId: number) => {
    if (!confirm('Tem certeza que deseja excluir este dashboard?')) return;
    console.log(`[AdminPage] handleDelete - Tentando excluir dashboard ID: ${dashboardId}`);

    try {
      const response = await apiClient.delete(`/dashboards/${dashboardId}`);
      console.log("[AdminPage] handleDelete - Resposta do servidor:", response.status);
      toast.success('Dashboard excluído com sucesso!');
      fetchDashboardsData();
    } catch (error: any) {
      console.error("[AdminPage] handleDelete - Erro:", error);
      toast.error(error.response?.data?.message || error.message || 'Erro ao excluir dashboard.');
    }
  };

  const openFormForNew = () => {
    setEditingDashboard(null);
    setDashboardName('');
    setDashboardUrl('');
    if (areas.length > 0) setSelectedAreaId(areas[0].id.toString()); else setSelectedAreaId('');
    setShowForm(true);
  }

  if (userLoading) {
    console.log("[AdminPage] Render - Usuário carregando...");
    return <div className="p-8 text-center dark:text-white">Carregando informações do usuário...</div>;
  }
  
  if (!isAuthenticated || !user || user.role?.toLowerCase() !== 'admin') {
     console.log("[AdminPage] Render - Acesso negado ou usuário não é admin (após userLoading ser false).");
     return <div className="p-8 text-center dark:text-white">Verificando permissões... Você será redirecionado se não for admin.</div>;
  }

  console.log("[AdminPage] Render - Pronto para renderizar conteúdo da página admin.");
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Painel de Administração</h1>
      
      <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-pink-600 dark:text-pink-400">Gerenciamento de Dashboards</h2>
          <Button onClick={openFormForNew}>Adicionar Novo Dashboard</Button>
        </div>

        {showForm && (
          <form onSubmit={handleFormSubmit} className="mb-6 p-4 border dark:border-gray-700 rounded-md">
            <h3 className="text-xl mb-3 font-medium dark:text-white">{editingDashboard ? 'Editar' : 'Adicionar'} Dashboard</h3>
            <div className="mb-3">
              <label htmlFor="dashboardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Dashboard</label>
              <Input type="text" id="dashboardName" value={dashboardName} onChange={(e) => setDashboardName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="dashboardUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL do Dashboard (Power BI)</label>
              <Input type="url" id="dashboardUrl" value={dashboardUrl} onChange={(e) => setDashboardUrl(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label htmlFor="selectedAreaId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Área</label>
              {isLoadingAreas ? <p className="dark:text-gray-300">Carregando áreas...</p> : areas.length === 0 ? <p className="dark:text-gray-300">Nenhuma área encontrada. Cadastre áreas primeiro.</p> : (
                <Select id="selectedAreaId" value={selectedAreaId} onChange={(e) => setSelectedAreaId(e.target.value)} required>
                  {areas.map(area => <option key={area.id} value={area.id}>{area.name}</option>)}
                </Select>
              )}
            </div>
            <div className="flex gap-2">
                <Button type="submit">{editingDashboard ? 'Salvar Alterações' : 'Adicionar Dashboard'}</Button>
                <Button type="button" onClick={() => { setShowForm(false); setEditingDashboard(null); }} className="bg-gray-500 hover:bg-gray-600">Cancelar</Button>
            </div>
          </form>
        )}

        {isLoadingDashboards ? <p className="dark:text-gray-300">Carregando dashboards...</p> : dashboards.length === 0 && !showForm ? <p className="dark:text-gray-300">Nenhum dashboard cadastrado.</p> : (
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Nome</Th>
                  <Th>Área</Th>
                  <Th>URL</Th>
                  <Th>Ações</Th>
                </tr>
              </thead>
              <tbody>
                {dashboards.map(dash => (
                  <tr key={dash.id}>
                    <Td>{dash.id}</Td>
                    <Td>{dash.name}</Td>
                    <Td>{areas.find(a => a.id === dash.areaId)?.name || 'N/A'}</Td>
                    <Td><a href={dash.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{dash.url.substring(0,50)}...</a></Td>
                    <Td>
                      <Button onClick={() => handleEdit(dash)} className="mr-2 text-sm py-1 px-2 bg-blue-500 hover:bg-blue-600">Editar</Button>
                      <Button onClick={() => handleDelete(dash.id)} className="text-sm py-1 px-2 bg-red-500 hover:bg-red-600">Excluir</Button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
      {/* Adicionar aqui o CRUD de Usuários e Áreas se necessário */}
    </div>
  );
}

