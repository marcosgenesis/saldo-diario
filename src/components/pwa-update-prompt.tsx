import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useRegisterSW } from "virtual:pwa-register/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

export function PWAUpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: any) {
      console.log("SW Registered: " + r);
    },
    onRegisterError(error: any) {
      console.log("SW registration error", error);
    },
    onOfflineReady() {
      toast.success("App pronto para funcionar offline!");
    },
    onNeedRefresh() {
      toast.info("Nova versão disponível!");
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
    close();
  };

  return (
    <>
      {/* Dialog para atualização disponível */}
      <AlertDialog open={needRefresh} onOpenChange={setNeedRefresh}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Nova versão disponível!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Uma nova versão do aplicativo está disponível. Deseja atualizar
              agora para obter as últimas melhorias e correções?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={close}>Mais tarde</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdate}>
              Atualizar agora
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toast para modo offline */}
      {offlineReady && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-500 text-white p-3 rounded-lg shadow-lg">
            <p className="text-sm font-medium">App pronto para usar offline!</p>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-green-600 mt-1"
              onClick={close}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
