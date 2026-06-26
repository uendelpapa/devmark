import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Card } from '@heroui/react'
import { Gear, Check, Lock, ShieldCheck } from '@gravity-ui/icons'
import { useAuthStore } from '../../lib/auth'
import { useMutation } from '@tanstack/react-query'
import { updateProfile } from '../../services/api'
import type { UpdateProfileData } from '../../services/api'
import { toast } from '../../components/ui/Toast'

export const Route = createFileRoute('/_authenticated/configuracoes')({
  component: Configuracoes
})

function Configuracoes() {
  const { user, updateUser } = useAuthStore()

  // Profile Form State
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Sync state if user changes externally (e.g. initial load)
  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const { mutate: saveProfile, isPending: isSavingProfile } = useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser)
      toast.success('Perfil atualizado com sucesso!')
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Erro ao atualizar perfil'
      toast.error(msg)
    }
  })

  const { mutate: savePassword, isPending: isSavingPassword } = useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(data),
    onSuccess: () => {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Senha alterada com sucesso!')
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Erro ao alterar senha'
      toast.error(msg)
    }
  })

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    const data: UpdateProfileData = {}
    if (name !== user?.name) data.name = name
    if (email !== user?.email) data.email = email

    if (Object.keys(data).length === 0) {
      toast.info('Nenhuma alteração detectada')
      return
    }

    saveProfile(data)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Preencha todos os campos de senha')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('A nova senha e a confirmação não conferem')
      return
    }

    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter no mínimo 6 caracteres')
      return
    }

    savePassword({
      currentPassword,
      newPassword
    })
  }

  return (
    <div className="bg-white rounded-[24px] p-8 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-10">
      {/* Page Heading */}
      <div className="flex justify-between items-center shrink-0 border-b border-zinc-100 pb-6">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-secondary leading-none flex items-center gap-3">
            <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Gear className="size-6" />
            </div>
            Configurações
          </h1>
          <p className="text-sm font-medium text-secondary/50 mt-4">
            Gerencie suas informações pessoais e de segurança
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-10 max-w-[800px]">
        {/* Profile Card */}
        <div className="p-8 bg-zinc-50/50 border border-zinc-200/60 rounded-[24px]">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              Perfil
            </h2>
            <p className="text-sm text-secondary/50">
              Atualize seu nome e endereço de e-mail.
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-secondary/70">Nome Completo</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-secondary/70">E-mail</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="font-bold rounded-xl px-8 bg-primary text-white hover:bg-primary/90 py-2.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none"
                disabled={isSavingProfile || !name.trim() || !email.trim() || (name === user?.name && email === user?.email)}
              >
                {!isSavingProfile && <Check className="size-4" />}
                {isSavingProfile ? 'Salvando...' : 'Salvar Perfil'}
              </button>
            </div>
          </form>
        </div>

        {/* Password Card */}
        <div className="p-8 bg-zinc-50/50 border border-zinc-200/60 rounded-[24px]">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <Lock className="size-5 text-primary" />
              Segurança
            </h2>
            <p className="text-sm text-secondary/50">
              Altere sua senha para manter sua conta segura.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6">
            <div className="max-w-md flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-secondary/70">Senha Atual</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
                />
              </div>
              <div className="my-1 h-px bg-zinc-200" />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-secondary/70">Nova Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-secondary/70">Confirmar Nova Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="font-bold rounded-xl px-8 bg-secondary text-white hover:bg-secondary/90 py-2.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none"
                disabled={isSavingPassword || !currentPassword || !newPassword || !confirmPassword}
              >
                {!isSavingPassword && <Lock className="size-4" />}
                {isSavingPassword ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
