# Product Guidelines

## Brand & UI Principles
- **Theme:** O sistema suporta modos claro e escuro. A cor de destaque (`var(--brand-gold)`) é utilizada para botões primários e badges de destaque.
- **Components:** O sistema utiliza `shadcn/ui` extensivamente para manter a consistência de botões, modais, cards e formulários.
- **Responsive Design:** O layout deve funcionar perfeitamente em dispositivos móveis, visto que engenheiros e mestres de obra acessam o sistema primariamente pelo celular no canteiro.

## Tone & Voice
- Profissional, claro e objetivo. Mensagens de erro devem ser amigáveis mas precisas, orientando o usuário sobre a correção.
- Termos técnicos de engenharia civil devem ser respeitados (EAP, RDO, SESMT, FVR, RNC).

## UX Rules
- Todas as mutações (`useMutation`) devem conter feedback visual através de `toast`.
- Operações de exclusão ou alteração de status críticos devem solicitar confirmação (ex. `<ConfirmDialog>`).
- Telas vazias devem ter um "Empty State" claro, preferencialmente com ícones e uma mensagem orientativa.
