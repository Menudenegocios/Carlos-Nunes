# Changelog

All notable changes to this project will be documented in this file.

## [1.0.18] - 2026-04-20

### Adicionado
- **Sistema de Avaliações entre Membros**: Nova funcionalidade que permite aos usuários avaliar uns aos outros com estrelas (1-5) e depoimentos na Vitrine (StoreView).
- **Média de Estrelas no Hero**: A vitrine agora exibe a média de avaliações e o número total de recomendações.
- **Roteamento Dinâmico**: Melhoria no sistema de rotas dinâmicas e roteamento por slug.

### Melhorado
- **Interface de Mensagens (Direct)**: 
  - Removido o rótulo "DMs" do menu lateral.
  - Limpeza do cabeçalho de chat: removidos ícones de chamada de voz e vídeo.
  - Adicionado menu de opções (ellipsis) para futuras funcionalidades de arquivamento/exclusão.
  - Melhorado feedback visual na busca de usuários.
- **Integração com Gatilhos (Triggers)**: 
  - Correção crítica no gatilho `create_automated_community_post` para suportar diferentes schemas de tabelas de forma segura.
  - Implementado sistema de notificações com `date-fns` para tempos relativos.

### Corrigido
- **Linting e Imports**: Corrigidos erros de compilação no `StoreView.tsx` devido a ícones não importados (`Save`, `Lock`).
- **Gestão de Projetos**: Corrigida a persistência de tarefas garantindo a sincronia com a coluna `assignee_name`.
- **Reuniões 1x1**: Resolvido erro que impedia a conclusão de reuniões devido a campos inexistentes no registro `NEW` do gatilho.
- **Vitrines de Membros**: Corrigidos links no feed que agora levam corretamente à vitrine do autor do post ou comentário.
