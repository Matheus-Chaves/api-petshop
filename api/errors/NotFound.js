class NotFound extends Error {
  //Pega propriedades da classe Error
  constructor(name) {
    super(`${name} não foi encontrado!`); //chama o construtor da classe Error, para instanciar ela
    this.name = "NotFound";
    this.idError = 0;
  }
}

module.exports = NotFound;
