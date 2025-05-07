"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "../../hooks/auth"
import Header from "../../components/Header"
import Link from "next/link"

// Dados simulados para administração
const initialUsers = [
  {
    id: 1,
    name: "Administrador",
    email: "admin@example.com",
    role: "admin",
    areas: ["Logística", "Marketing", "Operações", "CS", "Comercial"],
  },
  { id: 2, name: "Usuário Logística", email: "logistica@example.com", role: "user", areas: ["Logística"] },
  { id: 3, name: "Usuário Marketing", email: "marketing@example.com", role: "user", areas: ["Marketing"] },
  { id: 4, name: "Usuário Operações", email: "operacoes@example.com", role: "user", areas: ["Operações"] },
  { id: 5, name: "Usuário CS", email: "cs@example.com", role: "user", areas: ["CS"] },
  { id: 6, name: "Usuário Comercial", email: "comercial@example.com", role: "user", areas: ["Comercial"] },
]

const initialAreas = [
  { id: 1, name: "Logística", color: "#e91e63", icon: "🚚" },
  { id: 2, name: "Marketing", color: "#ff4081", icon: "📊" },
  { id: 3, name: "Operações", color: "#c2185b", icon: "⚙️" },
  { id: 4, name: "CS", color: "#ff80ab", icon: "🎯" },
  { id: 5, name: "Comercial", color: "#f48fb1", icon: "💼" },
]

const initialDashboards = [
  { id: 1, name: "Desempenho de Entregas", area: "Logística", url: "https://app.powerbi.com/view?r=123456" },
  { id: 2, name: "Gestão de Estoque", area: "Logística", url: "https://app.powerbi.com/view?r=123457" },
  { id: 3, name: "Rotas de Distribuição", area: "Logística", url: "https://app.powerbi.com/view?r=123458" },
  { id: 4, name: "Desempenho de Campanhas", area: "Marketing", url: "https://app.powerbi.com/view?r=123459" },
  { id: 5, name: "Engajamento nas Redes Sociais", area: "Marketing", url: "https://app.powerbi.com/view?r=123460" },
  { id: 6, name: "Eficiência Operacional", area: "Operações", url: "https://app.powerbi.com/view?r=123461" },
  { id: 7, name: "Controle de Qualidade", area: "Operações", url: "https://app.powerbi.com/view?r=123462" },
  { id: 8, name: "Satisfação do Cliente", area: "CS", url: "https://app.powerbi.com/view?r=123463" },
  { id: 9, name: "Tempo de Resolução", area: "CS", url: "https://app.powerbi.com/view?r=123464" },
  { id: 10, name: "Pipeline de Vendas", area: "Comercial", url: "https://app.powerbi.com/view?r=123465" },
  { id: 11, name: "Desempenho de Vendedores", area: "Comercial", url: "https://app.powerbi.com/view?r=123466" },
]

export default function AdminPanel() {
  const { user, loading } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState(initialUsers)
  const [areas, setAreas] = useState(initialAreas)
  const [dashboards, setDashboards] = useState(initialDashboards)

  // Estados para formulários
  const [showUserForm, setShowUserForm] = useState(false)
  const [showAreaForm, setShowAreaForm] = useState(false)
  const [showDashboardForm, setShowDashboardForm] = useState(false)

  // Estados para edição
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editingArea, setEditingArea] = useState<any>(null)
  const [editingDashboard, setEditingDashboard] = useState<any>(null)

  // Formulário de usuário
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    areas: [] as string[],
  })

  // Formulário de área
  const [areaForm, setAreaForm] = useState({
    name: "",
    color: "#e91e63",
    icon: "📊",
  })

  // Formulário de dashboard
  const [dashboardForm, setDashboardForm] = useState({
    name: "",
    area: "",
    url: "",
  })

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login")
        return
      }

      if (user.role !== "admin") {
        router.push("/dashboard")
        return
      }
    }
  }, [user, loading, router])

  // Funções para gerenciamento de usuários
  const handleAddUser = () => {
    setUserForm({
      name: "",
      email: "",
      password: "",
      role: "user",
      areas: [],
    })
    setEditingUser(null)
    setShowUserForm(true)
  }

  const handleEditUser = (user: any) => {
    setUserForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      areas: [...user.areas],
    })
    setEditingUser(user)
    setShowUserForm(true)
  }

  const handleSaveUser = () => {
    if (editingUser) {
      // Atualizar usuário existente
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: userForm.name, email: userForm.email, role: userForm.role, areas: userForm.areas }
            : u,
        ),
      )
    } else {
      // Adicionar novo usuário
      const newUser = {
        id: users.length + 1,
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        areas: userForm.areas,
      }
      setUsers([...users, newUser])
    }
    setShowUserForm(false)
  }

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  // Funções para gerenciamento de áreas
  const handleAddArea = () => {
    setAreaForm({
      name: "",
      color: "#e91e63",
      icon: "📊",
    })
    setEditingArea(null)
    setShowAreaForm(true)
  }

  const handleEditArea = (area: any) => {
    setAreaForm({
      name: area.name,
      color: area.color,
      icon: area.icon,
    })
    setEditingArea(area)
    setShowAreaForm(true)
  }

  const handleSaveArea = () => {
    if (editingArea) {
      // Atualizar área existente
      setAreas(
        areas.map((a) =>
          a.id === editingArea.id ? { ...a, name: areaForm.name, color: areaForm.color, icon: areaForm.icon } : a,
        ),
      )
    } else {
      // Adicionar nova área
      const newArea = {
        id: areas.length + 1,
        name: areaForm.name,
        color: areaForm.color,
        icon: areaForm.icon,
      }
      setAreas([...areas, newArea])
    }
    setShowAreaForm(false)
  }

  const handleDeleteArea = (areaId: number) => {
    setAreas(areas.filter((area) => area.id !== areaId))
  }

  // Funções para gerenciamento de dashboards
  const handleAddDashboard = () => {
    setDashboardForm({
      name: "",
      area: areas[0]?.name || "",
      url: "",
    })
    setEditingDashboard(null)
    setShowDashboardForm(true)
  }

  const handleEditDashboard = (dashboard: any) => {
    setDashboardForm({
      name: dashboard.name,
      area: dashboard.area,
      url: dashboard.url,
    })
    setEditingDashboard(dashboard)
    setShowDashboardForm(true)
  }

  const handleSaveDashboard = () => {
    // Validação da URL
    try {
      new URL(dashboardForm.url)
    } catch (_) {
      alert("URL inválida. Por favor, insira uma URL completa e válida (ex: https://app.powerbi.com/view?r=...).")
      return // Impede o salvamento se a URL for inválida
    }

    if (editingDashboard) {
      // Atualizar dashboard existente
      setDashboards(
        dashboards.map((d) =>
          d.id === editingDashboard.id
            ? { ...d, name: dashboardForm.name, area: dashboardForm.area, url: dashboardForm.url }
            : d,
        ),
      )
    } else {
      // Adicionar novo dashboard
      const newDashboard = {
        id: dashboards.length + 1,
        name: dashboardForm.name,
        area: dashboardForm.area,
        url: dashboardForm.url,
      }
      setDashboards([...dashboards, newDashboard])
    }
    setShowDashboardForm(false)
  }

  const handleDeleteDashboard = (dashboardId: number) => {
    setDashboards(dashboards.filter((dashboard) => dashboard.id !== dashboardId))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null // Será redirecionado no useEffect
  }

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center mb-6">
            <Link
              href="/dashboard"
              className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 mr-4"
            >
              ← Voltar ao Dashboard
            </Link>
            <h1 className="text-2xl font-semibold text-pink-700 dark:text-pink-400">Painel Administrativo</h1>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab("users")}
                  className={`admin-tab ${activeTab === "users" ? "admin-tab-active" : "admin-tab-inactive"}`}
                >
                  Usuários
                </button>
                <button
                  onClick={() => setActiveTab("areas")}
                  className={`admin-tab ${activeTab === "areas" ? "admin-tab-active" : "admin-tab-inactive"}`}
                >
                  Áreas
                </button>
                <button
                  onClick={() => setActiveTab("dashboards")}
                  className={`admin-tab ${activeTab === "dashboards" ? "admin-tab-active" : "admin-tab-inactive"}`}
                >
                  Dashboards
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "users" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Gerenciamento de Usuários</h2>
                    <button className="btn-primary" onClick={handleAddUser}>
                      Adicionar Usuário
                    </button>
                  </div>

                  {showUserForm && (
                    <div className="mb-6 p-4 bg-pink-50 dark:bg-gray-700 rounded-lg">
                      <h3 className="text-md font-medium mb-4 dark:text-white">
                        {editingUser ? "Editar Usuário" : "Novo Usuário"}
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nome
                          </label>
                          <input
                            type="text"
                            className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            value={userForm.name}
                            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            value={userForm.email}
                            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Senha
                          </label>
                          <input
                            type="password"
                            className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            value={userForm.password}
                            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                            placeholder={editingUser ? "Deixe em branco para manter a senha atual" : ""}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Perfil
                          </label>
                          <select
                            className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            value={userForm.role}
                            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                          >
                            <option value="user">Usuário</option>
                            <option value="admin">Administrador</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Áreas
                          </label>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                            {areas.map((area) => (
                              <div key={area.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`area-${area.id}`}
                                  checked={userForm.areas.includes(area.name)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setUserForm({ ...userForm, areas: [...userForm.areas, area.name] })
                                    } else {
                                      setUserForm({ ...userForm, areas: userForm.areas.filter((a) => a !== area.name) })
                                    }
                                  }}
                                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                                />
                                <label
                                  htmlFor={`area-${area.id}`}
                                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                                >
                                  {area.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button className="btn-secondary mr-2" onClick={() => setShowUserForm(false)}>
                          Cancelar
                        </button>
                        <button className="btn-primary" onClick={handleSaveUser}>
                          Salvar
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th scope="col" className="table-header dark:text-gray-300">
                            Nome
                          </th>
                          <th scope="col" className="table-header dark:text-gray-300">
                            Email
                          </th>
                          <th scope="col" className="table-header dark:text-gray-300">
                            Perfil
                          </th>
                          <th scope="col" className="table-header dark:text-gray-300">
                            Áreas
                          </th>
                          <th scope="col" className="table-header dark:text-gray-300">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="table-cell-primary dark:text-gray-200">{user.name}</td>
                            <td className="table-cell dark:text-gray-300">{user.email}</td>
                            <td className="table-cell dark:text-gray-300">
                              {user.role === "admin" ? "Administrador" : "Usuário"}
                            </td>
                            <td className="table-cell dark:text-gray-300">{user.areas.join(", ")}</td>
                            <td className="table-cell">
                              <button
                                className="text-pink-600 hover:text-pink-900 dark:text-pink-400 dark:hover:text-pink-300 mr-2"
                                onClick={() => handleEditUser(user)}
                              >
                                Editar
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "areas" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Gerenciamento de Áreas</h2>
                    <button className="btn-primary" onClick={handleAddArea}>
                      Adicionar Área
                    </button>
                  </div>

                  {showAreaForm && (
                    <div className="mb-6 p-4 bg-pink-50 dark:bg-gray-700 rounded-lg">
                      <h3 className="text-md font-medium mb-4 dark:text-white">
                        {editingArea ? "Editar Área" : "Nova Área"}
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nome
                          </label>
                          <input
                            type="text"
                            className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            value={areaForm.name}
                            onChange={(e) => setAreaForm({ ...areaForm, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cor</label>
                          <div className="flex">
                            <input
                              type="color"
                              className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600"
                              value={areaForm.color}
                              onChange={(e) => setAreaForm({ ...areaForm, color: e.target.value })}
                            />
                            <input
                              type="text"
                              className="input-field ml-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                              value={areaForm.color}
                              onChange={(e) => setAreaForm({ ...areaForm, color: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Ícone
                          </label>
                          <input
                            type="text"
                            className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            value={areaForm.icon}
                            onChange={(e) => setAreaForm({ ...areaForm, icon: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button className="btn-secondary mr-2" onClick={() => setShowAreaForm(false)}>
                          Cancelar
                        </button>
                        <button className="btn-primary" onClick={handleSaveArea}>
                          Salvar
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th scope="col" className="table-header dark:text-gray-300">
                            Nome
                          </th>
                          <th scope="col" className="table-header dark:text-gray-300">
                            Cor
                          </th>
                          <th scope="col" className="table-header dark:text-gray-300">
                            Ícone
                          </th>
                          <th scope="col" className="table-header dark:text-gray-300">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {areas.map((area) => (
                          <tr key={area.id}>
                            <td className="table-cell-primary dark:text-gray-200">{area.name}</td>
                            <td className="table-cell dark:text-gray-300">
                              <div className="flex items-center">
                                <div className="h-6 w-6 rounded mr-2" style={{ backgroundColor: area.color }}></div>
                                <span>{area.color}</span>
                              </div>
                            </td>
                            <td className="table-cell dark:text-gray-300">
                              <span className="text-2xl">{area.icon}</span>
                            </td>
                            <td className="table-cell">
                              <button
                                className="text-pink-600 hover:text-pink-900 dark:text-pink-400 dark:hover:text-pink-300 mr-2"
                                onClick={() => handleEditArea(area)}
                              >
                                Editar
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                onClick={() => handleDeleteArea(area.id)}
                              >
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "dashboards" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Gerenciamento de Dashboards</h2>
                    <button className="btn-primary" onClick={handleAddDashboard}>
                      Adicionar Dashboard
                    </button>
                  </div>

                  {showDashboardForm && (
                    <div className="mb-6 p-4 bg-pink-50 dark:bg-gray-700 rounded-lg">
                      <h3 className="text-md font-medium mb-4 dark:text-white">
                        {editingDashboard ? "Editar Dashboard" : "Novo Dashboard"}
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nome
                          </label>
                          <input
                            type="text"
                            className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            value={dashboardForm.name}
                            onChange={(e) => setDashboardForm({ ...dashboardForm, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Área
                          </label>
                          <select
                            className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            value={dashboardForm.area}
                            onChange={(e) => setDashboardForm({ ...dashboardForm, area: e.target.value })}
                          >
                            {areas.map((area) => (
                              <option key={area.id} value={area.name}>
                                {area.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            URL do Dashboard
                          </label>
                          <input
                            type="url"
                            className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            value={dashboardForm.url}
                            onChange={(e) => setDashboardForm({ ...dashboardForm, url: e.target.value })}
                          />
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            URL completa do dashboard (ex: https://app.powerbi.com/view?r=...)
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button className="btn-secondary mr-2" onClick={() => setShowDashboardForm(false)}>
                          Cancelar
                        </button>
                        <button className="btn-primary" onClick={handleSaveDashboard}>
                          Salvar
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th scope="col" className="table-header dark:text-gray-300">
                            Nome
                          </th>
                          <th scope="col" className="table-header dark:text-gray-300">
                            Área
                          </th>
                          <th scope="col" className="table-header dark:text-gray-300">
                            URL
                          </th>
                          <th scope="col" className="table-header dark:text-gray-300">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {dashboards.map((dashboard) => (
                          <tr key={dashboard.id}>
                            <td className="table-cell-primary dark:text-gray-200">{dashboard.name}</td>
                            <td className="table-cell dark:text-gray-300">{dashboard.area}</td>
                            <td className="table-cell truncate max-w-xs dark:text-gray-300">{dashboard.url}</td>
                            <td className="table-cell">
                              <button
                                className="text-pink-600 hover:text-pink-900 dark:text-pink-400 dark:hover:text-pink-300 mr-2"
                                onClick={() => handleEditDashboard(dashboard)}
                              >
                                Editar
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                onClick={() => handleDeleteDashboard(dashboard.id)}
                              >
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
