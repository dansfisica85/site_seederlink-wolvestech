// Esta lista simples reúne nome, estado e perfil. A Plataforma usa esses textos
// para filtrar os resultados sem depender de um banco de dados nesta demonstração.
export const parceirosLista = [
  "Fazenda Boa Terra - SP - produtor",
  "AgroFuturo Investimentos - SP - investidor",
  "Sítio Esperança - MG - produtor",
  "Capital Verde - MG - investidor"
];

// Aqui eu guardo os detalhes exibidos nos três cards após a escolha do parceiro.
// Cada chave deve ter exatamente o mesmo nome usado na lista acima.
export const dadosParceiros = {
  "Fazenda Boa Terra": {
    tempo: "12 anos no mercado",
    foco: "Cultivo de hortaliças orgânicas",
    objetivo: "Busca investidores para ampliar exportação"
  },
  "AgroFuturo Investimentos": {
    tempo: "8 anos de atuação",
    foco: "Investimentos em logística agro",
    objetivo: "Procura produtores para parceria em transporte"
  },
  "Sítio Esperança": {
    tempo: "15 anos no mercado",
    foco: "Produção de café orgânico",
    objetivo: "Busca apoio para expandir exportação"
  },
  "Capital Verde": {
    tempo: "10 anos de atuação",
    foco: "Investimentos em sustentabilidade",
    objetivo: "Procura produtores para projetos de energia limpa"
  }
};
