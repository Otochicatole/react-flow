export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ImportStatus {
  loading: boolean;
  message: string;
  success: boolean | null;
}

export interface CategoryState {
  [categoryId: string]: boolean;
}

export interface DragItem {
  type: string;
  nodeType: string;
}