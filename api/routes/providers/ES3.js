//FEATURE: Gerente de projetos cancela projeto

//Biblioteca para ler textos
const readline = require('readline');
//Criando modelo da classe Projeto
class Projeto {
  //O constructor é o que será chamado quando a classe for instanciada
  constructor(codProjeto, nomeProjeto, descricao, status) {
    this.codProjeto = codProjeto,
    this.nomeProjeto = nomeProjeto,
    this.descricao = descricao,
    this.status = status
  }
  //o método alterar projeto serve para alterar qualquer propriedade do objeto,
  //de acordo com o código do projeto fornecido.
  //A palavra "async" diz que a função terá partes assíncronas, onde estiver 'await'.
  async alterarProjeto() {
    const camposEValores = {
      //Os campos a serem alterados deveriam vir através de uma interface, então
      //para facilitar, irei colocar uma mudança de todos os dados
      nomeProjeto: 'Microsoft Teams ProSW',
      descricao: 'Versão Teams feita pela ProSW',
      status: 'Não iniciado'
    }
    try {
      await this.modificarProjeto(this.codProjeto, {camposEValores})
      //Alterando os valores do objeto
      this.nomeProjeto = camposEValores.nomeProjeto
      this.descricao = camposEValores.descricao
      this.status = camposEValores.status
      //Criando/convertendo para uma string formatada
      const resultado = this.converterParaString()
      return resultado // Retorna o resultado
    } catch (erro) {
      //Em caso de erros, joga o erro no console, evidenciando-o.
      console.log(erro)
    }
  }
  //O método cancelarProjeto serve para mudar o status para Cancelado
  //por padrão o codProjeto é nulo, mas pode receber um valor também
  async cancelarProjeto() {
    const camposEValores = {
      //Apenas é alterado o status.
      status: 'Cancelado'
    }
    try {
      await this.modificarProjeto(this.codProjeto, {camposEValores})
      this.status = camposEValores.status
      //Criando/convertendo para uma string formatada
      const resultado = this.converterParaString()
      return resultado // Retorna o resultado
    } catch (erro) {
      //Em caso de erros, joga o erro no console, evidenciando-o.
      console.log(erro)
    }
  }
  //A função modificarProjeto é responsável por chamar o serviço externo e utilizar o
  //método HTTP (PUT) para atualizar os campos a serem alterados.
  async modificarProjeto(codProjeto, {valoresASeremAlterados}){
    //Consulta o serviço externo no bancoDeDados, utilizando PUT (update)
    //os campos e seus valores são passados através do parâmetro 'valoresASeremAlterados'
    //O "where" serve para atualizar apenas onde há o codProjeto requisitado
    return await bancoDeDados.update(
      {valoresASeremAlterados},
      {where: {codProjeto: codProjeto}}
    )
  }
  //Retorna uma string formatada com as informações do objeto atual
  converterParaString(){
    return (`Informações do Projeto:
      \tProjeto ${this.codProjeto}
      \tNome: ${this.nomeProjeto}
      \tDesc.: ${this.descricao}
      \tStatus: ${this.status}
    `)
  }
}
//O gerente de projetos tem acesso total a tudo dentro da classe Projeto
class GerenteDeProjetos extends Projeto {
  constructor(codUsuario) {
    super(codUsuario) //o super irá chamar o construtor de Projeto, porém alterando o codUsuario
  }
  //Quem é responsável por cancelar um projeto é o gerente de projetos
  chamarCancelarProjetos() {
    return this.cancelarProjeto()
  }
}
//Cria interface de leitura de entrada/saida
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
//Mostra a mensagem e deixa o usuário digitar uma resposta
rl.question('Insira o código de usuário que deseja alterar', (valor) => {
  let codUsuario = valor //atribuindo o valor recebido à variável
  const projetoCancelado = new GerenteDeProjetos(codUsuario).cancelarProjeto()
  //Por fim, a variável projetoCancelado guarda a string de resposta, então
  //ela é exibida na tela:
  console.log(projetoCancelado)
  rl.close();
});