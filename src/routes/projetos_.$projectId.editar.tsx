import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, TextField, Label, Input, FieldError, Select, ListBox } from '@heroui/react'
import { ChevronLeft, ChevronRight, FloppyDisk } from '@gravity-ui/icons'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProjectDetails, updateProject } from '../services/api'

export const Route = createFileRoute('/projetos_/$projectId/editar')({
  component: EditarProjeto
})

// Schema de validação
const projectSchema = z.object({
  client_id: z.string().min(1, 'Obrigatório'),
  name: z.string().min(1, 'Obrigatório'),
  area: z.string().min(1, 'Obrigatório'),
  specialty: z.string().min(1, 'Obrigatório'),
  project_value: z.number().min(0, 'Inválido'),
  amount_received: z.number().min(0, 'Inválido'),
  payment_status: z.string().min(1, 'Obrigatório'),
  start_date: z.string().min(1, 'Obrigatório'),
  expected_delivery_date: z.string().min(1, 'Obrigatório'),
  estimated_hours: z.number().min(1, 'Inválido'),
  priority: z.string().min(1, 'Obrigatório'),
  status: z.string().min(1, 'Obrigatório')
})

type ProjectFormValues = z.infer<typeof projectSchema>

const inputClass = "w-full bg-zinc-100 rounded-[12px] px-3 py-2 text-[14px] text-zinc-600 outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-zinc-700 transition-all border border-transparent data-[invalid=true]:border-red-500 appearance-none shadow-none"
const labelClass = "text-[14px] font-semibold text-secondary block"
const errorClass = "text-[12px] text-red-500 mt-1 block"

function EditarProjeto() {
  const { projectId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 6

  const { data: project, isLoading } = useQuery({
    queryKey: ['projectDetails', projectId],
    queryFn: () => fetchProjectDetails(projectId),
    enabled: !!projectId
  })

  const {
    control,
    handleSubmit,
    trigger,
    reset
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      client_id: '',
      name: '',
      area: '',
      specialty: '',
      project_value: 0,
      amount_received: 0,
      payment_status: '',
      start_date: '',
      expected_delivery_date: '',
      estimated_hours: 0,
      priority: '',
      status: ''
    }
  })

  useEffect(() => {
    if (project) {
      reset({
        client_id: project.client_id || '',
        name: project.name || '',
        area: project.area || 'MARKETING',
        specialty: 'FRONTEND', // Adapte conforme backend
        project_value: project.project_value || 0,
        amount_received: project.amount_received || 0,
        payment_status: 'PENDING', // Adapte
        start_date: project.created_at ? project.created_at.split('T')[0] : '',
        expected_delivery_date: project.expected_delivery_date ? project.expected_delivery_date.split('T')[0] : '',
        estimated_hours: project.estimated_hours || 0,
        priority: project.priority || 'MEDIUM',
        status: project.status || 'PLANNING'
      })
    }
  }, [project, reset])

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['projectDetails', projectId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      navigate({ to: '/projetos' })
    }
  })


  const stepFields: Record<number, (keyof ProjectFormValues)[]> = {
    1: ['client_id', 'name'],
    2: ['area', 'specialty'],
    3: ['project_value', 'amount_received', 'payment_status'],
    4: ['start_date', 'expected_delivery_date'],
    5: ['estimated_hours', 'priority'],
    6: ['status']
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

  const onSubmit = (data: ProjectFormValues) => {
    updateMutation.mutate(data)
  }

  const stepTitles: Record<number, string> = {
    1: 'Informações Gerais',
    2: 'Área de Atuação',
    3: 'Financeiro',
    4: 'Datas',
    5: 'Planejamento',
    6: 'Status'
  }

  if (isLoading) {
    return <div className="p-8 text-secondary">Carregando dados do projeto...</div>
  }

  return (
    <div className="bg-white rounded-[24px] p-8 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none">
      <div className="flex items-center gap-3 mb-8">
        <Button
          size="sm"
          className="size-8 min-w-8 bg-primary/50 hover:bg-primary text-secondary border-none rounded-full p-0 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          onPress={handleBack}
        >
          <ChevronLeft width={16} height={16} />
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight text-secondary leading-none">
          Editar Projeto
        </h1>
      </div>

      <h2 className="text-[16px] font-semibold text-secondary mb-6">
        {stepTitles[currentStep]}
      </h2>

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
                          <ListBox.Item id="c1" textValue="Bob Inc">Bob Inc</ListBox.Item>
                          <ListBox.Item id="c2" textValue="Fred Tech">Fred Tech</ListBox.Item>
                          {project?.client_id && (
                            <ListBox.Item id={project.client_id} textValue={project.client?.name || project.client_id}>
                              {project.client?.name || 'Cliente atual'}
                            </ListBox.Item>
                          )}
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

              <div>
                <Controller
                  name="payment_status"
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
                      <Label className={labelClass}>Status do pagamento <span className="text-red-500">*</span></Label>
                      <Select.Trigger className={`${inputClass} flex items-center justify-between`}>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="PENDING" textValue="Pendente">Pendente</ListBox.Item>
                          <ListBox.Item id="PAID" textValue="Pago">Pago</ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                      <FieldError className={errorClass}>{error?.message}</FieldError>
                    </Select>
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
                          <ListBox.Item id="REVIEW" textValue="Revisão">Revisão</ListBox.Item>
                          <ListBox.Item id="COMPLETED" textValue="Concluído">Concluído</ListBox.Item>
                          <ListBox.Item id="CANCELED" textValue="Cancelado">Cancelado</ListBox.Item>
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
              isDisabled={updateMutation.isPending}
            >
              <FloppyDisk />
              Salvar Alterações
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
