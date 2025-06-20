"use client";

import { useEffect, useState, type ReactNode, type ComponentPropsWithoutRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { useAuth } from "../../app/auth/hooks"; 
import apiClient, { getAllAreas as apiGetAllAreas, Area as ApiArea, Dashboard as ApiDashboard, UserData as ApiUser, UserCreatePayload, UserUpdatePayload, createUser as apiCreateUser, getAllUsers as apiGetAllUsers, updateUser as apiUpdateUser, deleteUser as apiDeleteUser, UserDashboardAccess, DashboardPermissionPayload, grantDashboardAccess, revokeDashboardAccess, getUserDashboardAccess, LogEntry, LogsResponse, LogsFilters, getLogs, exportLogs, clearLogs } from '../../lib/api';
import { toast, Toaster } from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';

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
  const [localUser, setLocalUser] = useState<User | null>(null);

  useEffect(() => {
    // Só redireciona se não estiver carregando e realmente não for admin
    if (!userLoading && (!user || user.role !== 'Admin')) {
      window.location.href = '/dashboard';
      return;
    }
    if (user) {
      setLocalUser(user);
    }
  }, [user, userLoading]); // Adicionar userLoading como dependência

  // Estados para Dashboards
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoadingDashboards, setIsLoadingDashboards] = useState(true);
  const [showDashboardForm, setShowDashboardForm] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState<Dashboard | null>(null);
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardUrl, setDashboardUrl] = useState('');
  const [dashboardInformation, setDashboardInformation] = useState(''); 
  const [selectedDashboardAreaId, setSelectedDashboardAreaId] = useState<string>('');
  // Estados para filtros de dashboards
  const [dashboardFilter, setDashboardFilter] = useState('');
  const [dashboardAreaFilter, setDashboardAreaFilter] = useState('');
  // Estados para ordenação de dashboards
  const [dashboardSortField, setDashboardSortField] = useState<'id' | 'name' | 'areaId'>('id');
  const [dashboardSortDirection, setDashboardSortDirection] = useState<'asc' | 'desc'>('desc');

  // Estados para Áreas
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoadingAreas, setIsLoadingAreas] = useState(true);
  const [showAreaForm, setShowAreaForm] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [areaName, setAreaName] = useState('');
  // Estados para filtros de áreas
  const [areaFilter, setAreaFilter] = useState('');
  // Estados para ordenação de áreas
  const [areaSortField, setAreaSortField] = useState<'id' | 'name'>('id');
  const [areaSortDirection, setAreaSortDirection] = useState<'asc' | 'desc'>('desc');

  // Estados para Usuários
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('User');
  const [selectedUserAreaIds, setSelectedUserAreaIds] = useState<number[]>([]);
  // Estados para filtros de usuários
  const [userFilter, setUserFilter] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userAreaFilter, setUserAreaFilter] = useState('');
  // Estados para ordenação de usuários
  const [userSortField, setUserSortField] = useState<'id' | 'email' | 'role'>('id');
  const [userSortDirection, setUserSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Novos estados para gerenciamento de permissões de dashboard
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<User | null>(null);
  const [userDashboardAccess, setUserDashboardAccess] = useState<UserDashboardAccess[]>([]);
  const [isLoadingUserAccess, setIsLoadingUserAccess] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUserDashboardIds, setSelectedUserDashboardIds] = useState<number[]>([]);
  
  // Estados para Logs
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsPage, setLogsPage] = useState(1);
  const [logsLimit] = useState(50);
  // Estados para filtros de logs
  const [logLevelFilter, setLogLevelFilter] = useState('');
  const [logUserFilter, setLogUserFilter] = useState('');
  const [logActionFilter, setLogActionFilter] = useState('');
  const [logResourceFilter, setLogResourceFilter] = useState('');
  const [logSearchFilter, setLogSearchFilter] = useState('');
  const [logStartDateFilter, setLogStartDateFilter] = useState('');
  const [logEndDateFilter, setLogEndDateFilter] = useState('');
  
  const [activeTab, setActiveTab] = useState<'dashboards' | 'users' | 'areas' | 'logs'>('dashboards');

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
      fetchLogsData();
    }
  }, [user, userLoading, isAuthenticated]);

  // Efeito adicional para garantir que os dados sejam carregados quando a aba for alterada
  useEffect(() => {
    if (activeTab === 'dashboards' && dashboards.length === 0 && !isLoadingDashboards) {
      fetchDashboardsData();
    } else if (activeTab === 'users' && users.length === 0 && !isLoadingUsers) {
      fetchUsersData();
    } else if (activeTab === 'areas' && areas.length === 0 && !isLoadingAreas) {
      fetchAreasData();
    } else if (activeTab === 'logs' && logs.length === 0 && !isLoadingLogs) {
      fetchLogsData();
    }
  }, [activeTab]);

  // Efeito para recarregar logs quando filtros ou página mudam
  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogsData();
    }
  }, [logsPage, logLevelFilter, logUserFilter, logActionFilter, logResourceFilter, logSearchFilter, logStartDateFilter, logEndDateFilter]);

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

  // Nova função para buscar acessos de dashboard de um usuário
  const fetchUserDashboardAccess = async (userId: number) => {
    setIsLoadingUserAccess(true);
    try {
      const response = await getUserDashboardAccess(userId);
      setUserDashboardAccess(response);
      setSelectedUserDashboardIds(response.map(access => access.dashboardId));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao buscar acessos do usuário.');
    }
    setIsLoadingUserAccess(false);
  };

  // Função para abrir modal de gerenciamento de permissões
  const openPermissionsModal = async (user: User) => {
    setSelectedUserForPermissions(user);
    setShowPermissionsModal(true);
    await fetchUserDashboardAccess(user.id);
  };

  // Função para alternar acesso a dashboard específico
  const toggleDashboardAccess = (dashboardId: number) => {
    setSelectedUserDashboardIds(prev => 
      prev.includes(dashboardId) 
        ? prev.filter(id => id !== dashboardId) 
        : [...prev, dashboardId]
    );
  };

  // Função para salvar permissões de dashboard
  const saveUserDashboardPermissions = async () => {
    if (!selectedUserForPermissions) return;

    try {
      const currentAccess = userDashboardAccess.map(access => access.dashboardId);
      const toGrant = selectedUserDashboardIds.filter(id => !currentAccess.includes(id));
      const toRevoke = currentAccess.filter(id => !selectedUserDashboardIds.includes(id));

      // Conceder novos acessos
      for (const dashboardId of toGrant) {
        await grantDashboardAccess({
          userId: selectedUserForPermissions.id,
          dashboardId
        });
      }

      // Revogar acessos removidos
      for (const dashboardId of toRevoke) {
        await revokeDashboardAccess({
          userId: selectedUserForPermissions.id,
          dashboardId
        });
      }

      toast.success('Permissões de dashboard atualizadas com sucesso!');
      setShowPermissionsModal(false);
      await fetchUserDashboardAccess(selectedUserForPermissions.id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar permissões.');
    }
  };

  const fetchLogsData = async () => {
    setIsLoadingLogs(true);
    try {
      const filters: LogsFilters = {
        page: logsPage,
        limit: logsLimit,
        ...(logLevelFilter && { level: logLevelFilter }),
        ...(logUserFilter && { userId: parseInt(logUserFilter) }),
        ...(logActionFilter && { action: logActionFilter }),
        ...(logResourceFilter && { resource: logResourceFilter }),
        ...(logSearchFilter && { search: logSearchFilter }),
        ...(logStartDateFilter && { startDate: logStartDateFilter }),
        ...(logEndDateFilter && { endDate: logEndDateFilter }),
      };
      
      const response = await getLogs(filters);
      setLogs(response.logs || []); // Garantir que sempre seja um array
      setLogsTotal(response.total || 0);
    } catch (error: any) {
      console.error('Erro detalhado ao buscar logs:', error);
      setLogs([]); // Definir como array vazio em caso de erro
      setLogsTotal(0);
      toast.error(error.message || 'Erro ao buscar logs.');
    }
    setIsLoadingLogs(false);
  };

  const handleExportLogs = async () => {
    try {
      const filters: LogsFilters = {
        ...(logLevelFilter && { level: logLevelFilter }),
        ...(logUserFilter && { userId: parseInt(logUserFilter) }),
        ...(logActionFilter && { action: logActionFilter }),
        ...(logResourceFilter && { resource: logResourceFilter }),
        ...(logSearchFilter && { search: logSearchFilter }),
        ...(logStartDateFilter && { startDate: logStartDateFilter }),
        ...(logEndDateFilter && { endDate: logEndDateFilter }),
      };
      
      const blob = await exportLogs(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Logs exportados com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao exportar logs.');
    }
  };

  // Estados para o diálogo de limpeza de logs
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [clearRetentionDays, setClearRetentionDays] = useState('90');
  const [isClearing, setIsClearing] = useState(false);

  const handleClearLogs = async () => {
    // Validação e confirmação para logs muito recentes (menos de 7 dias)
    if (clearRetentionDays !== 'all') {
      const days = parseInt(clearRetentionDays);
      if (days < 7) {
        const confirmed = window.confirm(
          `⚠️ ATENÇÃO: Você está prestes a remover logs de apenas ${days} dia(s). Isso pode incluir logs importantes para debugging. Tem certeza?`
        );
        if (!confirmed) {
          return;
        }
      }
    }
    
    // Confirmação extra para "limpar todos"
    if (clearRetentionDays === 'all') {
      const confirmed = window.confirm(
        '⚠️ ATENÇÃO: Você está prestes a remover TODOS os logs do sistema. Esta ação é irreversível. Tem certeza absoluta?'
      );
      if (!confirmed) {
        return;
      }
    }
    
    setIsClearing(true);
    try {
      const olderThanDays = clearRetentionDays === 'all' ? undefined : parseInt(clearRetentionDays);
      const result = await clearLogs(olderThanDays);
      
      // Mensagem de sucesso mais detalhada
      const message = clearRetentionDays === 'all' 
        ? `Todos os logs foram limpos! ${result.deleted} registros removidos.`
        : `Logs anteriores a ${olderThanDays} dias foram limpos! ${result.deleted} registros removidos.`;
      
      toast.success(message);
      
      // Atualizar a lista de logs
      fetchLogsData();
      setShowClearDialog(false);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao limpar logs.');
    } finally {
      setIsClearing(false);
    }
  };

  const formatLogLevel = (level: string | undefined | null) => {
    const safeLevel = level || 'info';
    switch (safeLevel.toLowerCase()) {
      case 'error':
        return 'text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-medium';
      case 'warn':
        return 'text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-medium';
      case 'info':
        return 'text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium';
      case 'debug':
        return 'text-gray-600 bg-gray-50 px-2 py-1 rounded text-xs font-medium';
      default:
        return 'text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-medium';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  // Função para obter dashboards disponíveis para um usuário (baseado nas áreas que ele tem acesso)
  const getAvailableDashboardsForUser = (user: User) => {
    if (!user.areas) return [];
    const userAreaIds = user.areas.map(area => area.id);
    return dashboards.filter(dashboard => userAreaIds.includes(dashboard.areaId));
  };

  // Componente para o ícone de ordenação
  const SortIcon = ({ field, currentField, direction }: { field: string, currentField: string, direction: 'asc' | 'desc' }) => {
    if (field !== currentField) return <span className="ml-1 text-gray-400">↕</span>;
    return <span className="ml-1">{direction === 'asc' ? '↑' : '↓'}</span>;
  };

  // Funções para alternar ordenação
  const toggleDashboardSort = (field: 'id' | 'name' | 'areaId') => {
    if (dashboardSortField === field) {
      setDashboardSortDirection(dashboardSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setDashboardSortField(field);
      setDashboardSortDirection('asc');
    }
  };

  const toggleUserSort = (field: 'id' | 'email' | 'role') => {
    if (userSortField === field) {
      setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortField(field);
      setUserSortDirection('asc');
    }
  };

  const toggleAreaSort = (field: 'id' | 'name') => {
    if (areaSortField === field) {
      setAreaSortDirection(areaSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setAreaSortField(field);
      setAreaSortDirection('asc');
    }
  };

  // Funções de filtro e ordenação
  const filteredDashboards = dashboards
    .filter(dashboard => {
      const area = areas.find(a => a.id === dashboard.areaId);
      const matchesName = dashboard.name.toLowerCase().includes(dashboardFilter.toLowerCase());
      const matchesArea = !dashboardAreaFilter || dashboard.areaId.toString() === dashboardAreaFilter;
      return matchesName && matchesArea;
    })
    .sort((a, b) => {
      if (dashboardSortField === 'id') {
        return dashboardSortDirection === 'asc' ? a.id - b.id : b.id - a.id;
      } else if (dashboardSortField === 'name') {
        return dashboardSortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (dashboardSortField === 'areaId') {
        const areaA = areas.find(area => area.id === a.areaId)?.name || '';
        const areaB = areas.find(area => area.id === b.areaId)?.name || '';
        return dashboardSortDirection === 'asc' 
          ? areaA.localeCompare(areaB) 
          : areaB.localeCompare(areaA);
      }
      return 0;
    });

  const filteredUsers = users
    .filter(user => {
      const matchesEmail = user.email.toLowerCase().includes(userFilter.toLowerCase());
      const matchesRole = !userRoleFilter || user.role === userRoleFilter;
      const matchesArea = !userAreaFilter || (user.areas && user.areas.some(area => area.id.toString() === userAreaFilter));
      return matchesEmail && matchesRole && matchesArea;
    })
    .sort((a, b) => {
      if (userSortField === 'id') {
        return userSortDirection === 'asc' ? a.id - b.id : b.id - a.id;
      } else if (userSortField === 'email') {
        return userSortDirection === 'asc' 
          ? a.email.localeCompare(b.email) 
          : b.email.localeCompare(a.email);
      } else if (userSortField === 'role') {
        return userSortDirection === 'asc' 
          ? a.role.localeCompare(b.role) 
          : b.role.localeCompare(a.role);
      }
      return 0;
    });

  const filteredAreas = areas
    .filter(area => {
      return area.name.toLowerCase().includes(areaFilter.toLowerCase());
    })
    .sort((a, b) => {
      if (areaSortField === 'id') {
        return areaSortDirection === 'asc' ? a.id - b.id : b.id - a.id;
      } else if (areaSortField === 'name') {
        return areaSortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      }
      return 0;
    });

  if (userLoading) {
    return <div className="p-8 text-center dark:text-white">Carregando informações do usuário...</div>;
  }
  if (!isAuthenticated || !user || user.role?.toLowerCase() !== 'admin') {
     return <div className="p-8 text-center dark:text-white">Verificando permissões...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
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
          <button
            onClick={() => setActiveTab('logs')}
            className={`${activeTab === 'logs' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'} whitespace-nowrap py-3 px-2 sm:py-4 sm:px-3 border-b-2 font-medium text-sm`}
          >
            Logs
          </button>
        </nav>
      </div>

      {activeTab === 'dashboards' && (
        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-pink-600 dark:text-pink-400">Gerenciamento de Dashboards</h2>
            <Button onClick={openDashboardFormForNew} size="md" className="w-full sm:w-auto">
              Adicionar Novo Dashboard
            </Button>
          </div>

          {/* Filtros para Dashboards */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white">Filtros</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dashboardNameFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Filtrar por Nome
                </label>
                <Input
                  id="dashboardNameFilter"
                  type="text"
                  value={dashboardFilter}
                  onChange={(e) => setDashboardFilter(e.target.value)}
                  placeholder="Digite o nome do dashboard..."
                />
              </div>
              <div>
                <label htmlFor="dashboardAreaFilterSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Filtrar por Área
                </label>
                <Select
                  id="dashboardAreaFilterSelect"
                  value={dashboardAreaFilter}
                  onChange={(e) => setDashboardAreaFilter(e.target.value)}
                >
                  <option value="">Todas as áreas</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id.toString()}>
                      {area.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {showDashboardForm && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">
                {editingDashboard ? 'Editar Dashboard' : 'Adicionar Novo Dashboard'}
              </h3>
              <form onSubmit={handleDashboardFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="dashboardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome do Dashboard
                  </label>
                  <Input
                    id="dashboardName"
                    type="text"
                    value={dashboardName}
                    onChange={(e) => setDashboardName(e.target.value)}
                    placeholder="Nome do Dashboard"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="dashboardUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL do Dashboard
                  </label>
                  <Input
                    id="dashboardUrl"
                    type="url"
                    value={dashboardUrl}
                    onChange={(e) => setDashboardUrl(e.target.value)}
                    placeholder="https://app.powerbi.com/..."
                    required
                  />
                </div>
                <div>
                  <label htmlFor="dashboardInformation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Informação
                  </label>
                  <Textarea
                    id="dashboardInformation"
                    value={dashboardInformation}
                    onChange={(e) => setDashboardInformation(e.target.value)}
                    placeholder="Informações sobre o dashboard"
                    rows={4}
                  />
                </div>
                <div>
                  <label htmlFor="dashboardArea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Área
                  </label>
                  <Select
                    id="dashboardArea"
                    value={selectedDashboardAreaId}
                    onChange={(e) => setSelectedDashboardAreaId(e.target.value)}
                    required
                  >
                    <option value="">Selecione uma área</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id.toString()}>
                        {area.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowDashboardForm(false);
                      setEditingDashboard(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingDashboard ? 'Atualizar' : 'Adicionar'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {isLoadingDashboards ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando dashboards...</p>
            </div>
          ) : filteredDashboards.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              {dashboards.length === 0 ? 'Nenhum dashboard encontrado. Adicione um novo dashboard para começar.' : 'Nenhum dashboard encontrado com os filtros aplicados.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <Th 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 w-16" 
                      onClick={() => toggleDashboardSort('id')}
                    >
                      ID
                      <SortIcon field="id" currentField={dashboardSortField} direction={dashboardSortDirection} />
                    </Th>
                    <Th 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 w-1/4" 
                      onClick={() => toggleDashboardSort('name')}
                    >
                      NOME
                      <SortIcon field="name" currentField={dashboardSortField} direction={dashboardSortDirection} />
                    </Th>
                    <Th 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 w-32" 
                      onClick={() => toggleDashboardSort('areaId')}
                    >
                      ÁREA
                      <SortIcon field="areaId" currentField={dashboardSortField} direction={dashboardSortDirection} />
                    </Th>
                    <Th className="w-1/4">URL</Th>
                    <Th className="w-24 text-center">INFORMAÇÃO</Th>
                    <Th className="w-40 text-right">AÇÕES</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDashboards.map((dashboard) => {
                    const area = areas.find((a) => a.id === dashboard.areaId);
                    return (
                      <tr key={dashboard.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Td className="w-16">{dashboard.id}</Td>
                        <Td className="w-1/4">{dashboard.name}</Td>
                        <Td className="w-32">{area?.name || 'Área não encontrada'}</Td>
                        <Td className="max-w-xs truncate w-1/4">
                          <a
                            href={dashboard.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {dashboard.url}
                          </a>
                        </Td>
                        <Td className="w-24 text-center">{dashboard.information ? 'Sim' : 'Não'}</Td>
                        <Td className="w-40">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleDashboardEdit(dashboard)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDashboardDelete(dashboard.id)}
                            >
                              Excluir
                            </Button>
                          </div>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-pink-600 dark:text-pink-400">Gerenciamento de Usuários</h2>
            <Button onClick={openUserFormForNew} size="md" className="w-full sm:w-auto">
              Adicionar Novo Usuário
            </Button>
          </div>

          {/* Filtros para Usuários */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white">Filtros</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="userEmailFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Filtrar por Email
                </label>
                <Input
                  id="userEmailFilter"
                  type="text"
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  placeholder="Digite o email do usuário..."
                />
              </div>
              <div>
                <label htmlFor="userRoleFilterSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Filtrar por Perfil
                </label>
                <Select
                  id="userRoleFilterSelect"
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                >
                  <option value="">Todos os perfis</option>
                  <option value="User">Usuário</option>
                  <option value="Admin">Administrador</option>
                </Select>
              </div>
              <div>
                <label htmlFor="userAreaFilterSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Filtrar por Área
                </label>
                <Select
                  id="userAreaFilterSelect"
                  value={userAreaFilter}
                  onChange={(e) => setUserAreaFilter(e.target.value)}
                >
                  <option value="">Todas as áreas</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id.toString()}>
                      {area.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {showUserForm && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">
                {editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
              </h3>
              <form onSubmit={handleUserFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Senha {editingUser && '(deixe em branco para manter a atual)'}
                  </label>
                  <Input
                    id="userPassword"
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    placeholder={editingUser ? '••••••••' : 'Nova senha'}
                    required={!editingUser}
                  />
                </div>
                <div>
                  <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Perfil
                  </label>
                  <Select
                    id="userRole"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    required
                  >
                    <option value="User">Usuário</option>
                    <option value="Admin">Administrador</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Áreas de Acesso
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md">
                    {areas.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma área disponível</p>
                    ) : (
                      areas.map((area) => (
                        <div key={area.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`area-${area.id}`}
                            checked={selectedUserAreaIds.includes(area.id)}
                            onChange={() => handleAreaSelection(area.id)}
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`area-${area.id}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            {area.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowUserForm(false);
                      setEditingUser(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingUser ? 'Atualizar' : 'Adicionar'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {isLoadingUsers ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando usuários...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              {users.length === 0 ? 'Nenhum usuário encontrado. Adicione um novo usuário para começar.' : 'Nenhum usuário encontrado com os filtros aplicados.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <Th 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" 
                      onClick={() => toggleUserSort('id')}
                    >
                      ID
                      <SortIcon field="id" currentField={userSortField} direction={userSortDirection} />
                    </Th>
                    <Th 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" 
                      onClick={() => toggleUserSort('email')}
                    >
                      EMAIL
                      <SortIcon field="email" currentField={userSortField} direction={userSortDirection} />
                    </Th>
                    <Th 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" 
                      onClick={() => toggleUserSort('role')}
                    >
                      PERFIL
                      <SortIcon field="role" currentField={userSortField} direction={userSortDirection} />
                    </Th>
                    <Th>ÁREAS DE ACESSO</Th>
                    <Th className="text-right">AÇÕES</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Td>{user.id}</Td>
                      <Td>{user.email}</Td>
                      <Td>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'Admin'
                              ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}
                        >
                          {user.role === 'Admin' ? 'Administrador' : 'Usuário'}
                        </span>
                      </Td>
                      <Td>
                        <div className="flex flex-wrap gap-1">
                          {user.areas && user.areas.length > 0 ? (
                            user.areas.map((area) => (
                              <span
                                key={area.id}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full"
                              >
                                {area.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 text-sm">Nenhuma área</span>
                          )}
                        </div>
                      </Td>
                      <Td>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleUserEdit(user)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPermissionsModal(user)}
                            disabled={!user.areas || user.areas.length === 0}
                          >
                            Permissões
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleUserDelete(user.id)}
                            disabled={user.id === 1}
                          >
                            Excluir
                          </Button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Modal de Gerenciamento de Permissões de Dashboard */}
          {showPermissionsModal && selectedUserForPermissions && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Gerenciar Permissões de Dashboard - {selectedUserForPermissions.email}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPermissionsModal(false)}
                    >
                      ✕
                    </Button>
                  </div>

                  {isLoadingUserAccess ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando acessos...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Seção: Acesso às Áreas */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                          Áreas com Acesso
                        </h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {selectedUserForPermissions.areas && selectedUserForPermissions.areas.length > 0 ? (
                            selectedUserForPermissions.areas.map((area) => (
                              <span
                                key={area.id}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                              >
                                {area.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                              Usuário não tem acesso a nenhuma área
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Seção: Acesso aos Dashboards */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                          Acesso aos Dashboards
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Selecione os dashboards específicos que o usuário pode acessar dentro das áreas permitidas.
                        </p>
                        
                        {selectedUserForPermissions.areas && selectedUserForPermissions.areas.length > 0 ? (
                          <div className="space-y-4">
                            {selectedUserForPermissions.areas.map((area) => {
                              const areaDashboards = dashboards.filter(d => d.areaId === area.id);
                              
                              if (areaDashboards.length === 0) {
                                return (
                                  <div key={area.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                    <h5 className="font-medium text-gray-800 dark:text-white mb-2">
                                      {area.name}
                                    </h5>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      Nenhum dashboard disponível nesta área
                                    </p>
                                  </div>
                                );
                              }

                              return (
                                <div key={area.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                  <h5 className="font-medium text-gray-800 dark:text-white mb-3">
                                    {area.name}
                                  </h5>
                                  <div className="space-y-2">
                                    {areaDashboards.map((dashboard) => (
                                      <div key={dashboard.id} className="flex items-center">
                                        <input
                                          type="checkbox"
                                          id={`dashboard-${dashboard.id}`}
                                          checked={selectedUserDashboardIds.includes(dashboard.id)}
                                          onChange={() => toggleDashboardAccess(dashboard.id)}
                                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                        />
                                        <label 
                                          htmlFor={`dashboard-${dashboard.id}`} 
                                          className="ml-3 block text-sm text-gray-700 dark:text-gray-300"
                                        >
                                          <div>
                                            <div className="font-medium">{dashboard.name}</div>
                                            {dashboard.information && (
                                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {dashboard.information}
                                              </div>
                                            )}
                                          </div>
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            O usuário precisa ter acesso a pelo menos uma área antes de receber acesso aos dashboards.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Button
                      variant="secondary"
                      onClick={() => setShowPermissionsModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={saveUserDashboardPermissions}
                      disabled={!selectedUserForPermissions.areas || selectedUserForPermissions.areas.length === 0}
                    >
                      Salvar Permissões
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'areas' && (
        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-pink-600 dark:text-pink-400">Gerenciamento de Áreas</h2>
            <Button onClick={openAreaFormForNew} size="md" className="w-full sm:w-auto">
              Adicionar Nova Área
            </Button>
          </div>

          {/* Filtros para Áreas */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white">Filtros</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="areaNameFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Filtrar por Nome
                </label>
                <Input
                  id="areaNameFilter"
                  type="text"
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  placeholder="Digite o nome da área..."
                />
              </div>
            </div>
          </div>

          {showAreaForm && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">
                {editingArea ? 'Editar Área' : 'Adicionar Nova Área'}
              </h3>
              <form onSubmit={handleAreaFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="areaName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome da Área
                  </label>
                  <Input
                    id="areaName"
                    type="text"
                    value={areaName}
                    onChange={(e) => setAreaName(e.target.value)}
                    placeholder="Nome da Área"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowAreaForm(false);
                      setEditingArea(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingArea ? 'Atualizar' : 'Adicionar'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {isLoadingAreas ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando áreas...</p>
            </div>
          ) : filteredAreas.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              {areas.length === 0 ? 'Nenhuma área encontrada. Adicione uma nova área para começar.' : 'Nenhuma área encontrada com os filtros aplicados.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <Th 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 w-16" 
                      onClick={() => toggleAreaSort('id')}
                    >
                      ID
                      <SortIcon field="id" currentField={areaSortField} direction={areaSortDirection} />
                    </Th>
                    <Th 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 w-1/3" 
                      onClick={() => toggleAreaSort('name')}
                    >
                      NOME
                      <SortIcon field="name" currentField={areaSortField} direction={areaSortDirection} />
                    </Th>
                    <Th className="w-32 text-center">DASHBOARDS</Th>
                    <Th className="w-48 text-right">AÇÕES</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAreas.map((area) => {
                    const areaDashboards = dashboards.filter(d => d.areaId === area.id);
                    return (
                      <tr key={area.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Td className="w-16">{area.id}</Td>
                        <Td className="w-1/3">{area.name}</Td>
                        <Td className="w-32 text-center">{areaDashboards.length}</Td>
                        <Td className="w-48">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleAreaEdit(area)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleAreaDelete(area.id)}
                              disabled={areaDashboards.length > 0} // Desabilita exclusão se houver dashboards vinculados
                            >
                              Excluir
                            </Button>
                          </div>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-pink-600 dark:text-pink-400">Gerenciamento de Logs</h2>
            <div className="flex gap-2">
              <Button 
                onClick={fetchLogsData} 
                variant="outline" 
                size="md" 
                className="w-full sm:w-auto"
                disabled={isLoadingLogs}
              >
                {isLoadingLogs ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Atualizando...
                  </>
                ) : (
                  <>
                    🔄 Atualizar
                  </>
                )}
              </Button>
              <Button onClick={handleExportLogs} variant="outline" size="md" className="w-full sm:w-auto">
                📥 Exportar
              </Button>
              <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="danger" size="md" className="w-full sm:w-auto">
                    🗑️ Limpar Logs
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md bg-white dark:bg-gray-800">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <span className="text-2xl">🗑️</span>
                      Limpar Logs de Auditoria
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Escolha o período de retenção dos logs:
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="retention"
                        value="30"
                        checked={clearRetentionDays === '30'}
                        onChange={(e) => setClearRetentionDays(e.target.value)}
                        className="text-pink-600"
                      />
                      <div>
                        <div className="font-medium">Últimos 30 dias</div>
                        <div className="text-sm text-gray-500">Remove logs anteriores a 1 mês</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="retention"
                        value="90"
                        checked={clearRetentionDays === '90'}
                        onChange={(e) => setClearRetentionDays(e.target.value)}
                        className="text-pink-600"
                      />
                      <div>
                        <div className="font-medium">Últimos 90 dias (Recomendado)</div>
                        <div className="text-sm text-gray-500">Remove logs anteriores a 3 meses</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="retention"
                        value="180"
                        checked={clearRetentionDays === '180'}
                        onChange={(e) => setClearRetentionDays(e.target.value)}
                        className="text-pink-600"
                      />
                      <div>
                        <div className="font-medium">Últimos 6 meses</div>
                        <div className="text-sm text-gray-500">Remove logs anteriores a 6 meses</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="retention"
                        value="all"
                        checked={clearRetentionDays === 'all'}
                        onChange={(e) => setClearRetentionDays(e.target.value)}
                        className="text-red-600"
                      />
                      <div>
                        <div className="font-medium text-red-600">Limpar TODOS os logs</div>
                        <div className="text-sm text-red-500">⚠️ Remove todos os registros (irreversível)</div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-600 text-lg">⚠️</span>
                      <div className="text-sm">
                        <div className="font-medium text-yellow-800">Importante:</div>
                        <div className="text-yellow-700 mt-1 space-y-1">
                          <div>• Esta ação remove os logs permanentemente</div>
                          <div>• Os logs removidos não podem ser recuperados</div>
                          <div>• Considere exportar os logs antes de limpar</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel disabled={isClearing}>
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearLogs}
                      disabled={isClearing}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isClearing ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Limpando...
                        </>
                      ) : (
                        <>
                          🗑️ Confirmar Limpeza
                        </>
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Filtros para Logs */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white">Filtros</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="logSearch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Buscar
                </label>
                <Input
                  id="logSearch"
                  type="text"
                  value={logSearchFilter}
                  onChange={(e) => setLogSearchFilter(e.target.value)}
                  placeholder="Buscar em mensagens..."
                />
              </div>
              <div>
                <label htmlFor="logLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nível
                </label>
                <Select
                  id="logLevel"
                  value={logLevelFilter}
                  onChange={(e) => setLogLevelFilter(e.target.value)}
                >
                  <option value="">Todos os níveis</option>
                  <option value="error">Error</option>
                  <option value="warn">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </Select>
              </div>
              <div>
                <label htmlFor="logUser" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Usuário
                </label>
                <Select
                  id="logUser"
                  value={logUserFilter}
                  onChange={(e) => setLogUserFilter(e.target.value)}
                >
                  <option value="">Todos os usuários</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id.toString()}>
                      {user.email}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label htmlFor="logAction" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ação
                </label>
                <Input
                  id="logAction"
                  type="text"
                  value={logActionFilter}
                  onChange={(e) => setLogActionFilter(e.target.value)}
                  placeholder="Ex: login, create, update..."
                />
              </div>
              <div>
                <label htmlFor="logResource" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recurso
                </label>
                <Input
                  id="logResource"
                  type="text"
                  value={logResourceFilter}
                  onChange={(e) => setLogResourceFilter(e.target.value)}
                  placeholder="Ex: dashboard, user, area..."
                />
              </div>
              <div>
                <label htmlFor="logStartDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data Início
                </label>
                <Input
                  id="logStartDate"
                  type="datetime-local"
                  value={logStartDateFilter}
                  onChange={(e) => setLogStartDateFilter(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="logEndDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data Fim
                </label>
                <Input
                  id="logEndDate"
                  type="datetime-local"
                  value={logEndDateFilter}
                  onChange={(e) => setLogEndDateFilter(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setLogSearchFilter('');
                    setLogLevelFilter('');
                    setLogUserFilter('');
                    setLogActionFilter('');
                    setLogResourceFilter('');
                    setLogStartDateFilter('');
                    setLogEndDateFilter('');
                    setLogsPage(1);
                  }}
                  variant="secondary"
                  size="md"
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </div>

          {isLoadingLogs ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando logs...</p>
            </div>
          ) : (!logs || logs.length === 0) ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              Nenhum log encontrado com os filtros aplicados.
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Mostrando {logs?.length || 0} de {logsTotal} logs (Página {logsPage})
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <thead>
                    <tr>
                      <Th>Timestamp</Th>
                      <Th>Nível</Th>
                      <Th>Usuário</Th>
                      <Th>Ação</Th>
                      <Th>Recurso</Th>
                      <Th>Mensagem</Th>
                      <Th className="w-32">IP</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {(logs || []).map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Td className="font-mono text-xs">
                          {formatTimestamp(log.timestamp)}
                        </Td>
                        <Td>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${formatLogLevel(log.level || 'info')}`}>
                            {(log.level || 'info').toUpperCase()}
                          </span>
                        </Td>
                        <Td>
                          {log.userName || log.user?.name || log.userEmail || `Usuário ID: ${log.userId}` || 'Usuário não encontrado'}
                        </Td>
                        <Td>
                          <span className="font-medium">{log.action || '-'}</span>
                        </Td>
                        <Td>
                          {log.resource || '-'}
                        </Td>
                        <Td className="max-w-xs">
                          <div className="truncate" title={log.message}>
                            {log.message}
                          </div>
                          {log.details && (
                            <details className="mt-1">
                              <summary className="text-xs text-gray-500 cursor-pointer">Detalhes</summary>
                              <pre className="text-xs bg-gray-100 dark:bg-gray-600 p-2 rounded mt-1 overflow-x-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </Td>
                        <Td className="font-mono text-xs">
                          {log.ip || '-'}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Paginação */}
              <div className="flex justify-between items-center mt-6">
                <Button
                  onClick={() => setLogsPage(Math.max(1, logsPage - 1))}
                  disabled={logsPage === 1}
                  variant="outline"
                  size="sm"
                >
                  ← Anterior
                </Button>
                
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Página {logsPage} de {Math.ceil(logsTotal / logsLimit)}
                </span>
                
                <Button
                  onClick={() => setLogsPage(logsPage + 1)}
                  disabled={logsPage >= Math.ceil(logsTotal / logsLimit)}
                  variant="outline"
                  size="sm"
                >
                  Próxima →
                </Button>
              </div>
            </>
          )}


        </div>
      )}
    </div>
  );}