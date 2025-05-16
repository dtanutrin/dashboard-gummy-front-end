"use client";

import { useEffect, useState, type ReactNode, type ComponentPropsWithoutRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { useAuth } from "../../app/auth/hooks"; 
import apiClient, { getAllAreas as apiGetAllAreas, Area as ApiArea, Dashboard as ApiDashboard, UserData as ApiUser, UserCreatePayload, UserUpdatePayload, createUser as apiCreateUser, getAllUsers as apiGetAllUsers, updateUser as apiUpdateUser, deleteUser as apiDeleteUser } from '../../lib/api';
import { toast, Toaster } from 'react-hot-toast';

// Tipos para os dados (mantendo consistência)
interface Area extends ApiArea {}
interface Dashboard extends ApiDashboard {}
interface User extends ApiUser {}

// Definindo tipos para os componentes de UI
interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}
interface InputProps extends ComponentPropsWithoutRef<'input'> {}
interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {}
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

// Componentes de UI Refinados
const Button = ({ children, variant = 'primary', size = 'md', ...props }: ButtonProps) => {
  const baseStyle = "font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out";
  const sizeStyles = {
    sm: "px-2 py-1 text-xs sm:px-3 sm:py-1.5",
    md: "px-3 py-2 text-sm sm:px-4",
    lg: "px-6 py-3 text-base",
  };
  const variantStyles = {
    primary: "bg-pink-600 text-white hover:bg-pink-700 focus:ring-pink-500 disabled:opacity-50",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 disabled:opacity-50",
    ghost: "text-pink-600 hover:bg-pink-50 dark:text-pink-400 dark:hover:bg-pink-700/20 focus:ring-pink-500",
    outline: "border border-pink-600 text-pink-600 hover:bg-pink-50 dark:border-pink-400 dark:text-pink-400 dark:hover:bg-pink-700/20 focus:ring-pink-500"
  };
  return <button {...props} className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${props.className || ''}`}>{children}</button>;
}

const Input = (props: InputProps) => <input {...props} className={`border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${props.className || ''}`} />;
const Textarea = (props: TextareaProps) => <textarea {...props} className={`border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${props.className || ''}`} />;
const Select = (props: SelectProps) => <select {...props} className={`border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${props.className || ''}`} />;
const Table = ({ children, ...props }: TableProps) => <table {...props} className={`min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden ${props.className || ''}`}>{children}</table>;
const Th = ({ children, ...props }: ThProps) => <th {...props} className={`py-3 px-4 bg-gray-50 dark:bg-gray-700 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider ${props.className || ''}`}>{children}</th>;
const Td = ({ children, ...props }: TdProps) => <td {...props} className={`py-3 px-4 border-b border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 ${props.className || ''}`}>{children}</td>;

export default function AdminPage() {
  const { user, loading: userLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Estados para Dashboards
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoadingDashboards, setIsLoadingDashboards] = useState(true);
  const [showDashboardForm, setShowDashboardForm] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState<Dashboard | null>(null);
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardUrl, setDashboardUrl] = useState('');
  const [dashboardInformation, setDashboardInformation] = useState(''); // Novo estado para o campo information
  const [selectedDashboardAreaId, setSelectedDashboardAreaId] = useState<string>('');

  // Estados para Áreas
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoadingAreas, setIsLoadingAreas] = useState(true);
  const [showAreaForm, setShowAreaForm] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [areaName, setAreaName] = useState('');

  // Estados para Usuários
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('User');
  const [selectedUserAreaIds, setSelectedUserAreaIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboards' | 'users' | 'areas'>('dashboards');

  useEffect(() => {
    if (!userLoading) {
      if (!isAuthenticated || !user || user.role?.toLowerCase() !== 'admin') {
        toast.error('Acesso negado. Você precisa ser administrador.');
        router.push('/dashboard');
      }
    }
  }, [user, userLoading, isAuthenticated, router]);

  const fetchDashboardsData = async () => {
    setIsLoadingDashboards(true);
    try {
      const response = await apiClient.get<Dashboard[]>('/dashboards');
      setDashboards(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Erro ao buscar dashboards.');
    }
    setIsLoadingDashboards(false);
  };

  const fetchAreasData = async () => {
    setIsLoadingAreas(true);
    try {
      const response = await apiGetAllAreas();
      setAreas(response);
      if (response.length > 0 && !selectedDashboardAreaId) {
        setSelectedDashboardAreaId(response[0].id.toString());
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Erro ao buscar áreas.');
    }
    setIsLoadingAreas(false);
  };

  const fetchUsersData = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await apiGetAllUsers();
      setUsers(response);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Erro ao buscar usuários.');
    }
    setIsLoadingUsers(false);
  };

  // Handlers para Áreas
  const handleAreaFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!areaName.trim()) {
      toast.error('O nome da área é obrigatório.');
      return;
    }
    const payload = { name: areaName.trim() };
    try {
      if (editingArea) {
        await apiClient.put<Area>(`/areas/${editingArea.id}`, payload);
        toast.success('Área atualizada com sucesso!');
      } else {
        await apiClient.post<Area>('/areas', payload);
        toast.success('Área criada com sucesso!');
      }
      setShowAreaForm(false);
      setEditingArea(null);
      setAreaName('');
      fetchAreasData(); // Atualiza a lista de áreas e também a lista usada nos forms de dashboard/usuário
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Erro ao salvar área.');
    }
  };

  const handleAreaEdit = (area: Area) => {
    setEditingArea(area);
    setAreaName(area.name);
    setShowAreaForm(true);
    setActiveTab('areas');
  };

  const handleAreaDelete = async (areaId: number) => {
    if (!confirm('Tem certeza que deseja excluir esta área? Isso pode afetar dashboards e acessos de usuários vinculados.')) return;
    try {
      await apiClient.delete(`/areas/${areaId}`);
      toast.success('Área excluída com sucesso!');
      fetchAreasData(); // Atualiza a lista de áreas
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Erro ao excluir área.');
    }
  };

  const openAreaFormForNew = () => {
    setEditingArea(null);
    setAreaName('');
    setShowAreaForm(true);
  };

  useEffect(() => {
    if (!userLoading && isAuthenticated && user && user.role?.toLowerCase() === 'admin') {
      fetchAreasData();
      fetchDashboardsData();
      fetchUsersData();
    }
  }, [user, userLoading, isAuthenticated]);

  const handleDashboardFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!dashboardName || !dashboardUrl || !selectedDashboardAreaId) {
      toast.error('Por favor, preencha todos os campos obrigatórios do dashboard.');
      return;
    }
    const payload = { 
      name: dashboardName, 
      url: dashboardUrl, 
      areaId: parseInt(selectedDashboardAreaId),
      information: dashboardInformation // Adicionado o campo information
    };
    try {
      if (editingDashboard) {
        await apiClient.put<Dashboard>(`/dashboards/${editingDashboard.id}`, payload);
      } else {
        await apiClient.post<Dashboard>('/dashboards', payload);
      }
      toast.success(`Dashboard ${editingDashboard ? 'atualizado' : 'adicionado'}!`);
      setShowDashboardForm(false); 
      setEditingDashboard(null);
      setDashboardInformation(''); // Limpa o campo information
      fetchDashboardsData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar dashboard.');
    }
  };
  
  const handleDashboardEdit = (dashboard: Dashboard) => {
    setEditingDashboard(dashboard);
    setDashboardName(dashboard.name);
    setDashboardUrl(dashboard.url);
    setDashboardInformation(dashboard.information || ''); // Define o valor do campo information
    setSelectedDashboardAreaId(dashboard.areaId.toString());
    setShowDashboardForm(true);
    setActiveTab('dashboards');
  };
  
  const handleDashboardDelete = async (dashboardId: number) => {
    if (!confirm('Tem certeza que deseja excluir este dashboard?')) return;
    try {
      await apiClient.delete(`/dashboards/${dashboardId}`);
      toast.success('Dashboard excluído!');
      fetchDashboardsData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao excluir dashboard.');
    }
  };
  
  const openDashboardFormForNew = () => {
    setEditingDashboard(null); 
    setDashboardName(''); 
    setDashboardUrl('');
    setDashboardInformation(''); // Limpa o campo information
    if (areas.length > 0) setSelectedDashboardAreaId(areas[0].id.toString()); else setSelectedDashboardAreaId('');
    setShowDashboardForm(true);
  };

  const handleUserFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userEmail || (!editingUser && !userPassword) || !userRole) {
      toast.error('Email, Senha (para novo) e Perfil são obrigatórios.');
      return;
    }
    const payload: UserCreatePayload | UserUpdatePayload = {
      email: userEmail,
      role: userRole,
      areaIds: selectedUserAreaIds,
    };
    if (userPassword && (!editingUser || userPassword)) {
      payload.password = userPassword;
    }

    try {
      if (editingUser) {
        await apiUpdateUser(editingUser.id, payload as UserUpdatePayload);
      } else {
        await apiCreateUser(payload as UserCreatePayload);
      }
      toast.success(`Usuário ${editingUser ? 'atualizado' : 'criado'}!`);
      setShowUserForm(false); setEditingUser(null); setUserPassword('');
      fetchUsersData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Erro ao salvar usuário.');
    }
  };

  const handleUserEdit = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setUserEmail(userToEdit.email);
    setUserRole(userToEdit.role);
    setSelectedUserAreaIds(userToEdit.areas?.map(a => a.id) || []);
    setUserPassword('');
    setShowUserForm(true);
    setActiveTab('users');
  };

  const handleUserDelete = async (userId: number) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      await apiDeleteUser(userId);
      toast.success('Usuário excluído!');
      fetchUsersData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao excluir usuário.');
    }
  };

  const openUserFormForNew = () => {
    setEditingUser(null); setUserEmail(''); setUserPassword(''); setUserRole('User'); setSelectedUserAreaIds([]);
    setShowUserForm(true);
  };

  const handleAreaSelection = (areaId: number) => {
    setSelectedUserAreaIds(prev => 
      prev.includes(areaId) ? prev.filter(id => id !== areaId) : [...prev, areaId]
    );
  };

  if (userLoading) {
    return <div className="p-8 text-center dark:text-white">Carregando informações do usuário...</div>;
  }
  if (!isAuthenticated || !user || user.role?.toLowerCase() !== 'admin') {
     return <div className="p-8 text-center dark:text-white">Verificando permissões...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Painel de Administração</h1>
        <Link href="/dashboard">
          <Button variant="outline" size="md" className="w-full sm:w-auto">
            <span className="mr-2">←</span> Voltar para Dashboards
          </Button>
        </Link>
      </div>

      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('dashboards')}
            className={`${activeTab === 'dashboards' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'} whitespace-nowrap py-3 px-2 sm:py-4 sm:px-3 border-b-2 font-medium text-sm`}
          >
            Dashboards
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`${activeTab === 'users' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'} whitespace-nowrap py-3 px-2 sm:py-4 sm:px-3 border-b-2 font-medium text-sm`}
          >
            Usuários
          </button>
          <button
            onClick={() => setActiveTab('areas')}
            className={`${activeTab === 'areas' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'} whitespace-nowrap py-3 px-2 sm:py-4 sm:px-3 border-b-2 font-medium text-sm`}
          >
            Áreas
          </button>
        </nav>
      </div>

      {activeTab === 'dashboards' && (
        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-pink-600 dark:text-pink-400">Gerenciamento de Dashboards</h2>
            <Button onClick={openDashboardFormForNew} size="md" className="w-full sm:w-auto">Adicionar Novo Dashboard</Button>
          </div>
          {showDashboardForm && (
            <form onSubmit={handleDashboardFormSubmit} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md space-y-4">
              <h3 className="text-lg sm:text-xl mb-3 font-medium dark:text-white">{editingDashboard ? 'Editar' : 'Adicionar'} Dashboard</h3>
              <div>
                <label htmlFor="dashboardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                <Input type="text" id="dashboardName" value={dashboardName} onChange={(e) => setDashboardName(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="dashboardUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL (Power BI)</label>
                <Input type="url" id="dashboardUrl" value={dashboardUrl} onChange={(e) => setDashboardUrl(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="dashboardInformation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Informação</label>
                <Textarea 
                  id="dashboardInformation" 
                  value={dashboardInformation} 
                  onChange={(e) => setDashboardInformation(e.target.value)} 
                  rows={4}
                  placeholder="Descreva informações sobre este dashboard que serão exibidas ao passar o mouse sobre o ícone de informação"
                />
              </div>
              <div>
                <label htmlFor="selectedDashboardAreaId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Área</label>
                {isLoadingAreas ? <p className="dark:text-gray-300">Carregando áreas...</p> : areas.length === 0 ? <p className="dark:text-gray-300">Nenhuma área cadastrada.</p> : (
                  <Select id="selectedDashboardAreaId" value={selectedDashboardAreaId} onChange={(e) => setSelectedDashboardAreaId(e.target.value)} required>
                    {areas.map(area => <option key={area.id} value={area.id}>{area.name}</option>)}
                  </Select>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button type="submit" size="md" className="w-full sm:w-auto">{editingDashboard ? 'Salvar Alterações' : 'Adicionar Dashboard'}</Button>
                <Button type="button" variant="secondary" size="md" onClick={() => { setShowDashboardForm(false); setEditingDashboard(null); }} className="w-full sm:w-auto">Cancelar</Button>
              </div>
            </form>
          )}
          {isLoadingDashboards ? <p className="dark:text-gray-300 text-center py-4">Carregando dashboards...</p> : dashboards.length === 0 && !showDashboardForm ? <p className="dark:text-gray-300 text-center py-4">Nenhum dashboard cadastrado.</p> : (
            <div className="overflow-x-auto">
              <Table>
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <Th>ID</Th>
                    <Th>Nome</Th>
                    <Th>Área</Th>
                    <Th className="hidden md:table-cell">URL</Th>
                    <Th>Informação</Th>
                    <Th>Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {dashboards.map(dash => (
                    <tr key={dash.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <Td>{dash.id}</Td>
                      <Td>{dash.name}</Td>
                      <Td>{areas.find(a => a.id === dash.areaId)?.name || 'N/A'}</Td>
                      <Td className="hidden md:table-cell">
                        <a href={dash.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate max-w-xs inline-block" title={dash.url}>
                          {dash.url}
                        </a>
                      </Td>
                      <Td>
                        {dash.information ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                            Sim
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            Não
                          </span>
                        )}
                      </Td>
                      <Td>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button onClick={() => handleDashboardEdit(dash)} variant="outline" size="sm" className="w-full sm:w-auto">Editar</Button>
                          <Button onClick={() => handleDashboardDelete(dash.id)} variant="danger" size="sm" className="w-full sm:w-auto">Excluir</Button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
          {/* Conteúdo da aba de usuários */}
        </div>
      )}

      {activeTab === 'areas' && (
        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
          {/* Conteúdo da aba de áreas */}
        </div>
      )}
    </div>
  );
}
