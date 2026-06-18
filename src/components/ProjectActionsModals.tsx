import { Modal, Button, Select, ListBox } from '@heroui/react'
import { useState, useEffect } from 'react'

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
      <Modal.Container className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-[24px] z-[101] shadow-2xl">
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
              variant="ghost"
              className="bg-zinc-100 text-secondary font-bold hover:bg-zinc-200"
              isDisabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              onPress={onConfirm}
              className="bg-red-500 text-white hover:bg-red-600 font-bold"
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
  { key: 'PLANNING', label: 'Planejamento' },
  { key: 'IN_PROGRESS', label: 'Em Andamento' },
  { key: 'WAITING_CLIENT', label: 'Aguardando Cliente' },
  { key: 'REVIEW', label: 'Revisão' },
  { key: 'COMPLETED', label: 'Concluído' },
  { key: 'CANCELED', label: 'Cancelado' },
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
      <Modal.Backdrop className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm" />
      <Modal.Container className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-[24px] z-[101] shadow-2xl">
        <Modal.Dialog className="outline-none">
          <Modal.Header className="flex flex-col gap-1 p-6 border-b border-zinc-100">
            <h2 className="text-xl font-bold text-secondary">Alterar Status</h2>
          </Modal.Header>
          <Modal.Body className="p-6 overflow-visible">
            <Select
              selectedKey={status}
              onSelectionChange={(key) => {
                setStatus(key as string);
              }}
              className="flex flex-col gap-1.5 w-full"
            >
              <Select.Trigger className="bg-white border border-zinc-200 rounded-xl px-3 py-2 flex items-center justify-between text-secondary font-medium">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {PROJECT_STATUSES.map((item) => (
                    <ListBox.Item id={item.key} textValue={item.label} className="text-secondary">
                      {item.label}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </Modal.Body>
          <Modal.Footer className="p-6 border-t border-zinc-100 flex justify-end gap-3">
            <Button
              onPress={onClose}
              variant="ghost"
              className="bg-zinc-100 text-secondary font-bold hover:bg-zinc-200"
              isDisabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              onPress={() => onConfirm(status)}
              className="bg-primary/50 text-secondary hover:bg-primary font-bold"
              isDisabled={isPending}
            >
              Salvar Status
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  );
}
