import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Check, Lock } from '@gravity-ui/icons'
import { useAuthStore } from '../../lib/auth'
import { useMutation } from '@tanstack/react-query'
import { updateProfile } from '../../services/api'
import type { UpdateProfileData } from '../../services/api'
import { toast } from '../../components/ui/Toast'
import { Button, TextField, Label, Input } from '@heroui/react'

const inputClass = "w-full bg-zinc-100 rounded-[12px] px-3 py-2 text-[14px] text-zinc-600 outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-zinc-700 transition-all border border-transparent data-[invalid=true]:border-red-500 appearance-none shadow-none"
const labelClass = "text-[14px] font-semibold text-secondary block"

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
    <div className="bg-white rounded-[24px] p-8 overflow-y-auto min-w-0 scrollbar-none flex flex-col gap-10">
      {/* Page Heading */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-medium tracking-tight text-secondary leading-none flex items-center gap-3">
          Configurações
        </h1>
        <p className="text-sm text-zinc-400">
          Gerencie suas informações pessoais e de segurança
        </p>
      </div>

      <hr />

      <div className="flex flex-col gap-10">
        {/* Profile Card */}
        <div className="max-w-[400px] flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-secondary">
              Perfil
            </h2>
            <p className="text-sm text-zinc-400">
              Atualize seu nome e endereço de e-mail.
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6">
              <TextField
                value={name}
                onChange={setName}
                className="flex flex-col gap-2 w-full"
              >
                <Label className={labelClass}>Nome Completo</Label>
                <Input type="text" className={inputClass} placeholder="Seu nome" />
              </TextField>

              <TextField
                value={email}
                onChange={setEmail}
                className="flex flex-col gap-2 w-full"
              >
                <Label className={labelClass}>E-mail</Label>
                <Input type="email" className={inputClass} placeholder="seu@email.com" />
              </TextField>
            </div>

            <div className="flex">
              <Button
                type="submit"
                size="lg"
                className="font-medium text-sm rounded-full bg-primary/50 text-secondary hover:bg-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none"
                isDisabled={isSavingProfile || !name.trim() || !email.trim() || (name === user?.name && email === user?.email)}
              >
                {!isSavingProfile && <Check className="size-4" />}
                {isSavingProfile ? 'Salvando...' : 'Salvar Perfil'}
              </Button>
            </div>
          </form>
        </div>

        <hr />

        {/* Password Card */}
        <div className="max-w-[400px] flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-secondary">
              Segurança
            </h2>
            <p className="text-sm text-zinc-400">
              Altere sua senha para manter sua conta segura.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6">
            <div className="max-w-md flex flex-col gap-6">
              <TextField
                value={currentPassword}
                onChange={setCurrentPassword}
                className="flex flex-col gap-2 w-full"
              >
                <Label className={labelClass}>Senha Atual</Label>
                <Input type="password" className={inputClass} placeholder="••••••••" />
              </TextField>

              <div className="my-1 h-px bg-zinc-200" />

              <TextField
                value={newPassword}
                onChange={setNewPassword}
                className="flex flex-col gap-2 w-full"
              >
                <Label className={labelClass}>Nova Senha</Label>
                <Input type="password" className={inputClass} placeholder="••••••••" />
              </TextField>

              <TextField
                value={confirmPassword}
                onChange={setConfirmPassword}
                className="flex flex-col gap-2 w-full"
              >
                <Label className={labelClass}>Confirmar Nova Senha</Label>
                <Input type="password" className={inputClass} placeholder="••••••••" />
              </TextField>
            </div>

            <div className="flex">
              <Button
                type="submit"
                size="lg"
                className="font-medium text-sm rounded-full bg-primary/50 text-secondary hover:bg-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none"
                isDisabled={isSavingPassword || !currentPassword || !newPassword || !confirmPassword}
              >
                {!isSavingPassword && <Lock className="size-4" />}
                {isSavingPassword ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
