import { Modal } from '@heroui/react'
import { Button } from '../ui/Button'
import { useState, useEffect } from 'react'
import { Check } from '@gravity-ui/icons'

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName: string;
  isPending: boolean;
}

export function DeleteProjectModal({ isOpen, onClose, onConfirm, projectName, isPending }: DeleteProjectModalProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={true} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm" />
      <Modal.Container className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md rounded-[24px] z-[101] shadow-2xl">
        <Modal.Dialog className="outline-none">
          <Modal.Header className="flex flex-col gap-1 p-6 border-b border-zinc-100">
            <h2 className="text-xl font-bold text-secondary">Excluir Projeto</h2>
          </Modal.Header>
          <Modal.Body className="p-6">
            <p className="text-secondary/80 text-sm">
              Tem certeza que deseja excluir o projeto <strong className="text-secondary">{projectName}</strong>? Essa ação não pode ser desfeita e apagará todas as tarefas e movimentações financeiras atreladas.
            </p>
          </Modal.Body>
          <Modal.Footer className="p-6 border-t border-zinc-100 flex justify-end gap-3">
            <Button
              onPress={onClose}
              variant="zinc"
              isDisabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              onPress={onConfirm}
              variant="secondary"
              className="bg-red-500 hover:bg-red-600 text-white border-none"
              isDisabled={isPending}
            >
              Sim, Excluir
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  );
}

interface ChangeProjectStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newStatus: string) => void;
  currentStatus: string;
  isPending: boolean;
}

const PROJECT_STATUSES = [
  { key: 'PLANNING', label: 'Planejamento', dotColor: 'bg-zinc-400' },
  { key: 'IN_PROGRESS', label: 'Em Andamento', dotColor: 'bg-amber-500' },
  { key: 'WAITING_CLIENT', label: 'Aguardando Cliente', dotColor: 'bg-purple-500' },
  { key: 'REVIEW', label: 'Revisão', dotColor: 'bg-blue-500' },
  { key: 'COMPLETED', label: 'Concluído', dotColor: 'bg-lime-500' },
  { key: 'CANCELED', label: 'Cancelado', dotColor: 'bg-red-500' },
];

export function ChangeProjectStatusModal({ isOpen, onClose, onConfirm, currentStatus, isPending }: ChangeProjectStatusModalProps) {
  const [status, setStatus] = useState(currentStatus);

  useEffect(() => {
    if (isOpen) {
      setStatus(currentStatus);
    }
  }, [isOpen, currentStatus]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={true} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop className="fixed inset-0 bg-black/25 z-[100] backdrop-blur-xs" />
      <Modal.Container className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm bg-white rounded-[24px] z-[101] shadow-xl border border-zinc-100">
        <Modal.Dialog className="outline-none">
          <Modal.Header className="flex flex-col gap-1 p-5 border-b border-zinc-100">
            <h2 className="text-lg font-bold text-secondary">Alterar Status</h2>
          </Modal.Header>
          <Modal.Body className="p-5 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              {PROJECT_STATUSES.map((item) => {
                const isSelected = status === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setStatus(item.key)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer bg-transparent text-left outline-none border-none ${isSelected
                        ? 'bg-zinc-100 text-secondary'
                        : 'text-secondary/70 hover:bg-zinc-50 hover:text-secondary'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`size-2.5 rounded-full ${item.dotColor} shrink-0`} />
                      <span>{item.label}</span>
                    </div>
                    {isSelected && (
                      <Check className="size-4 text-secondary stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </Modal.Body>
          <Modal.Footer className="p-5 border-t border-zinc-100 flex justify-end gap-2.5">
            <Button
              onPress={onClose}
              variant="zinc"
              className="h-9 px-4 text-xs"
              isDisabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              onPress={() => onConfirm(status)}
              variant="primary"
              className="h-9 px-4 text-xs"
              isDisabled={isPending}
            >
              Salvar
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  );
}
