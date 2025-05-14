"use client";

import { useEffect, useState, type ReactNode, type ComponentPropsWithoutRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
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

// Componentes de UI
const Button = ({ children, ...props }: ButtonProps) => <button {...props} className={`px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50 ${props.className || ''}`}>{children}</button>;
const Input = (props: InputProps) => <input {...props} className={`border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white ${props.className || ''}`} />;
const Select = (props: SelectProps) => <select {...props} className={`border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white ${props.className || ''}`} />;
const Table = ({ children, ...props }: TableProps) => <table {...props} className={`min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden ${props.className || ''}`}>{children}</table>;
const Th = ({ children, ...props }: ThProps) => <th {...props} className={`py-3 px-4 bg-gray-100 dark:bg-gray-700 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider ${props.className || ''}`}>{children}</th>;
const Td = ({ children, ...props }: TdProps) => <td {...props} className={`py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 ${props.className || ''}`}>{children}</td>;

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
  const [selectedDashboardAreaId, setSelectedDashboardAreaId] = useState<string>('');

  // Estados para Áreas (serão usados por Dashboards e Usuários)
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoadingAreas, setIsLoadingAreas] = useState(true);
  // Adicionar CRUD de Areas aqui depois

  // Estados para Usuários
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('User');
  const [selectedUserAreaIds, setSelectedUserAreaIds] = useState<number[]>([]);

  // Abas
  const [activeTab, setActiveTab] = useState<'dashboards' | 'users' | 'areas'>('dashboards');

  useEffect(() => {
    if (!userLoading) {
      if (!isAuthenticated || !user || user.role?.toLowerCase() !== 'admin') {
        toast.error('Acesso negado. Você precisa ser administrador.');
        router.push('/dashboard');
      }
    }
  }, [user, userLoading, isAuthenticated, router]);

  // Fetchers
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
      const response = await apiGetAllAreas(); // Usando a função importada
      setAreas(response);
      if (response.length > 0) {
        if (!selectedDashboardAreaId) setSelectedDashboardAreaId(response[0].id.toString());
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Erro ao buscar áreas.');
    }
    setIsLoadingAreas(false);
  };

  const fetchUsersData = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await apiGetAllUsers(); // Usando a função importada
      setUsers(response);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Erro ao buscar usuários.');
    }
    setIsLoadingUsers(false);
  };

  useEffect(() => {
    if (!userLoading && isAuthenticated && user && user.role?.toLowerCase() === 'admin') {
      fetchAreasData(); // Áreas são necessárias para Dashboards e Usuários
      fetchDashboardsData();
      fetchUsersData();
    }
  }, [user, userLoading, isAuthenticated]);

  // Handlers para CRUD de Dashboards
  const handleDashboardFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!dashboardName || !dashboardUrl || !selectedDashboardAreaId) {
      toast.error('Por favor, preencha todos os campos do dashboard.');
      return;
    }
    const payload = { name: dashboardName, url: dashboardUrl, areaId: parseInt(selectedDashboardAreaId) };
    try {
      if (editingDashboard) {
        await apiClient.put<Dashboard>(`/dashboards/${editingDashboard.id}`, payload);
      } else {
        await apiClient.post<Dashboard>('/dashboards', payload);
      }
      toast.success(`Dashboard ${editingDashboard ? 'atualizado' : 'adicionado'}!`);
      setShowDashboardForm(false); setEditingDashboard(null);
      fetchDashboardsData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar dashboard.');
    }
  };
  const handleDashboardEdit = (dashboard: Dashboard) => {
    setEditingDashboard(dashboard);
    setDashboardName(dashboard.name);
    setDashboardUrl(dashboard.url);
    setSelectedDashboardAreaId(dashboard.areaId.toString());
    setShowDashboardForm(true);
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
    setEditingDashboard(null); setDashboardName(''); setDashboardUrl('');
    if (areas.length > 0) setSelectedDashboardAreaId(areas[0].id.toString()); else setSelectedDashboardAreaId('');
    setShowDashboardForm(true);
  };

  // Handlers para CRUD de Usuários
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
    if (userPassword && (!editingUser || userPassword)) { // Só envia senha se for novo ou se foi alterada
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
    setUserPassword(''); // Limpa campo de senha ao editar
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

  // Renderização condicional baseada no estado de autenticação
  if (userLoading) {
    return <div className="p-8 text-center dark:text-white">Carregando informações do usuário...</div>;
  }
  if (!isAuthenticated || !user || user.role?.toLowerCase() !== 'admin') {
     return <div className="p-8 text-center dark:text-white">Verificando permissões...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Painel de Administração</h1>

      {/* Abas de Navegação */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('dashboards')}
            className={`${activeTab === 'dashboards' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Dashboards
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`${activeTab === 'users' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Usuários
          </button>
          {/* <button onClick={() => setActiveTab('areas')} className={`${activeTab === 'areas' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} ...`}>Áreas</button> */}
        </nav>
      </div>

      {/* Conteúdo da Aba de Dashboards */}
      {activeTab === 'dashboards' && (
        <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-pink-600 dark:text-pink-400">Gerenciamento de Dashboards</h2>
            <Button onClick={openDashboardFormForNew}>Adicionar Novo Dashboard</Button>
          </div>
          {showDashboardForm && (
            <form onSubmit={handleDashboardFormSubmit} className="mb-6 p-4 border dark:border-gray-700 rounded-md">
              <h3 className="text-xl mb-3 font-medium dark:text-white">{editingDashboard ? 'Editar' : 'Adicionar'} Dashboard</h3>
              <div className="mb-3">
                <label htmlFor="dashboardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                <Input type="text" id="dashboardName" value={dashboardName} onChange={(e) => setDashboardName(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="dashboardUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL (Power BI)</label>
                <Input type="url" id="dashboardUrl" value={dashboardUrl} onChange={(e) => setDashboardUrl(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label htmlFor="selectedDashboardAreaId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Área</label>
                {isLoadingAreas ? <p className="dark:text-gray-300">Carregando áreas...</p> : areas.length === 0 ? <p className="dark:text-gray-300">Nenhuma área. Cadastre áreas.</p> : (
                  <Select id="selectedDashboardAreaId" value={selectedDashboardAreaId} onChange={(e) => setSelectedDashboardAreaId(e.target.value)} required>
                    {areas.map(area => <option key={area.id} value={area.id}>{area.name}</option>)}
                  </Select>
                )}
              </div>
              <div className="flex gap-2">
                  <Button type="submit">{editingDashboard ? 'Salvar' : 'Adicionar'}</Button>
                  <Button type="button" onClick={() => { setShowDashboardForm(false); setEditingDashboard(null); }} className="bg-gray-500 hover:bg-gray-600">Cancelar</Button>
              </div>
            </form>
          )}
          {isLoadingDashboards ? <p className="dark:text-gray-300">Carregando dashboards...</p> : dashboards.length === 0 && !showDashboardForm ? <p className="dark:text-gray-300">Nenhum dashboard.</p> : (
            <div className="overflow-x-auto">
              <Table>
                <thead><tr><Th>ID</Th><Th>Nome</Th><Th>Área</Th><Th>URL</Th><Th>Ações</Th></tr></thead>
                <tbody>
                  {dashboards.map(dash => (
                    <tr key={dash.id}>
                      <Td>{dash.id}</Td><Td>{dash.name}</Td>
                      <Td>{areas.find(a => a.id === dash.areaId)?.name || 'N/A'}</Td>
                      <Td><a href={dash.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{dash.url.substring(0,50)}...</a></Td>
                      <Td>
                        <Button onClick={() => handleDashboardEdit(dash)} className="mr-2 text-sm py-1 px-2 bg-blue-500 hover:bg-blue-600">Editar</Button>
                        <Button onClick={() => handleDashboardDelete(dash.id)} className="text-sm py-1 px-2 bg-red-500 hover:bg-red-600">Excluir</Button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* Conteúdo da Aba de Usuários */}
      {activeTab === 'users' && (
        <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-pink-600 dark:text-pink-400">Gerenciamento de Usuários</h2>
            <Button onClick={openUserFormForNew}>Adicionar Novo Usuário</Button>
          </div>
          {showUserForm && (
            <form onSubmit={handleUserFormSubmit} className="mb-6 p-4 border dark:border-gray-700 rounded-md">
              <h3 className="text-xl mb-3 font-medium dark:text-white">{editingUser ? 'Editar' : 'Adicionar'} Usuário</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <Input type="email" id="userEmail" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha {editingUser && "(deixe em branco para não alterar)"}</label>
                  <Input type="password" id="userPassword" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} required={!editingUser} />
                </div>
                <div>
                  <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Perfil</label>
                  <Select id="userRole" value={userRole} onChange={(e) => setUserRole(e.target.value)} required>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </Select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Áreas de Acesso</label>
                {isLoadingAreas ? <p className="dark:text-gray-300">Carregando áreas...</p> : areas.length === 0 ? <p className="dark:text-gray-300">Nenhuma área cadastrada.</p> : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {areas.map(area => (
                      <label key={area.id} className="flex items-center space-x-2 p-2 border dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedUserAreaIds.includes(area.id)} 
                          onChange={() => handleAreaSelection(area.id)} 
                          className="form-checkbox h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{area.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-6 flex gap-2">
                <Button type="submit">{editingUser ? 'Salvar Alterações' : 'Criar Usuário'}</Button>
                <Button type="button" onClick={() => { setShowUserForm(false); setEditingUser(null); }} className="bg-gray-500 hover:bg-gray-600">Cancelar</Button>
              </div>
            </form>
          )}
          {isLoadingUsers ? <p className="dark:text-gray-300">Carregando usuários...</p> : users.length === 0 && !showUserForm ? <p className="dark:text-gray-300">Nenhum usuário cadastrado.</p> : (
            <div className="overflow-x-auto">
              <Table>
                <thead><tr><Th>ID</Th><Th>Email</Th><Th>Perfil</Th><Th>Áreas</Th><Th>Ações</Th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <Td>{u.id}</Td><Td>{u.email}</Td><Td>{u.role}</Td>
                      <Td>{u.areas?.map(a => a.name).join(", ") || 'Nenhuma'}</Td>
                      <Td>
                        <Button onClick={() => handleUserEdit(u)} className="mr-2 text-sm py-1 px-2 bg-blue-500 hover:bg-blue-600">Editar</Button>
                        <Button onClick={() => handleUserDelete(u.id)} className="text-sm py-1 px-2 bg-red-500 hover:bg-red-600">Excluir</Button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* Aba de Áreas (placeholder, pode ser implementada depois) */}
      {/* {activeTab === 'areas' && ( ... )} */}
    </div>
  );
}

