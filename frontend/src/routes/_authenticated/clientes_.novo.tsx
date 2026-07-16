import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Plus } from '@gravity-ui/icons'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '../../services/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Input } from '../../components/ui/Input'
import { Select, SelectItem } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { formatDocument, formatPhone } from '../../lib/masks'

export const Route = createFileRoute('/_authenticated/clientes_/novo')({
  component: NovoCliente
})

// Validation Schema
const clientSchema = z.object({
  name: z.string().min(1, 'Nome completo é obrigatório'),
  email: z.string().email('Endereço de e-mail inválido').min(1, 'E-mail é obrigatório'),
  company_name: z.string().optional(),
  document: z.string().optional(),
  phone: z.string().optional(),
  preferred_communication: z.enum(['WHATSAPP', 'EMAIL', 'PHONE', 'MEETING']),
  preferred_payment_method: z.enum(['PIX', 'BANK_TRANSFER', 'CREDIT_CARD', 'CASH'])
})

type ClientFormValues = z.infer<typeof clientSchema>

const labelClass = 'text-[14px] font-semibold text-secondary block mb-1.5'
const errorClass = 'text-[12px] text-red-500 mt-1 block'

function NovoCliente() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const { control, handleSubmit, trigger } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      email: '',
      company_name: '',
      document: '',
      phone: '',
      preferred_communication: 'WHATSAPP',
      preferred_payment_method: 'PIX'
    }
  })

  const { mutate: mutateCreate, isPending } = useMutation({
    mutationFn: (data: ClientFormValues) => createClient({ 
      ...data, 
      company_name: data.company_name || '',
      document: data.document || '',
      phone: data.phone || '',
      status: 'ACTIVE' 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      navigate({ to: '/clientes' })
    }
  })

  // Form step fields validation targets
  const stepFields: Record<number, (keyof ClientFormValues)[]> = {
    1: ['name', 'email'],
    2: ['company_name', 'document'],
    3: ['phone', 'preferred_communication'],
    4: ['preferred_payment_method']
  }

  const handleNext = async () => {
    const fieldsToValidate = stepFields[currentStep]
    const isStepValid = await trigger(fieldsToValidate)
    if (isStepValid && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    } else {
      navigate({ to: '/clientes' })
    }
  }

  const onSubmit = (data: ClientFormValues) => {
    mutateCreate(data)
  }

  // Step titles
  const stepTitles: Record<number, string> = {
    1: 'Informações Pessoais',
    2: 'Informações Empresariais',
    3: 'Contato & Preferências',
    4: 'Configuração Financeira'
  }

  return (
    <div className="bg-white rounded-[24px] p-8 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-6">
      {/* Wizard Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="zinc"
          size="sm"
          className="size-8 min-w-8 p-0 flex items-center justify-center shrink-0 cursor-pointer"
          onPress={handleBack}
        >
          <ChevronLeft width={16} height={16} />
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight text-secondary leading-none">
          Novo Cliente
        </h1>
      </div>

      {/* Step Subtitle */}
      <h2 className="text-[16px] font-semibold text-secondary">
        {stepTitles[currentStep]}
      </h2>

      {/* Form */}
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col flex-1">
        <div className="flex-1 max-w-3xl">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>
                        Nome Completo <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        {...field}
                        placeholder="Ex: John Smith" 
                        className={error ? 'border-red-500 focus-within:border-red-500' : ''}
                      />
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>
                        E-mail <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        {...field}
                        type="email"
                        placeholder="Ex: john@acme.com" 
                        className={error ? 'border-red-500 focus-within:border-red-500' : ''}
                      />
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
                  )}
                />
              </div>
            </div>
          )}

          {/* Step 2: Corporate Info */}
          {currentStep === 2 && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Controller
                  name="company_name"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>Nome da Empresa</label>
                      <Input 
                        {...field}
                        placeholder="Ex: Acme Corp" 
                        className={error ? 'border-red-500 focus-within:border-red-500' : ''}
                      />
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="document"
                  control={control}
                  render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>CNPJ / CPF</label>
                      <Input 
                        {...field}
                        value={value || ''}
                        onChange={(e) => onChange(formatDocument(e.target.value))}
                        placeholder="Ex: 12.345.678/0001-90" 
                        className={error ? 'border-red-500 focus-within:border-red-500' : ''}
                      />
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
                  )}
                />
              </div>
            </div>
          )}

          {/* Step 3: Contact & Communication */}
          {currentStep === 3 && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>Telefone / WhatsApp</label>
                      <Input 
                        {...field}
                        value={value || ''}
                        onChange={(e) => onChange(formatPhone(e.target.value))}
                        placeholder="Ex: (11) 99999-9999" 
                        className={error ? 'border-red-500 focus-within:border-red-500' : ''}
                      />
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="preferred_communication"
                  control={control}
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>Comunicação Preferencial</label>
                      <Select
                        ariaLabel="Comunicação Preferencial"
                        selectedKey={value}
                        onSelectionChange={(key) => onChange(key)}
                        className="w-full"
                        triggerClassName="w-full h-10 px-4 rounded-full justify-between"
                        placeholder="Selecione a comunicação preferencial"
                        icon={null}
                      >
                        <SelectItem id="WHATSAPP">WhatsApp</SelectItem>
                        <SelectItem id="EMAIL">E-mail</SelectItem>
                        <SelectItem id="PHONE">Telefone</SelectItem>
                        <SelectItem id="MEETING">Reunião</SelectItem>
                      </Select>
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
                  )}
                />
              </div>
            </div>
          )}

          {/* Step 4: Finance settings */}
          {currentStep === 4 && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Controller
                  name="preferred_payment_method"
                  control={control}
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>Método de Pagamento Preferido</label>
                      <Select
                        ariaLabel="Método de Pagamento"
                        selectedKey={value}
                        onSelectionChange={(key) => onChange(key)}
                        className="w-full"
                        triggerClassName="w-full h-10 px-4 rounded-full justify-between"
                        placeholder="Selecione o pagamento preferido"
                        icon={null}
                      >
                        <SelectItem id="PIX">PIX</SelectItem>
                        <SelectItem id="BANK_TRANSFER">Boleto / Transferência</SelectItem>
                        <SelectItem id="CREDIT_CARD">Cartão de Crédito</SelectItem>
                        <SelectItem id="CASH">Dinheiro</SelectItem>
                      </Select>
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
                  )}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center gap-3 mt-10 shrink-0">
          <Button
            type="button"
            variant="zinc"
            onPress={handleBack}
            className="flex items-center gap-1 px-6 py-2"
            isDisabled={currentStep === 1}
          >
            <ChevronLeft className="size-4" />
            Anterior
          </Button>

          {currentStep < totalSteps ? (
            <Button
              type="button"
              variant="secondary"
              onPress={handleNext}
              className="flex items-center gap-1 px-6 py-2 text-white hover:text-secondary"
            >
              Próximo
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              className="flex items-center gap-1.5 px-6 py-2 text-white hover:text-secondary"
              isDisabled={isPending}
              onPress={() => handleSubmit(onSubmit)()}
            >
              <Plus />
              {isPending ? 'Criando...' : 'Criar Cliente'}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
