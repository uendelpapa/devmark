import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, FloppyDisk } from '@gravity-ui/icons'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProjectDetails, updateProject, fetchClients } from '../../services/api'
import { Input } from '../../components/ui/Input'
import { Select, SelectItem } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { formatCurrencyBRL, parseCurrencyToNumber } from '../../lib/masks'

export const Route = createFileRoute('/_authenticated/projetos_/$projectId/editar')({
  component: EditarProjeto
})

// Schema de validação
const projectSchema = z.object({
  client_id: z.string().min(1, 'Cliente é obrigatório'),
  name: z.string().min(1, 'Nome do projeto é obrigatório'),
  area: z.enum(['MARKETING', 'DEVELOPER']),
  specialty: z.enum(['FRONTEND', 'BACKEND', 'SEO']),
  project_value: z.number().min(0, 'Valor inválido'),
  amount_received: z.number().min(0, 'Valor inválido'),
  start_date: z.string().min(1, 'Data de início é obrigatória'),
  expected_delivery_date: z.string().min(1, 'Data de entrega é obrigatória'),
  estimated_hours: z.number().min(1, 'Mínimo de 1 hora'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'WAITING_CLIENT', 'REVIEW', 'COMPLETED', 'CANCELED'])
})

type ProjectFormValues = z.infer<typeof projectSchema>

const labelClass = "text-[14px] font-semibold text-secondary block mb-1.5"
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

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  })

  const {
    control,
    handleSubmit,
    trigger,
    reset
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      client_id: '',
      name: '',
      area: undefined as any,
      specialty: undefined as any,
      project_value: 0,
      amount_received: 0,
      start_date: '',
      expected_delivery_date: '',
      estimated_hours: 0,
      priority: 'MEDIUM',
      status: 'PLANNING'
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
        start_date: project.start_date ? project.start_date.split('T')[0] : '',
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
    3: ['project_value', 'amount_received'],
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
    return <div className="p-8 text-secondary font-medium">Carregando dados do projeto...</div>
  }

  return (
    <div className="bg-white rounded-[24px] p-8 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-6">
      {/* Header */}
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
          Editar Projeto
        </h1>
      </div>

      {/* Subtítulo da Etapa */}
      <h2 className="text-[16px] font-semibold text-secondary">
        {stepTitles[currentStep]}
      </h2>

      {/* Formulário */}
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col flex-1">
        <div className="flex-1 max-w-3xl">
          {currentStep === 1 && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Controller
                  name="client_id"
                  control={control}
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>Cliente <span className="text-red-500">*</span></label>
                      <Select
                        ariaLabel="Cliente"
                        selectedKey={value}
                        onSelectionChange={(key) => onChange(key)}
                        className="w-full"
                        triggerClassName="w-full h-10 px-4 rounded-full justify-between"
                        placeholder="Selecione o cliente"
                        icon={null}
                      >
                        {clients?.map((client: any) => (
                          <SelectItem key={client.id} id={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </Select>
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>Nome do Projeto <span className="text-red-500">*</span></label>
                      <Input 
                        {...field}
                        placeholder="Nome do Projeto" 
                        className={error ? 'border-red-500 focus-within:border-red-500' : ''}
                      />
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
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
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>Área <span className="text-red-500">*</span></label>
                      <Select
                        ariaLabel="Área"
                        selectedKey={value}
                        onSelectionChange={(key) => onChange(key)}
                        className="w-full"
                        triggerClassName="w-full h-10 px-4 rounded-full justify-between"
                        placeholder="Selecione a área"
                        icon={null}
                      >
                        <SelectItem id="MARKETING">Marketing</SelectItem>
                        <SelectItem id="DEVELOPER">Desenvolvimento</SelectItem>
                      </Select>
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="specialty"
                  control={control}
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>Especialidade <span className="text-red-500">*</span></label>
                      <Select
                        ariaLabel="Especialidade"
                        selectedKey={value}
                        onSelectionChange={(key) => onChange(key)}
                        className="w-full"
                        triggerClassName="w-full h-10 px-4 rounded-full justify-between"
                        placeholder="Selecione a especialidade"
                        icon={null}
                      >
                        <SelectItem id="FRONTEND">Frontend</SelectItem>
                        <SelectItem id="BACKEND">Backend</SelectItem>
                        <SelectItem id="SEO">SEO</SelectItem>
                      </Select>
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
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
                  render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>Valor do Projeto <span className="text-red-500">*</span></label>
                      <Input
                        {...field}
                        value={formatCurrencyBRL(value)}
                        onChange={(e) => onChange(parseCurrencyToNumber(e.target.value))}
                        placeholder="R$ 0,00"
                        className={error ? 'border-red-500 focus-within:border-red-500' : ''}
                      />
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="amount_received"
                  control={control}
                  render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>Valor Recebido <span className="text-red-500">*</span></label>
                      <Input
                        {...field}
                        value={formatCurrencyBRL(value)}
                        onChange={(e) => onChange(parseCurrencyToNumber(e.target.value))}
                        placeholder="R$ 0,00"
                        className={error ? 'border-red-500 focus-within:border-red-500' : ''}
                      />
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
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
                  render={({ field, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>Data de Início <span className="text-red-500">*</span></label>
                      <Input 
                        {...field}
                        type="date" 
                        className={error ? 'border-red-500 focus-within:border-red-500' : ''} 
                      />
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="expected_delivery_date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>Data de Entrega Prevista <span className="text-red-500">*</span></label>
                      <Input 
                        {...field}
                        type="date" 
                        className={error ? 'border-red-500 focus-within:border-red-500' : ''} 
                      />
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
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
                  render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>Horas Previstas <span className="text-red-500">*</span></label>
                      <Input 
                        {...field}
                        type="number" 
                        placeholder="Ex: 80"
                        value={value || ''}
                        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
                        className={error ? 'border-red-500 focus-within:border-red-500' : ''} 
                      />
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>Prioridade <span className="text-red-500">*</span></label>
                      <Select
                        ariaLabel="Prioridade"
                        selectedKey={value}
                        onSelectionChange={(key) => onChange(key)}
                        className="w-full"
                        triggerClassName="w-full h-10 px-4 rounded-full justify-between"
                        placeholder="Selecione a prioridade"
                        icon={null}
                      >
                        <SelectItem id="LOW">Baixa</SelectItem>
                        <SelectItem id="MEDIUM">Média</SelectItem>
                        <SelectItem id="HIGH">Alta</SelectItem>
                        <SelectItem id="URGENT">Urgente</SelectItem>
                      </Select>
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
                  )}
                />
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>Status do Projeto <span className="text-red-500">*</span></label>
                      <Select
                        ariaLabel="Status"
                        selectedKey={value}
                        onSelectionChange={(key) => onChange(key)}
                        className="w-full"
                        triggerClassName="w-full h-10 px-4 rounded-full justify-between"
                        placeholder="Selecione o status"
                        icon={null}
                      >
                        <SelectItem id="PLANNING">Planejamento</SelectItem>
                        <SelectItem id="IN_PROGRESS">Em progresso</SelectItem>
                        <SelectItem id="WAITING_CLIENT">Aguardando cliente</SelectItem>
                        <SelectItem id="REVIEW">Revisão</SelectItem>
                        <SelectItem id="COMPLETED">Concluído</SelectItem>
                        <SelectItem id="CANCELED">Cancelado</SelectItem>
                      </Select>
                      {error && <span className={errorClass}>{error.message}</span>}
                    </div>
                  )}
                />
              </div>
            </div>
          )}
        </div>

        {/* Botões do Rodapé */}
        <div className="flex items-center gap-3 mt-10">
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
              className="flex items-center gap-1 px-6 py-2 text-white hover:text-secondary cursor-pointer"
            >
              Próximo
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="secondary"
              className="flex items-center gap-1.5 px-6 py-2 text-white hover:text-secondary cursor-pointer"
              isDisabled={updateMutation.isPending}
              onPress={() => handleSubmit(onSubmit)()}
            >
              {updateMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </span>
              ) : (
                <>
                  <FloppyDisk className="size-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
