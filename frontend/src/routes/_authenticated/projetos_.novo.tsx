import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, TextField, Label, Input, FieldError, Select, ListBox, Checkbox, Description } from '@heroui/react'
import { ChevronLeft, ChevronRight, Plus, Sparkles } from '@gravity-ui/icons'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { createProject, createProjectWithTasks, fetchClients } from '../../services/api'
import { api } from '../../lib/axios'
import { toast } from '../../components/ui/Toast'
export const Route = createFileRoute('/_authenticated/projetos_/novo')({
  component: NovoProjeto
})

// Schema de validação
const projectSchema = z.object({
  client_id: z.string().min(1, 'Obrigatório'),
  name: z.string().min(1, 'Obrigatório'),
  area: z.string().min(1, 'Obrigatório') as z.ZodType<'MARKETING' | 'DEVELOPER'>,
  specialty: z.string().min(1, 'Obrigatório') as z.ZodType<'FRONTEND' | 'BACKEND' | 'SEO'>,
  project_value: z.number().min(0, 'Inválido'),
  amount_received: z.number().min(0, 'Inválido'),

  start_date: z.string().min(1, 'Obrigatório'),
  expected_delivery_date: z.string().min(1, 'Obrigatório'),
  estimated_hours: z.number().min(1, 'Inválido'),
  priority: z.string().min(1, 'Obrigatório') as z.ZodType<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>,
  status: z.string().min(1, 'Obrigatório') as z.ZodType<'PLANNING' | 'IN_PROGRESS' | 'WAITING_CLIENT'>,
  create_tasks_ai: z.boolean()
})

type ProjectFormValues = z.infer<typeof projectSchema>

const inputClass = "w-full bg-zinc-100 rounded-[12px] px-3 py-2 text-[14px] text-zinc-600 outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-zinc-700 transition-all border border-transparent data-[invalid=true]:border-red-500 appearance-none shadow-none"
const labelClass = "text-[14px] font-semibold text-secondary block"
const errorClass = "text-[12px] text-red-500 mt-1 block"

function NovoProjeto() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 6
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  })

  const { mutate: mutateCreateNormal } = useMutation({
    mutationFn: (data: any) => createProject(data),
    onMutate: async (newProject) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] })
      const previousProjects = queryClient.getQueryData(['projects'])
      queryClient.setQueryData(['projects'], (old: any) => {
        const optimisticProject = {
          ...newProject,
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          status: 'PENDING'
        }
        return [optimisticProject, ...(old || [])]
      })
      return { previousProjects }
    },
    onError: (err: any, _newProject, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects)
      }
      toast.error(err?.response?.data?.message || 'Erro ao criar projeto.')
    },
    onSuccess: () => {
      toast.success('Projeto criado com sucesso!')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })

  const {
    control,
    handleSubmit,
    trigger
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      client_id: '',
      name: '',
      area: '' as any,
      specialty: '' as any,
      project_value: 0,
      amount_received: 0,

      start_date: '',
      expected_delivery_date: '',
      estimated_hours: 0,
      priority: '' as any,
      status: '' as any,
      create_tasks_ai: false
    }
  })

  // Define os campos que devem ser validados em cada etapa
  const stepFields: Record<number, (keyof ProjectFormValues)[]> = {
    1: ['client_id', 'name'],
    2: ['area', 'specialty'],
    3: ['project_value', 'amount_received'],
    4: ['start_date', 'expected_delivery_date'],
    5: ['estimated_hours', 'priority'],
    6: ['status', 'create_tasks_ai']
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
      navigate({ to: '/projetos' })
    }
  }

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true)
    try {
      if (data.create_tasks_ai) {
        toast.info('Criando projeto e gerando tarefas com IA...')
        
        const messageText = `O usuário preencheu o formulário de projeto manualmente. Crie as tarefas para este projeto: ${JSON.stringify(data)}. Retorne is_complete: true e as tarefas.`
        const aiResponse = await api.post('/ai/chat', {
          messages: [{ role: 'user', parts: [{ text: messageText }] }],
          model: 'gemini-2.5-flash'
        })
        
        const result = aiResponse.data
        const { create_tasks_ai, ...projectData } = data
        if (result.is_complete && result.tasks && result.tasks.length > 0) {
          await createProjectWithTasks(projectData as any, result.tasks)
          toast.success('Projeto e tarefas criados com sucesso!')
        } else {
          await createProject(projectData as any)
          toast.success('Projeto criado, mas não foi possível gerar tarefas.')
        }
        queryClient.invalidateQueries({ queryKey: ['projects'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        navigate({ to: '/projetos' })
      } else {
        const { create_tasks_ai, ...projectData } = data
        mutateCreateNormal(projectData as any)
        // Redirecionamento instantâneo (optimistic UI)
        navigate({ to: '/projetos' })
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Erro ao criar projeto.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Define títulos das etapas
  const stepTitles: Record<number, string> = {
    1: 'Informações Gerais',
    2: 'Área de Atuação',
    3: 'Financeiro',
    4: 'Datas',
    5: 'Planejamento',
    6: 'Status'
  }

  return (
    <div className="bg-white rounded-[24px] p-8 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none">
      {/* Header do Wizard */}
      <div className="flex items-center gap-3 mb-8">
        <Button
          size="sm"
          className="size-8 min-w-8 bg-primary/50 hover:bg-primary text-secondary border-none rounded-full p-0 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          onPress={handleBack}
        >
          <ChevronLeft width={16} height={16} />
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight text-secondary leading-none">
          Novo Projeto
        </h1>
      </div>

      {/* Subtítulo da Etapa */}
      <h2 className="text-[16px] font-semibold text-secondary mb-6">
        {stepTitles[currentStep]}
      </h2>

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
        <div className="flex-1 max-w-3xl">
          {currentStep === 1 && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Controller
                  name="client_id"
                  control={control}
                  render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <Select
                      name={name}
                      selectedKey={value || null}
                      onSelectionChange={(k) => onChange(k)}
                      isInvalid={!!error}
                      className="w-full"
                      placeholder="Selecione o cliente"
                    >
                      <Label className={labelClass}>Cliente <span className="text-red-500">*</span></Label>
                      <Select.Trigger className={`${inputClass} flex items-center justify-between`}>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {clients?.map((client: any) => (
                            <ListBox.Item key={client.id} id={client.id} textValue={client.name}>
                              {client.name}
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </Select>
                  )}
                />
              </div>

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
                      <Label className={labelClass}>Nome do Projeto <span className="text-red-500">*</span></Label>
                      <Input placeholder="Projeto" className={inputClass} />
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </TextField>
                  )}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Controller
                  name="area"
                  control={control}
                  render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <Select
                      name={name}
                      selectedKey={value || null}
                      onSelectionChange={(k) => onChange(k)}
                      isInvalid={!!error}
                      className="flex flex-col gap-1.5 w-full"
                      placeholder="Selecione a área"
                    >
                      <Label className={labelClass}>Área <span className="text-red-500">*</span></Label>
                      <Select.Trigger className={`${inputClass} flex items-center justify-between`}>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="MARKETING" textValue="Marketing">Marketing</ListBox.Item>
                          <ListBox.Item id="DEVELOPER" textValue="Desenvolvimento">Desenvolvimento</ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="specialty"
                  control={control}
                  render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <Select
                      name={name}
                      selectedKey={value || null}
                      onSelectionChange={(k) => onChange(k)}
                      isInvalid={!!error}
                      className="flex flex-col gap-1.5 w-full"
                      placeholder="Selecione a especialidade"
                    >
                      <Label className={labelClass}>Especialidade <span className="text-red-500">*</span></Label>
                      <Select.Trigger className={`${inputClass} flex items-center justify-between`}>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="FRONTEND" textValue="Frontend">Frontend</ListBox.Item>
                          <ListBox.Item id="BACKEND" textValue="Backend">Backend</ListBox.Item>
                          <ListBox.Item id="SEO" textValue="SEO">SEO</ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </Select>
                  )}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Controller
                  name="project_value"
                  control={control}
                  render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <TextField
                      name={name}
                      value={value ? value.toString() : ''}
                      onChange={(val) => onChange(parseFloat(val) || 0)}
                      isInvalid={!!error}
                      className="flex flex-col gap-1.5 w-full relative"
                    >
                      <Label className={labelClass}>Valor do Projeto <span className="text-red-500">*</span></Label>
                      <div className="relative w-full">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50 text-[14px] z-10">R$</span>
                        <Input type="number" placeholder="0,00" className={`${inputClass} pl-10`} />
                      </div>
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </TextField>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="amount_received"
                  control={control}
                  render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <TextField
                      name={name}
                      value={value ? value.toString() : ''}
                      onChange={(val) => onChange(parseFloat(val) || 0)}
                      isInvalid={!!error}
                      className="flex flex-col gap-1.5 w-full relative"
                    >
                      <Label className={labelClass}>Valor Recebido <span className="text-red-500">*</span></Label>
                      <div className="relative w-full">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50 text-[14px] z-10">R$</span>
                        <Input type="number" placeholder="0,00" className={`${inputClass} pl-10`} />
                      </div>
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </TextField>
                  )}
                />
              </div>


            </div>
          )}

          {currentStep === 4 && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Controller
                  name="start_date"
                  control={control}
                  render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <TextField
                      name={name}
                      value={value || ''}
                      onChange={onChange}
                      isInvalid={!!error}
                      className="flex flex-col gap-1.5 w-full"
                    >
                      <Label className={labelClass}>Data de Início <span className="text-red-500">*</span></Label>
                      <Input type="date" className={inputClass} />
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </TextField>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="expected_delivery_date"
                  control={control}
                  render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <TextField
                      name={name}
                      value={value || ''}
                      onChange={onChange}
                      isInvalid={!!error}
                      className="flex flex-col gap-1.5 w-full"
                    >
                      <Label className={labelClass}>Data de Entrega Prevista <span className="text-red-500">*</span></Label>
                      <Input type="date" className={inputClass} />
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </TextField>
                  )}
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Controller
                  name="estimated_hours"
                  control={control}
                  render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <TextField
                      name={name}
                      value={value ? value.toString() : ''}
                      onChange={(val) => onChange(parseInt(val, 10) || 0)}
                      isInvalid={!!error}
                      className="flex flex-col gap-1.5 w-full"
                    >
                      <Label className={labelClass}>Horas Previstas <span className="text-red-500">*</span></Label>
                      <Input type="number" placeholder="0" className={inputClass} />
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </TextField>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <Select
                      name={name}
                      selectedKey={value || null}
                      onSelectionChange={(k) => onChange(k)}
                      isInvalid={!!error}
                      className="flex flex-col gap-1.5 w-full"
                      placeholder="Selecione a prioridade"
                    >
                      <Label className={labelClass}>Prioridade <span className="text-red-500">*</span></Label>
                      <Select.Trigger className={`${inputClass} flex items-center justify-between`}>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="LOW" textValue="Baixa">Baixa</ListBox.Item>
                          <ListBox.Item id="MEDIUM" textValue="Média">Média</ListBox.Item>
                          <ListBox.Item id="HIGH" textValue="Alta">Alta</ListBox.Item>
                          <ListBox.Item id="URGENT" textValue="Urgente">Urgente</ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </Select>
                  )}
                />
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="flex flex-col gap-8">
              <div className="w-1/2 pr-3">
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <Select
                      name={name}
                      selectedKey={value || null}
                      onSelectionChange={(k) => onChange(k)}
                      isInvalid={!!error}
                      className="flex flex-col gap-1.5 w-full"
                      placeholder="Selecione o status"
                    >
                      <Label className={labelClass}>Status do Projeto <span className="text-red-500">*</span></Label>
                      <Select.Trigger className={`${inputClass} flex items-center justify-between`}>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="PLANNING" textValue="Planejamento">Planejamento</ListBox.Item>
                          <ListBox.Item id="IN_PROGRESS" textValue="Em progresso">Em progresso</ListBox.Item>
                          <ListBox.Item id="WAITING_CLIENT" textValue="Aguardando cliente">Aguardando cliente</ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </Select>
                  )}
                />
              </div>

              <Controller
                name="create_tasks_ai"
                control={control}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <Checkbox
                    isSelected={!!value}
                    onChange={(e: any) => {
                      if (typeof e === 'boolean') {
                        onChange(e);
                      } else if (e && e.target && typeof e.target.checked === 'boolean') {
                        onChange(e.target.checked);
                      } else {
                        onChange(!value);
                      }
                    }}
                    isInvalid={!!error}
                    className="w-[60%]"
                  >
                    <Checkbox.Content>
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      Criar tarefas com IA
                    </Checkbox.Content>
                    <Description className="text-secondary/60 text-[12px]">
                      Crie tarefas baseadas na descrição do projeto.
                    </Description>
                    <FieldError>{error?.message}</FieldError>
                  </Checkbox>
                )}
              />
            </div>
          )}
        </div>

        {/* Botões do Rodapé */}
        <div className="flex items-center gap-3 mt-10">
          {currentStep === 1 ? (
            <Button
              className="bg-zinc-700 text-white font-medium rounded-full px-6 py-2 border-none text-[13px] cursor-not-allowed"
              onPress={() => navigate({ to: '/projetos' })}
              size='lg'
              isDisabled
            >
              <ChevronLeft className='size-4' />
              Anterior
            </Button>
          ) : (
            <Button
              className="bg-secondary hover:bg-primary text-white hover:text-secondary font-medium rounded-full px-6 py-2 border-none text-[13px] cursor-pointer transition-all duration-200"
              onPress={handleBack}
              size='lg'
            >
              <ChevronLeft className='size-4' />
              Anterior
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button
              className="bg-secondary hover:bg-primary text-white hover:text-secondary font-medium rounded-full px-6 py-2 border-none text-[13px] cursor-pointer transition-all duration-200"
              onPress={handleNext}
              size='lg'
            >
              Próximo
              <ChevronRight className='size-4' />
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-secondary hover:bg-primary hover:text-secondary text-white font-medium rounded-full px-6 py-2 border-none text-[13px] cursor-pointer transition-all durantion-200"
              size='lg'
              isDisabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </span>
              ) : (
                <>
                  <Plus />
                  Criar Projeto
                </>
              )}
            </Button>
          )}

          <Button
            className="bg-primary/50 hover:bg-primary text-secondary font-semibold rounded-full px-6 py-2 border-none text-[13px] cursor-pointer transition-colors duration-200"
            onPress={() => navigate({ to: '/projetos/ia' })}
            size='lg'
          >
            <Sparkles />
            Criar com IA
          </Button>
        </div>
      </form>

    </div>
  )
}
