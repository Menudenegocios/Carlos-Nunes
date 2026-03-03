# Menuzap Pro Extension

Esta é a estrutura da sua extensão para o Chrome.

## Como instalar para testes:
1. Baixe os arquivos desta pasta (`/extension`).
2. No Chrome, acesse `chrome://extensions`.
3. Ative o **Modo do desenvolvedor** (canto superior direito).
4. Clique em **Carregar sem compactação**.
5. Selecione a pasta onde você salvou os arquivos.

## Arquivos:
- `manifest.json`: Configurações da extensão.
- `content.js`: Lógica que injeta a barra lateral no WhatsApp Web.
- `styles.css`: Estilização da barra lateral.
- `popup.html/js`: O que aparece ao clicar no ícone da extensão.

## Integração:
A extensão está configurada para se comunicar com o domínio:
`https://ais-dev-w2a7jxyi3yzmolfvmfwmxy-13842340585.us-east5.run.app`
