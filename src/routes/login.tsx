import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Button, TextField, Label, Input, FieldError } from '@heroui/react'
import { loginUser } from '../services/api'
import { useAuthStore } from '../lib/auth'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

const loginSchema = z.object({
  email: z.string().email('Endereço de e-mail inválido').min(1, 'E-mail é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const inputClass =
  'w-full bg-zinc-100 rounded-[12px] px-4 py-3 text-[14px] text-zinc-800 outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-zinc-400 transition-all border border-transparent data-[invalid=true]:border-red-500 appearance-none shadow-none'
const labelClass = 'text-[14px] font-semibold text-secondary block'
const errorClass = 'text-[12px] text-red-500 mt-1 block'

function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true)
    setServerError(null)
    try {
      const { user, accessToken } = await loginUser(data)
      setAuth(user, accessToken)
      navigate({ to: '/' })
    } catch (err: any) {
      setServerError(err?.message || 'Erro ao fazer login')
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
            <svg
              className="w-8 h-8 text-secondary fill-none"
              viewBox="0 0 28 28"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 3C14 3 8.5 7.5 8.5 13.5C8.5 19.5 14 25 14 25C14 25 19.5 19.5 19.5 13.5C19.5 7.5 14 3 14 3Z" />
              <path d="M14 9C14 9 11.5 12 11.5 15.5C11.5 19 14 22 14 22C14 22 16.5 19 16.5 15.5C16.5 12 14 9 14 9Z" />
              <path d="M14 25V17" />
            </svg>
            <span className="text-[24px] font-extrabold text-secondary tracking-tight">
              Devmark
            </span>
          </div>
          <p className="text-secondary/60 text-[14px] font-medium text-center">
            Entre na sua conta para continuar
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
                  id="login-email"
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
                  placeholder="••••••••"
                  className={inputClass}
                  type="password"
                  autoComplete="current-password"
                  id="login-password"
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
            id="login-submit"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        {/* Register Link */}
        <p className="text-center text-[13px] text-secondary/60 font-medium">
          Não tem uma conta?{' '}
          <Link
            to="/register"
            className="text-secondary font-bold hover:underline transition-all"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
