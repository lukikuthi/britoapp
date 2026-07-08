import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ApontamentoFormProps {
  onSave: (descricao: string) => void;
  onCancel: () => void;
  initialDescricao?: string;
  saving?: boolean;
}

export function ApontamentoForm({
  onSave,
  onCancel,
  initialDescricao = "",
  saving = false,
}: ApontamentoFormProps) {
  const [descricao, setDescricao] = useState(initialDescricao);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Focus textarea on mount with a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  function handleSave() {
    const trimmed = descricao.trim();
    if (!trimmed) return;
    onSave(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  }

  const canSave = descricao.trim().length > 0 && !saving;

  return (
    <Card className="shadow-lg border-primary/20">
      <CardContent className="p-3 space-y-2">
        <Textarea
          ref={textareaRef}
          placeholder="Descreva o apontamento..."
          rows={3}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={saving}
          className="text-sm resize-none"
        />
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={!canSave}
          >
            {saving && <Loader2 className="size-3.5 animate-spin" />}
            Salvar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
