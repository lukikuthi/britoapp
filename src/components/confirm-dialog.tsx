import { create } from "zustand";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmState {
  isOpen: boolean;
  message: string;
  title: string;
  resolve: (value: boolean) => void;
  confirm: (message: string, title?: string) => Promise<boolean>;
  close: (value: boolean) => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  isOpen: false,
  message: "",
  title: "Confirmação",
  resolve: () => {},
  confirm: (message, title = "Confirmação") =>
    new Promise((resolve) => {
      set({ isOpen: true, message, title, resolve });
    }),
  close: (value) => {
    set((state) => {
      state.resolve(value);
      return { isOpen: false };
    });
  },
}));

export function ConfirmDialog() {
  const { isOpen, message, title, close } = useConfirmStore();

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && close(false)}>
      <AlertDialogContent className="max-w-[90vw] sm:max-w-[425px] rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-base">{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0 mt-4 flex-col-reverse sm:flex-row">
          <AlertDialogCancel onClick={() => close(false)}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => close(true)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
