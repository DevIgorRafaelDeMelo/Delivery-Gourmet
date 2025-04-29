import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa"; // Importar ícones do React Icons

const produtos = {
  comidas: [
    {
      id: 1,
      nome: "Hambúrguer Gourmet",
      descricao: "Delicioso hambúrguer artesanal.",
      preco: "R$25,00",
    },
    {
      id: 2,
      nome: "Pizza Marguerita",
      descricao: "Sabor clássica com manjericão fresco.",
      preco: "R$40,00",
    },
    {
      id: 3,
      nome: "Sushi de Salmão",
      descricao: "Com arroz temperado e alga nori.",
      preco: "R$50,00",
    },
    // Mais itens originais...
    {
      id: 21,
      nome: "Carne de Sol com Queijo",
      descricao: "Acompanha mandioca cozida.",
      preco: "R$45,00",
    },
    {
      id: 22,
      nome: "Feijoada Completa",
      descricao: "Com arroz, couve e laranja.",
      preco: "R$35,00",
    },
    {
      id: 23,
      nome: "Paella",
      descricao: "Prato espanhol com frutos do mar.",
      preco: "R$65,00",
    },
    {
      id: 24,
      nome: "Cordeiro Assado",
      descricao: "Bem temperado e suculento.",
      preco: "R$70,00",
    },
    {
      id: 25,
      nome: "Bacalhau à Brás",
      descricao: "Clássico da culinária portuguesa.",
      preco: "R$60,00",
    },
    {
      id: 26,
      nome: "Escondidinho de Carne Seca",
      descricao: "Com purê de mandioca.",
      preco: "R$30,00",
    },
    {
      id: 27,
      nome: "Moqueca Baiana",
      descricao: "Com peixe e camarão no dendê.",
      preco: "R$55,00",
    },
    {
      id: 28,
      nome: "Yakissoba",
      descricao: "Com legumes e carne.",
      preco: "R$28,00",
    },
    {
      id: 29,
      nome: "Panqueca Doce",
      descricao: "Recheada com chocolate e morango.",
      preco: "R$20,00",
    },
    {
      id: 30,
      nome: "Fajitas de Frango",
      descricao: "Com guacamole e sour cream.",
      preco: "R$32,00",
    },
  ],
  bebidas: [
    {
      id: 21,
      nome: "Suco Natural",
      descricao: "Feito com frutas frescas.",
      preco: "R$12,00",
    },
    {
      id: 22,
      nome: "Refrigerante",
      descricao: "Bem gelado para acompanhar sua refeição.",
      preco: "R$8,00",
    },
    {
      id: 23,
      nome: "Café Espresso",
      descricao: "Perfeito para encerrar sua refeição.",
      preco: "R$10,00",
    },
    // Mais itens originais...
    {
      id: 41,
      nome: "Cerveja Pilsen",
      descricao: "Leve e refrescante.",
      preco: "R$10,00",
    },
    {
      id: 42,
      nome: "Whisky 12 anos",
      descricao: "De sabor encorpado.",
      preco: "R$80,00",
    },
    {
      id: 43,
      nome: "Suco de Uva Integral",
      descricao: "100% natural.",
      preco: "R$15,00",
    },
    {
      id: 44,
      nome: "Gin Tônica",
      descricao: "Refrescante com toque de limão.",
      preco: "R$25,00",
    },
    {
      id: 45,
      nome: "Espresso Martini",
      descricao: "Combinação de café e vodka.",
      preco: "R$30,00",
    },
    {
      id: 46,
      nome: "Água Aromatizada",
      descricao: "Com frutas e hortelã.",
      preco: "R$8,00",
    },
    {
      id: 47,
      nome: "Tequila Sunrise",
      descricao: "Colorido e delicioso.",
      preco: "R$28,00",
    },
    {
      id: 48,
      nome: "Coca-Cola Zero",
      descricao: "Opção sem açúcar.",
      preco: "R$10,00",
    },
    {
      id: 49,
      nome: "Red Bull",
      descricao: "Para dar energia extra.",
      preco: "R$15,00",
    },
    {
      id: 50,
      nome: "Mocktail Tropical",
      descricao: "Sem álcool e muito saboroso.",
      preco: "R$18,00",
    },
  ],
};

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para guardar o produto selecionado
  const [showCard, setShowCard] = useState(false); // Estado para controlar a exibição do card
  const [quantity, setQuantity] = useState(1); // Quantidade inicial predefinida
  const [carrinho, setCarrinho] = useState([]);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(true); // Controle da visibilidade do carrinho
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleComprar = (produto) => {
    setSelectedProduct(produto); // Define o produto selecionado
    setShowCard(true); // Exibe o card
  };
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleAddIngredient = (ingredient) => {
    setSelectedIngredients([...selectedIngredients, ingredient]);
  };
  const handleCloseCard = () => {
    setShowCard(false); // Fecha o card
    setSelectedProduct(null); // Limpa o produto selecionado
  };

  const handleRemoveIngredient = (ingredient) => {
    setSelectedIngredients(
      selectedIngredients.filter((i) => i.nome !== ingredient.nome)
    );
  };
  const handleConfirmarCompra = () => {
    // Calcular o valor total (produto + ingredientes)
    const valorTotal =
      quantity *
        parseFloat(selectedProduct?.preco.replace("R$", "").replace(",", ".")) +
      selectedIngredients.reduce(
        (acc, ingredient) => acc + ingredient.valor,
        0
      );

    // Criar um novo item para o carrinho
    const novoItem = {
      produto: selectedProduct?.nome,
      quantidade: quantity,
      preco: selectedProduct?.preco,
      ingredientes: selectedIngredients,
      valorTotal: valorTotal.toFixed(2),
    };

    // Adicionar o novo item ao carrinho
    setCarrinho((prevCarrinho) => [...prevCarrinho, novoItem]);

    // Limpar os estados para uma nova seleção
    setSelectedIngredients([]);
    setQuantity(1);
    handleCloseCard();
  };

  const [ingredients] = useState([
    { nome: "Tomate", valor: 1.5 },
    { nome: "Cebola", valor: 1.0 },
    { nome: "Queijo", valor: 2.5 },
    { nome: "Azeitonas", valor: 1.8 },
  ]);

  const handleRemoverItem = (index) => {
    setCarrinho((prevCarrinho) => prevCarrinho.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-100 pb-20 min-h-screen text-center shadow-xl rounded-lg">
      {/* Header estilizado */}
      <header className="bg-teal-500 py-4 shadow-lg text-white">
        <h1 className="text-2xl font-bold tracking-wide">
          Restaurante <span className="italic">Sabor & Arte</span>
        </h1>
        <p className="text-md mt-1 font-light">
          Sabores únicos para momentos especiais
        </p>
      </header>
      {/* Seção Comidas */}
      <section className="w-3/5 mx-auto">
        <h2 className="text-3xl font-semibold text-teal-700 mb-4 mt-6">
          Comidas
        </h2>
        <ul className="list-none space-y-6 mb-8">
          {produtos.comidas.map((comida) => (
            <li
              key={comida.id}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md flex justify-between items-center"
            >
              <div className="flex flex-col">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {comida.nome}
                </h3>
                <p className="text-gray-600">{comida.descricao}</p>
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-lg font-bold text-gray-800">
                  {comida.preco}
                </p>
                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                  onClick={() => handleComprar(comida)}
                >
                  Comprar
                </button>
              </div>
            </li>
          ))}
        </ul>
        {/* Card para seleção de quantidade */}
        {showCard && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-gray-50 p-12 rounded-2xl shadow-2xl max-w-lg w-full relative">
              {/* Fechar Card */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                onClick={handleCloseCard}
              >
                ✕
              </button>

              {/* Nome do produto */}
              <h2 className="text-3xl font-semibold mb-4 text-center text-teal-700">
                {selectedProduct?.nome}
              </h2>

              {/* Valor unitário atualizado com o total */}
              <p className="text-lg text-center text-gray-700 mb-6">
                Valor unitário:{" "}
                <span className="font-bold text-gray-800">
                  R$
                  {(
                    quantity *
                      parseFloat(
                        selectedProduct?.preco
                          .replace("R$", "")
                          .replace(",", ".")
                      ) +
                    selectedIngredients.reduce(
                      (acc, ingredient) => acc + ingredient.valor,
                      0
                    )
                  ).toFixed(2)}
                </span>
              </p>
              <div className="block mb-6">
                <span className="block text-gray-700 font-medium mb-2">
                  Quantidade:
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg p-3 w-full focus-within:ring-2 focus-within:ring-teal-500">
                  {/* Botão para diminuir quantidade */}
                  <button
                    className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition duration-300 font-semibold"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  {/* Input para exibir quantidade */}
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full text-center text-lg focus:outline-none"
                    placeholder="Digite a quantidade"
                    style={{
                      MozAppearance: "textfield",
                      WebkitAppearance: "none",
                    }}
                  />
                  {/* Botão para aumentar quantidade */}
                  <button
                    className="text-white bg-teal-500 hover:bg-teal-600 px-3 py-1 rounded-lg transition duration-300 font-semibold"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Ingredientes complementares */}
              <div className="mb-6">
                <span className="block text-gray-700 font-medium mb-2">
                  Ingredientes complementares:
                </span>
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between mb-2"
                  >
                    <span className="text-gray-800">
                      {ingredient.nome} - R${ingredient.valor.toFixed(2)}
                    </span>
                    <div className="flex items-center space-x-2">
                      {/* Botão para retirar ingrediente com ícone */}
                      <button
                        className="bg-red-500 text-black px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300 font-semibold flex items-center space-x-2"
                        onClick={() => handleRemoveIngredient(ingredient)}
                      >
                        <FaMinus className="text-white" />{" "}
                        {/* Ícone para diminuir */}
                      </button>
                      {/* Botão para adicionar ingrediente com ícone */}
                      <button
                        className="bg-teal-500 text-white px-3 py-1 rounded-lg hover:bg-teal-600 transition duration-300 font-semibold flex items-center space-x-2"
                        onClick={() => handleAddIngredient(ingredient)}
                      >
                        <FaPlus className="text-white" />{" "}
                        {/* Ícone para adicionar */}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-lg text-center text-gray-700 mb-6">
                Ingredientes adicionados:{" "}
                <span className="font-bold text-gray-800">
                  {selectedIngredients.map((i) => i.nome).join(", ")}
                </span>
              </p>

              {/* Botões de ação */}
              <div className="flex justify-around mt-6">
                <button
                  className="px-6 py-3 bg-gray-200 rounded-lg text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition duration-300 font-semibold"
                  onClick={handleCloseCard}
                >
                  Cancelar
                </button>
                <button
                  className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 font-semibold"
                  onClick={handleConfirmarCompra} // Lógica do botão
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
      {/* Exibição do carrinho */}
      <section
        className={`fixed top-0 right-0 w-80 h-screen bg-gray-50 shadow-xl border-l border-gray-200 p-4 flex flex-col ${
          mostrarCarrinho ? "" : "hidden"
        }`}
      >
        {/* Conteúdo do carrinho */}
        <div className="overflow-y-auto flex-grow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-teal-700">Carrinho</h2>
            {/* Botão para ocultar o carrinho */}
            <button
              className="text-gray-400 hover:text-teal-500 transition duration-300"
              onClick={() => setMostrarCarrinho(false)}
            >
              ✕
            </button>
          </div>

          {/* Carrinho */}
          <section
            className={`fixed top-0 right-0 w-80 h-screen bg-gray-50 shadow-xl border-l border-gray-200 p-4 flex flex-col ${
              mostrarCarrinho ? "" : "hidden"
            }`}
          >
            {/* Conteúdo do carrinho */}
            <div className="overflow-y-auto flex-grow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-teal-700">
                  Carrinho
                </h2>
                {/* Botão para ocultar o carrinho */}
                <button
                  className="text-gray-400 hover:text-teal-500 transition duration-300"
                  onClick={() => setMostrarCarrinho(false)}
                >
                  ✕
                </button>
              </div>

              {/* Carrinho */}
              {carrinho.length > 0 ? (
                <ul className="list-none space-y-4">
                  {carrinho.map((item, index) => (
                    <li
                      key={index}
                      className="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-md flex justify-between items-center"
                    >
                      <div>
                        {/* Exibição do nome do produto e valor total */}
                        <p className="text-lg font-medium text-gray-800">
                          {item.quantidade}x {item.produto} - Total:{" "}
                          <span className="font-bold text-orange-500">
                            R$
                            {(
                              item.quantidade *
                                parseFloat(
                                  item.preco.replace("R$", "").replace(",", ".")
                                ) +
                              (item.ingredientes || []).reduce(
                                (acc, ingrediente) => acc + ingrediente.valor,
                                0
                              )
                            ).toFixed(2)}
                          </span>
                        </p>

                        {/* Ingredientes adicionais */}
                        {item.ingredientes && item.ingredientes.length > 0 && (
                          <p className="text-sm text-gray-600 mt-2">
                            Ingredientes adicionais:{" "}
                            <span className="text-gray-800">
                              {item.ingredientes
                                .map((ingrediente) => ingrediente.nome)
                                .join(", ")}{" "}
                              - R$
                              {item.ingredientes
                                .reduce(
                                  (acc, ingrediente) => acc + ingrediente.valor,
                                  0
                                )
                                .toFixed(2)}
                            </span>
                          </p>
                        )}
                      </div>
                      {/* Ícone de exclusão */}
                      <button
                        className="text-gray-400 hover:text-red-500 transition duration-300"
                        onClick={() => handleRemoverItem(index)}
                      >
                        🗑️
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">O carrinho está vazio.</p>
              )}
            </div>

            {/* Valor Total e Botão no rodapé */}
            {carrinho.length > 0 && (
              <div className="mt-4">
                {/* Valor Total */}
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    Valor Total:{" "}
                    <span className="font-bold text-orange-500">
                      R$
                      {carrinho
                        .reduce((acc, item) => {
                          return (
                            acc +
                            item.quantidade *
                              parseFloat(
                                item.preco.replace("R$", "").replace(",", ".")
                              ) +
                            (item.ingredientes || []).reduce(
                              (accIng, ingrediente) =>
                                accIng + ingrediente.valor,
                              0
                            )
                          );
                        }, 0)
                        .toFixed(2)}
                    </span>
                  </p>
                </div>
                {/* Botão para finalizar compra */}
                <button
                  className="w-full px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 font-semibold mt-4"
                  onClick={() => setMostrarFormulario(true)} // Abre o formulário
                >
                  Finalizar Compra
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Valor Total e Botão no rodapé */}
        {carrinho.length > 0 && (
          <div className="mt-4">
            {/* Valor Total */}
            <div className="mt-4">
              <p className="text-lg font-semibold text-gray-800">
                Valor Total:{" "}
                <span className="font-bold text-orange-500">
                  R$
                  {carrinho
                    .reduce((acc, item) => {
                      return (
                        acc +
                        item.quantidade *
                          parseFloat(
                            item.preco.replace("R$", "").replace(",", ".")
                          ) +
                        (item.ingredientes || []).reduce(
                          (accIng, ingrediente) => accIng + ingrediente.valor,
                          0
                        )
                      );
                    }, 0)
                    .toFixed(2)}
                </span>
              </p>
            </div>
            {/* Botão para finalizar compra */}
            <button
              className="w-full px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 font-semibold mt-4"
              onClick={() => setMostrarFormulario(true)} // Abre o formulário
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </section>
      {/* Botão para mostrar carrinho */}
      <section>
        {!mostrarCarrinho && (
          <button
            className="fixed bottom-4 right-4 px-6 py-3 bg-teal-500 text-white rounded shadow-lg hover:bg-teal-600 transition duration-300 font-semibold"
            onClick={() => setMostrarCarrinho(true)}
          >
            Mostrar Carrinho
          </button>
        )}
      </section>
      {/* Card para preenchimento de informações */}
      <section>
        {mostrarFormulario && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full relative">
              {/* Botão para fechar o card */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                onClick={() => setMostrarFormulario(false)} // Fecha o card
              >
                ✕
              </button>

              {/* Formulário de informações */}
              <h2 className="text-2xl font-semibold text-teal-700 mb-4 text-center">
                Informações da Compra
              </h2>
              <form>
                {/* Campo Nome */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Nome:
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="Digite seu nome"
                  />
                </div>

                {/* Campo Endereço */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Endereço:
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="Digite seu endereço"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Valor Total:
                  </label>
                  <input
                    type="text"
                    value={`R$${carrinho
                      .reduce((acc, item) => {
                        // Calcula o valor do produto multiplicado pela quantidade
                        const valorProdutos =
                          item.quantidade *
                          parseFloat(
                            item.preco.replace("R$", "").replace(",", ".")
                          );

                        // Calcula o total dos ingredientes adicionais
                        const valorIngredientes = (
                          item.ingredientes || []
                        ).reduce(
                          (accIng, ingrediente) => accIng + ingrediente.valor,
                          0
                        );

                        // Soma o valor dos produtos e dos ingredientes ao acumulador
                        return acc + valorProdutos + valorIngredientes;
                      }, 0)
                      .toFixed(2)}`} // Calcula valor total do carrinho
                    className="border border-gray-300 rounded-lg p-3 w-full bg-gray-100 text-gray-600"
                    readOnly
                  />
                </div>

                {/* Campo Forma de Pagamento */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Forma de Pagamento:
                  </label>
                  <select className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none">
                    <option>Cartão de Crédito</option>
                    <option>Cartão de Débito</option>
                    <option>Pix</option>
                    <option>Dinheiro</option>
                  </select>
                </div>

                {/* Campo Telefone */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Telefone:
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="Digite seu telefone"
                  />
                </div>

                {/* Campo Complemento */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Complemento:
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="Digite o complemento"
                  />
                </div>

                {/* Botões de ação */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300 font-semibold"
                    onClick={() => setMostrarFormulario(false)} // Fecha o formulário
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 font-semibold"
                    onClick={() => alert("Compra concluída!")} // Exemplo de ação
                  >
                    Concluir
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
