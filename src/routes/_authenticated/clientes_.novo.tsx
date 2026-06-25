import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, TextField, Label, Input, FieldError, Select, ListBox } from '@heroui/react'
import { ChevronLeft, ChevronRight, Plus } from '@gravity-ui/icons'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '../../services/api'

export const Route = createFileRoute('/_authenticated/clientes_/novo')({
  component: NovoCliente
})

// Validation Schema
const clientSchema = z.object({
  name: z.string().min(1, 'Nome completo é obrigatório'),
  email: z.string().email('Endereço de e-mail inválido').min(1, 'E-mail é obrigatório'),
  company_name: z.string(),
  document: z.string(),
  phone: z.string(),
  preferred_communication: z.enum(['WHATSAPP', 'EMAIL', 'PHONE', 'MEETING']),
  preferred_payment_method: z.enum(['PIX', 'BANK_TRANSFER', 'CREDIT_CARD', 'CASH'])
})

type ClientFormValues = z.infer<typeof clientSchema>

const inputClass = "w-full bg-zinc-100 rounded-[12px] px-3 py-2 text-[14px] text-zinc-600 outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-zinc-700 transition-all border border-transparent data-[invalid=true]:border-red-500 appearance-none shadow-none"
const labelClass = 'text-[14px] font-semibold text-secondary block'
const errorClass = 'text-[12px] text-red-500 mt-1 block'

function NovoCliente() {
  const navigate = useNavigate()
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

  const onSubmit = async (data: ClientFormValues) => {
    try {
      await createClient({
        ...data,
        status: 'ACTIVE'
      })
      navigate({ to: '/clientes' })
    } catch (err) {
      console.error('Failed to create client:', err)
    }
  }

  // Step titles
  const stepTitles: Record<number, string> = {
    1: 'Informações Pessoais',
    2: 'Informações Empresariais',
    3: 'Contato & Preferências',
    4: 'Configuração Financeira'
  }

  return (
    <div className="bg-white rounded-[24px] p-8 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none">
      {/* Wizard Header */}
      <div className="flex items-center gap-2 mb-8">
        <Button
          size="sm"
          className="size-8 min-w-8 bg-primary/50 hover:bg-primary text-secondary border-none rounded-full p-0 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          onPress={handleBack}
        >
          <ChevronLeft width={16} height={16} />
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight text-secondary leading-none">
          Novo Cliente
        </h1>
      </div>

      {/* Step Subtitle */}
      <h2 className="text-[16px] font-semibold text-secondary mb-6">
        {stepTitles[currentStep]}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
        <div className="flex-1 max-w-3xl">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="grid grid-cols-2 gap-6">
              <div>
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
                      <Label className={labelClass}>
                        Nome Completo <span className="text-red-500">*</span>
                      </Label>
                      <Input placeholder="Ex: John Smith" className={inputClass} />
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </TextField>
                  )}
                />
              </div>

              <div>
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
                      <Label className={labelClass}>
                        E-mail <span className="text-red-500">*</span>
                      </Label>
                      <Input placeholder="Ex: john@acme.com" className={inputClass} />
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </TextField>
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
                  render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <TextField
                      name={name}
                      value={value || ''}
                      onChange={onChange}
                      isInvalid={!!error}
                      className="flex flex-col gap-1.5 w-full"
                    >
                      <Label className={labelClass}>Nome da Empresa</Label>
                      <Input placeholder="Ex: Acme Corp" className={inputClass} />
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </TextField>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="document"
                  control={control}
                  render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <TextField
                      name={name}
                      value={value || ''}
                      onChange={onChange}
                      isInvalid={!!error}
                      className="flex flex-col gap-1.5 w-full"
                    >
                      <Label className={labelClass}>CNPJ / CPF</Label>
                      <Input placeholder="Ex: 12.345.678/0001-90" className={inputClass} />
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </TextField>
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
                  render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <TextField
                      name={name}
                      value={value || ''}
                      onChange={onChange}
                      isInvalid={!!error}
                      className="flex flex-col gap-1.5 w-full"
                    >
                      <Label className={labelClass}>Telefone / WhatsApp</Label>
                      <Input placeholder="Ex: (11) 99999-9999" className={inputClass} />
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </TextField>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="preferred_communication"
                  control={control}
                  render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <Select
                      name={name}
                      selectedKey={value || null}
                      onSelectionChange={(k) => onChange(k)}
                      isInvalid={!!error}
                      className="flex flex-col gap-1.5 w-full"
                      placeholder="Selecione a comunicação preferida"
                    >
                      <Label className={labelClass}>Comunicação Preferencial</Label>
                      <Select.Trigger className={`${inputClass} flex items-center justify-between`}>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="WHATSAPP" textValue="WhatsApp">
                            WhatsApp
                          </ListBox.Item>
                          <ListBox.Item id="EMAIL" textValue="E-mail">
                            E-mail
                          </ListBox.Item>
                          <ListBox.Item id="PHONE" textValue="Telefone">
                            Telefone
                          </ListBox.Item>
                          <ListBox.Item id="MEETING" textValue="Reunião">
                            Reunião
                          </ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </Select>
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
                  render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <Select
                      name={name}
                      selectedKey={value || null}
                      onSelectionChange={(k) => onChange(k)}
                      isInvalid={!!error}
                      className="flex flex-col gap-1.5 w-full"
                      placeholder="Selecione o pagamento preferido"
                    >
                      <Label className={labelClass}>Método de Pagamento Preferido</Label>
                      <Select.Trigger className={`${inputClass} flex items-center justify-between`}>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="PIX" textValue="PIX">
                            PIX
                          </ListBox.Item>
                          <ListBox.Item id="BANK_TRANSFER" textValue="Boleto / Transferência">
                            Boleto / Transferência
                          </ListBox.Item>
                          <ListBox.Item id="CREDIT_CARD" textValue="Cartão de Crédito">
                            Cartão de Crédito
                          </ListBox.Item>
                          <ListBox.Item id="CASH" textValue="Dinheiro">
                            Dinheiro
                          </ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </Select>
                  )}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center gap-3 mt-10 shrink-0">
          {currentStep === 1 ? (
            <Button
              type="button"
              className="bg-zinc-100 text-zinc-400 font-medium rounded-full px-6 py-2 border-none text-[13px] cursor-not-allowed"
              onPress={handleBack}
              size="lg"
              isDisabled
            >
              <ChevronLeft className="size-4" />
              Anterior
            </Button>
          ) : (
            <Button
              type="button"
              className="bg-secondary hover:bg-primary text-white hover:text-secondary font-medium rounded-full px-6 py-2 border-none text-[13px] cursor-pointer transition-all duration-200"
              onPress={handleBack}
              size="lg"
            >
              <ChevronLeft className="size-4" />
              Anterior
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button
              type="button"
              className="bg-secondary hover:bg-primary text-white hover:text-secondary font-medium rounded-full px-6 py-2 border-none text-[13px] cursor-pointer transition-all duration-200"
              onPress={handleNext}
              size="lg"
            >
              Próximo
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-secondary hover:bg-primary hover:text-secondary text-white font-medium rounded-full px-6 py-2 border-none text-[13px] cursor-pointer transition-all duration-200 flex items-center gap-1.5"
              size="lg"
            >
              <Plus />
              Criar Cliente
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
