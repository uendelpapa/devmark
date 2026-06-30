import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Button, TextField, Label, Input, FieldError } from '@heroui/react'
import { registerUser } from '../services/api'
import { useAuthStore } from '../lib/auth'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

const registerSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Endereço de e-mail inválido').min(1, 'E-mail é obrigatório'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

const inputClass =
  'w-full bg-zinc-100 rounded-[12px] px-4 py-3 text-[14px] text-zinc-800 outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-zinc-400 transition-all border border-transparent data-[invalid=true]:border-red-500 appearance-none shadow-none'
const labelClass = 'text-[14px] font-semibold text-secondary block'
const errorClass = 'text-[12px] text-red-500 mt-1 block'

function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true)
    setServerError(null)
    try {
      const { user, accessToken } = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      setAuth(user, accessToken)
      navigate({ to: '/' })
    } catch (err: any) {
      setServerError(err?.message || 'Erro ao criar conta')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-backpage p-4">
      {/* Floating card */}
      <div className="w-full max-w-[440px] bg-white rounded-[32px] shadow-2xl shadow-secondary/10 p-10 flex flex-col gap-8 animate-slide-in">
        {/* Logo + Heading */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-0.5">
            <img src="/logo.svg" alt="Logo" />
            <span className="text-[24px] font-extrabold text-secondary tracking-tight">
              Devmark
            </span>
          </div>
          <p className="text-secondary/60 text-[14px] font-medium text-center">
            Crie sua conta para começar
          </p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] font-medium rounded-[12px] px-4 py-3 text-center">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Controller
            name="name"
            control={control}
            render={({ field: { name, value, onChange }, fieldState: { error } }) => (
              <TextField
                name={name}
                value={value || ''}
                onChange={onChange}
                isInvalid={!!error}
                className="flex flex-col gap-1.5 w-full"
              >
                <Label className={labelClass}>Nome completo</Label>
                <Input
                  placeholder="Seu nome"
                  className={inputClass}
                  autoComplete="name"
                  id="register-name"
                />
                <FieldError className={errorClass}>{error?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field: { name, value, onChange }, fieldState: { error } }) => (
              <TextField
                name={name}
                value={value || ''}
                onChange={onChange}
                isInvalid={!!error}
                className="flex flex-col gap-1.5 w-full"
              >
                <Label className={labelClass}>E-mail</Label>
                <Input
                  placeholder="seu@email.com"
                  className={inputClass}
                  type="email"
                  autoComplete="email"
                  id="register-email"
                />
                <FieldError className={errorClass}>{error?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field: { name, value, onChange }, fieldState: { error } }) => (
              <TextField
                name={name}
                value={value || ''}
                onChange={onChange}
                isInvalid={!!error}
                className="flex flex-col gap-1.5 w-full"
              >
                <Label className={labelClass}>Senha</Label>
                <Input
                  placeholder="Mínimo 6 caracteres"
                  className={inputClass}
                  type="password"
                  autoComplete="new-password"
                  id="register-password"
                />
                <FieldError className={errorClass}>{error?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { name, value, onChange }, fieldState: { error } }) => (
              <TextField
                name={name}
                value={value || ''}
                onChange={onChange}
                isInvalid={!!error}
                className="flex flex-col gap-1.5 w-full"
              >
                <Label className={labelClass}>Confirmar senha</Label>
                <Input
                  placeholder="Repita sua senha"
                  className={inputClass}
                  type="password"
                  autoComplete="new-password"
                  id="register-confirm-password"
                />
                <FieldError className={errorClass}>{error?.message}</FieldError>
              </TextField>
            )}
          />

          <Button
            type="submit"
            isDisabled={isSubmitting}
            className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-full py-3 h-12 border-none text-[15px] cursor-pointer transition-all duration-200 mt-2"
            size="lg"
            id="register-submit"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Criando conta...
              </span>
            ) : (
              'Criar conta'
            )}
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-center text-[13px] text-secondary/60 font-medium">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="text-secondary font-bold hover:underline transition-all"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
