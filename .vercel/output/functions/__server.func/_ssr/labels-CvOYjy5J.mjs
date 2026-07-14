//#region node_modules/.nitro/vite/services/ssr/assets/labels-CvOYjy5J.js
var OBRA_STATUS_LABEL = {
	em_andamento: "Em andamento",
	pausada: "Pausada",
	concluida: "Concluída"
};
/** Rótulos amigáveis para ações do audit log (TG_OP do PostgreSQL). */
var AUDIT_ACAO_LABEL = {
	INSERT: "Registro criado",
	UPDATE: "Registro atualizado",
	DELETE: "Registro excluído"
};
function auditAcaoLabel(acao) {
	return AUDIT_ACAO_LABEL[acao.toUpperCase()] ?? acao;
}
/** Rótulos amigáveis para nomes de tabela no audit log. */
var AUDIT_TABELA_LABEL = {
	obras: "Obra",
	apontamentos: "Apontamento",
	obra_torres: "Torre da obra",
	torre_andares: "Andar da torre",
	profiles: "Perfil de usuário",
	user_roles: "Papel de usuário"
};
function auditTabelaLabel(tabela) {
	return AUDIT_TABELA_LABEL[tabela] ?? "Registro do sistema";
}
/** Extrai descrição legível a partir do diff JSON do audit log. */
function auditRegistroDescricao(tabela, diff) {
	if (!diff || typeof diff !== "object") return null;
	if (tabela === "obras" && typeof diff.nome === "string") return diff.nome;
	if (tabela === "apontamentos" && typeof diff.descricao === "string") return diff.descricao.substring(0, 80);
	return null;
}
//#endregion
export { auditTabelaLabel as i, auditAcaoLabel as n, auditRegistroDescricao as r, OBRA_STATUS_LABEL as t };
