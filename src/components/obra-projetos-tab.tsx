import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, FileText, UploadCloud, AlertTriangle, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function ObraProjetosTab({ obraId }: { obraId: string }) {
  const qc = useQueryClient();
  const [nome, setNome] = useState("");
  const [disciplina, setDisciplina] = useState("Arquitetura");
  const [codigo, setCodigo] = useState("");

  const { data: projetos = [], isLoading } = useQuery({
    queryKey: ["obra-projetos", obraId],
    queryFn: async () => {
      const { data: projData, error: projErr } = await supabase.from("obra_projetos").select("*").eq("obra_id", obraId).order("disciplina");
      if (projErr) throw projErr;
      
      if (!projData || projData.length === 0) return [];

      const { data: revData, error: revErr } = await supabase.from("obra_projetos_revisoes").select("*").in("projeto_id", projData.map((p: any) => p.id));
      if (revErr) throw revErr;

      return projData.map((p: any) => ({
        ...p,
        revisoes: revData.filter((r: any) => r.projeto_id === p.id).sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))
      }));
    }
  });

  const addProjeto = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("obra_projetos").insert({ obra_id: obraId, disciplina, nome, codigo });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["obra-projetos", obraId] });
      setNome(""); setCodigo("");
      toast.success("Projeto criado.");
    }
  });

  const uploadRevisao = async (projetoId: string, files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    const revisaoNome = prompt("Digite o nome da Revisão (Ex: R01, R02):", "R01");
    if (!revisaoNome) return;

    const path = `${obraId}/projetos/${crypto.randomUUID()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("projetos-cde").upload(path, file);
    if (upErr) return toast.error("Erro no upload: " + upErr.message);

    // Desativar revisões antigas
    await supabase.from("obra_projetos_revisoes").update({ is_vigente: false }).eq("projeto_id", projetoId);

    // Inserir nova
    const { error: dbErr } = await supabase.from("obra_projetos_revisoes").insert({
      projeto_id: projetoId,
      revisao: revisaoNome,
      storage_path: path,
      is_vigente: true
    });

    if (dbErr) return toast.error(dbErr.message);
    toast.success("Nova revisão cadastrada e definida como Vigente!");
    qc.invalidateQueries({ queryKey: ["obra-projetos", obraId] });
  };

  if (isLoading) return <div className="py-12 flex justify-center"><Loader2 className="size-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="size-6 text-primary" /> Projetos e CDE (Common Data Environment)
        </h2>
        <p className="text-muted-foreground mt-1">Gerencie as pranchas da obra com controle rígido de revisões e obsolescência.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Novo Projeto</CardTitle>
          <CardDescription>Crie o container do projeto. As revisões (PDF) serão anexadas depois.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 items-end">
            <div className="w-40">
              <label className="text-xs font-medium mb-1 block">Disciplina</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={disciplina} onChange={(e) => setDisciplina(e.target.value)}>
                <option value="Arquitetura">Arquitetura</option>
                <option value="Elétrica">Elétrica</option>
                <option value="Hidráulica">Hidráulica</option>
                <option value="Estrutural">Estrutural</option>
                <option value="Climatização">Climatização</option>
              </select>
            </div>
            <div className="w-32">
              <label className="text-xs font-medium mb-1 block">Código</label>
              <Input placeholder="ARQ-01" value={codigo} onChange={e => setCodigo(e.target.value)} />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium mb-1 block">Nome do Projeto</label>
              <Input placeholder="Prancha Térreo - Iluminação" value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            <Button onClick={() => addProjeto.mutate()} disabled={!nome || addProjeto.isPending}>
              {addProjeto.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4 mr-2" />} Criar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {projetos.map((proj: any) => (
          <Card key={proj.id} className="overflow-hidden border-muted">
            <div className="bg-muted/30 p-3 flex justify-between items-center border-b">
              <div>
                <Badge variant="outline" className="mb-1">{proj.disciplina}</Badge>
                <h3 className="font-bold text-lg">{proj.codigo ? `${proj.codigo} - ` : ''}{proj.nome}</h3>
              </div>
              <div>
                <Input type="file" id={`upload-${proj.id}`} className="hidden" accept=".pdf,image/*" onChange={(e) => uploadRevisao(proj.id, e.target.files)} />
                <Button size="sm" onClick={() => document.getElementById(`upload-${proj.id}`)?.click()}>
                  <UploadCloud className="size-4 mr-2" /> Subir Revisão
                </Button>
              </div>
            </div>
            <CardContent className="p-0">
              {proj.revisoes?.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  Nenhuma revisão anexada. Suba o primeiro PDF deste projeto.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <tbody className="divide-y">
                    {proj.revisoes.map((rev: any) => (
                      <tr key={rev.id} className={rev.is_vigente ? "bg-card" : "bg-red-50/50 dark:bg-red-950/20"}>
                        <td className="px-4 py-3 font-medium">Rev: {rev.revisao}</td>
                        <td className="px-4 py-3">
                          {rev.is_vigente ? (
                            <Badge className="bg-green-600 hover:bg-green-700">VIGENTE</Badge>
                          ) : (
                            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                              <AlertTriangle className="size-3" /> OBSOLETA
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button size="sm" variant={rev.is_vigente ? "default" : "destructive"} onClick={() => {
                            const { data } = supabase.storage.from("projetos-cde").getPublicUrl(rev.storage_path);
                            window.open(data.publicUrl, "_blank");
                          }}>
                            <Eye className="size-4 mr-2" /> Ver Arquivo
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        ))}
        {projetos.length === 0 && (
          <div className="text-center p-12 text-muted-foreground border border-dashed rounded-lg">
            Nenhum projeto cadastrado no CDE.
          </div>
        )}
      </div>
    </div>
  );
}
