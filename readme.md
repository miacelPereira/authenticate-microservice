## Authentication Microservice

### Ideias do projeto
Esse projeto tem como intuito servir como base para um microserviço de autenticação, sendo que é permitido o uso do mesmo, sendo ele modificado ou não. 

### Usabilidade
Podemos considerar vários usos para um microserviço de autenticação, contudo criei esse microserviço pensando em um cenário onde mais de uma aplicação precisa realizar autenticação usando o mesmo dados de usuários, portanto, esse microserviço é uma centralização das autenticação de um ou mais serviços.

### Métodos

Esse microserviço só trata de autenticação, e teremos apenas três funções:
 - Autenticação do usuário por e-mail e senha
 - Validação do token
 - Revogação do token

### Observações
Nesse repositório, estou utilizando o Postgres como banco de dados, porém, isso é somente para exemplificar o funcionamento, se caso for usar, conecte com o seu banco de dados e realize as mudanças necessárias para o funcionamento.

### Sobre uso do código
Não há nenhuma restrição quanto ao uso e modificações do código desse microserviço, a idéia é ajudar desenvolvedores durante a criação de microserviços nesse estilo.

___
Desenvolvido e mantido por [@miacelPereira](https://github.com/miacelPereira) :)