# D.TA - Relatórios e Dashboards - Frontend

<p align="center">
 <img src="https://raw.githubusercontent.com/dtanutrin/dashboard-gummy-front-end/main/public/images/v2_marca_dta_gummy.png" alt="DTA Gummy Logo" width="200"/>
</p>

[![Netlify Status](https://api.netlify.com/api/v1/badges/ac01aa39-6ab4-467c-8937-62e9aeef532f/deploy-status)](https://app.netlify.com/projects/dashboardgummy/deploys)

O Gummy Dashboards é uma plataforma web desenvolvida para centralizar e gerenciar de forma segura os dashboards da Gummy. A aplicação permite que cada dashboard seja visualizado apenas por setores específicos ou por usuários com as devidas permissões de acesso, garantindo a confidencialidade e a correta distribuição das informações.

A administração dos dashboards é realizada por uma equipe de administradores, atualmente composta pelo time de D.TA (Data Analytics). Esta interface de frontend interage com um backend dedicado e um banco de dados para fornecer uma experiência de usuário fluida e segura.

Este repositório contém o código-fonte do frontend do Gummy Dashboards, construído com Next.js e TypeScript.

## ✨ Funcionalidades Principais

O projeto visa oferecer uma experiência robusta e segura para a visualização e gestão de dashboards. As funcionalidades centrais incluem:

*   **Visualização Segura de Dashboards:** Implementa um sistema de acesso controlado, permitindo que os dashboards sejam visualizados exclusivamente por setores específicos ou por usuários que possuam as permissões adequadas. Isso assegura a confidencialidade dos dados e a correta distribuição das informações estratégicas da Gummy.
*   **Administração Centralizada:** Fornece uma interface dedicada para que a equipe de D.TA (Data Analytics), responsável pela administração, possa gerenciar os dashboards de forma eficiente. Isso inclui a capacidade de adicionar, modificar ou remover dashboards conforme necessário.
*   **Integração com Backend:** O frontend comunica-se de maneira eficiente e segura com um sistema de backend e um banco de dados dedicados. Essa integração garante que os dados exibidos nos dashboards sejam sempre atualizados e que as operações realizadas na plataforma sejam processadas de forma confiável.

## 🛠️ Tecnologias Utilizadas

O desenvolvimento do frontend do Gummy Dashboards foi realizado com o auxílio de um conjunto de tecnologias modernas e eficientes, visando performance, escalabilidade e manutenibilidade. As principais tecnologias empregadas são:

*   **Next.js:** Um poderoso framework React que facilita a criação de aplicações web com renderização no lado do servidor (SSR) e geração de sites estáticos (SSG), otimizando o desempenho e a experiência do usuário.
*   **TypeScript:** Utilizado como a linguagem principal de programação, o TypeScript adiciona um sistema de tipagem estática ao JavaScript, o que contribui para a detecção precoce de erros e melhora a robustez e a manutenibilidade do código.
*   **React:** A biblioteca JavaScript fundamental para a construção de interfaces de usuário dinâmicas e componentizadas, permitindo a criação de uma experiência interativa e responsiva.
*   **CSS:** Empregado para a estilização detalhada dos componentes e da interface gráfica, garantindo um design atraente e consistente com a identidade visual da Gummy.

Para uma lista completa de todas as dependências e bibliotecas utilizadas no projeto, consulte o arquivo `package.json` na raiz do repositório.

## 🔗 Links Úteis

Para facilitar o acesso a recursos relacionados e ao ambiente de produção, seguem os links relevantes:

*   **Repositório Backend:** O código-fonte e a documentação do sistema de backend que suporta esta aplicação podem ser encontrados em: [dashboard-gummy-back-end](https://github.com/dtanutrin/dashboard-gummy-back-end)
*   **Aplicação em Produção (Frontend):** A versão funcional e publicamente acessível do Gummy Dashboards está disponível em: [dta-gummy](https://dta-gummy.netlify.app/auth/login)
