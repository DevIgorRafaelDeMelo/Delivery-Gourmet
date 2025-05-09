import img1 from '../Img/amstel.jpg'
import img2 from '../Img/bubweiser.jpg'
import img3 from '../Img/corona.webp'
import img4 from '../Img/Capturar1.PNG'
import img5 from '../Img/Capturar2.PNG'
import img6 from '../Img/Capturar3.PNG'

const produtos = {
  comidas: [
    {
      id: 1,
      nome: "Hambúrguer Clássico",
      descricao: "Um hambúrguer suculento com queijo derretido, alface fresca, tomate e um molho especial no pão artesanal.",
      preco: "R$ 22.00",
      imagem: img4,
    },
    {
      id: 2,
      nome: "Cheddar Bacon Burger",
      descricao: "Delicioso hambúrguer com queijo cheddar cremoso, fatias crocantes de bacon e molho barbecue, servido no pão brioche.",
      preco: "R$ 25.00",
      imagem: img5,
    },
    {
      id: 3,
      nome: "Smash Burger",
      descricao: "Carne grelhada no estilo smash, cebola caramelizada, queijo suíço e maionese temperada no pão de batata.",
      preco: "R$ 24.00",
      imagem: img6,
    },
    {
      id: 4,
      nome: "BBQ Ranch Burger",
      descricao: "Hambúrguer defumado com molho barbecue, cebolas crispy e molho ranch cremoso no pão australiano.",
      preco: "R$ 27.00",
      imagem: img4,
    },
    {
      id: 5,
      nome: "Vegetariano Supreme",
      descricao: "Hambúrguer de grão-de-bico, rúcula fresca, tomate seco e maionese de ervas, servido no pão integral.",
      preco: "R$ 21.00",
      imagem: img5,
    }
  ],

  bebidas: [
    {
      id: 31,
      nome: "Budweiser Longneck",
      descricao: "Cerveja lager premium, leve e refrescante, com notas suaves de malte e lúpulo equilibrado.",
      preco: "R$ 12.00",
      imagem: img1,
    },
    {
      id: 32,
      nome: "Heineken Longneck",
      descricao: "Cerveja puro malte de sabor intenso, com amargor característico e um toque herbal.",
      preco: "R$ 14.00",
      imagem: img2,
    },
    {
      id: 33,
      nome: "Stella Artois Longneck",
      descricao: "Cerveja belga sofisticada, com notas maltadas suaves e um final refrescante.",
      preco: "R$ 13.00",
      imagem: img3,
    },
  
  ],
};

export default produtos;
