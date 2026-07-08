export const OBRA_STATUS_LABEL: Record<string, string> = {
  em_andamento: "Em andamento",
  pausada: "Pausada",
  concluida: "Concluída",
};

export function weekdayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("pt-BR", { weekday: "long" });
}

/** Rótulos amigáveis para ações do audit log (TG_OP do PostgreSQL). */
export const AUDIT_ACAO_LABEL: Record<string, string> = {
  INSERT: "Registro criado",
  UPDATE: "Registro atualizado",
  DELETE: "Registro excluído",
};

export function auditAcaoLabel(acao: string): string {
  return AUDIT_ACAO_LABEL[acao.toUpperCase()] ?? acao;
}

/** Rótulos amigáveis para nomes de tabela no audit log. */
export const AUDIT_TABELA_LABEL: Record<string, string> = {
  obras: "Obra",
  apontamentos: "Apontamento",
  obra_torres: "Torre da obra",
  torre_andares: "Andar da torre",
  profiles: "Perfil de usuário",
  user_roles: "Papel de usuário",
};

export function auditTabelaLabel(tabela: string): string {
  return AUDIT_TABELA_LABEL[tabela] ?? "Registro do sistema";
}

type AuditDiff = Record<string, unknown> | null;

/** Extrai descrição legível a partir do diff JSON do audit log. */
export function auditRegistroDescricao(tabela: string, diff: AuditDiff): string | null {
  if (!diff || typeof diff !== "object") return null;

  if (tabela === "obras" && typeof diff.nome === "string") {
    return diff.nome;
  }

  if (tabela === "apontamentos" && typeof diff.descricao === "string") {
    return diff.descricao.substring(0, 80);
  }

  return null;
}
