import React, { useState } from "react";
import { FaPlus, FaMinus, FaCog } from "react-icons/fa"; // Importar ícones do React Icons
import logo from "./Abstract Chef Cooking Restaurant Free Logo.png";


function App() {
  const [produtos, setProdutos] = useState({
    comidas: [
      { id: 1, nome: "Pizza", descricao: "Deliciosa pizza de queijo", preco: "R$ 25,00", imagem: "pizza.jpg" },
      { id: 2, nome: "Hambúrguer", descricao: "Hambúrguer suculento", preco: "R$ 20,00", imagem: "hamburguer.jpg" },
      { id: 3, nome: "Sushi", descricao: "Sushi fresco com molho especial", preco: "R$ 35,00", imagem: "sushi.jpg" },
      { id: 4, nome: "Tacos", descricao: "Tacos mexicanos com carne e guacamole", preco: "R$ 18,00", imagem: "tacos.jpg" },
      { id: 5, nome: "Lasanha", descricao: "Lasanha recheada com molho de tomate", preco: "R$ 30,00", imagem: "lasanha.jpg" },
      { id: 6, nome: "Churrasco", descricao: "Churrasco brasileiro bem temperado", preco: "R$ 40,00", imagem: "churrasco.jpg" },
      { id: 7, nome: "Espaguete", descricao: "Macarrão ao molho pesto", preco: "R$ 22,00", imagem: "espaguete.jpg" },
      { id: 8, nome: "Risoto", descricao: "Risoto de cogumelos trufados", preco: "R$ 28,00", imagem: "risoto.jpg" },
      { id: 9, nome: "Empada", descricao: "Empada recheada de frango", preco: "R$ 12,00", imagem: "empada.jpg" },
      { id: 10, nome: "Salada", descricao: "Salada fresca com molho especial", preco: "R$ 15,00", imagem: "salada.jpg" }
    ],
    bebidas: [
      { id: 11, nome: "Suco de Laranja", descricao: "Natural e refrescante", preco: "R$ 10,00", imagem: "suco.jpg" },
      { id: 12, nome: "Refrigerante", descricao: "Gelado e borbulhante", preco: "R$ 8,00", imagem: "refrigerante.jpg" },
      { id: 13, nome: "Café", descricao: "Café quente e encorpado", preco: "R$ 5,00", imagem: "cafe.jpg" },
      { id: 14, nome: "Chá Gelado", descricao: "Chá gelado com sabor de limão", preco: "R$ 7,00", imagem: "cha.jpg" },
      { id: 15, nome: "Milkshake", descricao: "Milkshake cremoso de chocolate", preco: "R$ 14,00", imagem: "milkshake.jpg" },
      { id: 16, nome: "Vinho", descricao: "Vinho tinto envelhecido", preco: "R$ 50,00", imagem: "vinho.jpg" },
      { id: 17, nome: "Água de Coco", descricao: "Água de coco natural", preco: "R$ 9,00", imagem: "agua_coco.jpg" },
      { id: 18, nome: "Energético", descricao: "Bebida energética para dar disposição", preco: "R$ 12,00", imagem: "energetico.jpg" },
      { id: 19, nome: "Batida de Morango", descricao: "Batida cremosa de morango", preco: "R$ 15,00", imagem: "batida.jpg" },
      { id: 20, nome: "Limonada", descricao: "Limonada refrescante e natural", preco: "R$ 6,00", imagem: "limonada.jpg" }
    ]
  });


  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para guardar o produto selecionado
  const [showCard, setShowCard] = useState(false); // Estado para controlar a exibição do card
  const [showCardDrink, setShowCardDrink] = useState(false); // Estado para controlar a exibição do card
  const [quantity, setQuantity] = useState(1); // Quantidade inicial predefinida
  const [carrinho, setCarrinho] = useState([]);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false); // Controle da visibilidade do carrinho
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [complemento, setComplemento] = useState("");
  const [mostrarDiv, setMostrarDiv] = useState(false);
  const numeroTelefone = "5551980253115"; //numero do forenecedor
  const [termoFiltro, setTermoFiltro] = useState(""); // Estado para armazenar o ter
  const produtosFiltrados = {
    comidas: produtos.comidas.filter(produto => produto.nome.toLowerCase().includes(pesquisa.toLowerCase())),
    bebidas: produtos.bebidas.filter(produto => produto.nome.toLowerCase().includes(pesquisa.toLowerCase()))
  };

  const [horarios, setHorarios] = useState({
    segunda: "10h00 - 22h00",
    terca: "10h00 - 22h00",
    quarta: "10h00 - 22h00",
    quinta: "10h00 - 22h00",
    sexta: "10h00 - 23h00",
    sabado: "11h00 - 23h00",
    domingo: "11h00 - 21h00",
  });
  
  
  const [editando, setEditando] = useState(false);
  const alterarHorario = (dia, novoHorario) => {
    setHorarios({ ...horarios, [dia]: novoHorario });
  };
  const [ingredients] = useState([
    { nome: "Tomate", valor: 1.5 },
    { nome: "Cebola", valor: 1.0 },
    { nome: "Queijo", valor: 2.5 },
    { nome: "Azeitonas", valor: 1.8 },
  ]);
  const handleEnviarWhatsApp = () => {
    // Substitua pelo número correto
    const valorTotal = carrinho
      .reduce((acc, item) => {
        const valorProdutos =
          item.quantidade *
          parseFloat(item.preco.replace("R$", "").replace(",", "."));
        const valorIngredientes = (item.ingredientes || []).reduce(
          (accIng, ingrediente) => accIng + ingrediente.valor,
          0
        );
        return acc + valorProdutos + valorIngredientes;
      }, 0)
      .toFixed(2);

    const mensagem = `
  Informações da Compra:
  - Nome: ${nome}
  - Endereço: ${endereco}
  - Telefone: ${telefone}
  - Forma de Pagamento: ${formaPagamento}
  - Complemento: ${complemento}
  
  Pedido:
  ${carrinho
    .map(
      (item) =>
        `- ${item.quantidade}x ${item.produto} ${
          item.ingredientes.length > 0
            ? `(Ingredientes: ${item.ingredientes
                .map((i) => i.nome)
                .join(", ")})`
            : ""
        } - R$${item.valorTotal}`
    )
    .join("\n")}
  
  Valor Total: R$${valorTotal}
    `;

    const mensagemCodificada = encodeURIComponent(mensagem);
    const linkWhatsApp = `https://wa.me/${numeroTelefone}?text=${mensagemCodificada}`;
    window.open(linkWhatsApp, "_blank"); // Abre o WhatsApp com a mensagem
  };
  const handleComprar = (produto) => {
    setSelectedProduct(produto); // Define o produto selecionado
    setShowCard(true);
    // Exibe o card
  };
  const handleCloseCard = () => {
    setShowCard(false); // Fecha o card
    setSelectedProduct(null); // Limpa o produto selecionado
  };
  const handleComprarDrink = (produto) => {
    setSelectedProduct(produto); // Define o produto selecionado
    setShowCardDrink(true);
    // Exibe o card
  };
  const handleCloseCardDrink = () => {
    setShowCardDrink(false); // Fecha o card
    setSelectedProduct(null); // Limpa o produto selecionado
  };
  const handleAddIngredient = (ingredient) => {
    setSelectedIngredients([...selectedIngredients, ingredient]);
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
  const handleConfirmarCompraDrink = () => {
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
    handleCloseCardDrink();
  };
  const handleRemoverItem = (index) => {
    setCarrinho((prevCarrinho) => prevCarrinho.filter((_, i) => i !== index));
  };
  const filtrarProdutos = () => {
    setTermoFiltro(pesquisa);
  };

  const toggleDiv = () => {
    setMostrarDiv(!mostrarDiv);
  };
  const excluirProduto = (id) => {
    // Filtra os produtos para remover o item com o id correspondente
    const novasComidas = produtos.comidas.filter(produto => produto.id !== id);
    const novasBebidas = produtos.bebidas.filter(produto => produto.id !== id);
  
    // Atualiza o estado dos produtos (caso esteja usando React)
    setProdutos({
      comidas: novasComidas,
      bebidas: novasBebidas
    });
  };
  


  return (
    <div className="relative bg-neutral-100 pb-20 min-h-screen text-center shadow-xl rounded-lg">
      {/* Seção ADM */}
      {mostrarDiv && <>{/* Div que cobre toda a tela quando ativada, com scroll habilitado */}
            <div className="fixed inset-0 bg-white z-1 flex flex-col items-center justify-start overflow-y-auto max-h-screen">
            {/* Header fixo no topo */}
            {/* Header fixo no topo */}
            <header className="sticky top-0 w-full bg-teal-700 py-4 shadow-lg text-white flex flex-col items-center rounded-b-3xl z-50">
              <img
                src={logo}
                alt="Logo do Restaurante"
                className="w-20 h-20 rounded-full border-4 border-white shadow-md"
              />
              <h2 className="text-xl font-bold mt-2">Delivery Gourmet</h2>
              <button 
                className="absolute top-4 right-4 bg-gray-700 text-white p-3 rounded-full shadow-lg" 
                onClick={toggleDiv}
              >
                ⚙️ {/* Ícone de configurações */}
              </button>
              
            </header>

              {/* Barra de pesquisa logo abaixo do header */}
            <div className="fixed top-40 -left-0 top-[80px] w-full flex justify-end items-center gap-4 p-4  z-40">
              <input
                type="text"
                placeholder="Pesquisar produto..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="p-3 border  rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
              />
              
              <button 
                onClick={filtrarProdutos} 
                className="px-6 py-3 bg-teal-600 from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
              >
                🔍 Filtrar
              </button>
            </div>

            {/* Horários de funcionamento com botão de edição e salvamento */}
            <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md w-96 text-center">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Horários de Funcionamento</h3>
                <button
                  className="text-gray-600 hover:text-gray-800 transition"
                  onClick={() => setEditando(!editando)}
                >
                  <FaCog className="text-2xl" /> {/* Ícone de configuração */}
                </button>
              </div>

              <ul className="text-sm text-gray-700 mt-2 space-y-2">
                {Object.entries(horarios).map(([dia, horario]) => (
                  <li key={dia} className="flex justify-between bg-white p-2 rounded-md shadow">
                    <span className="font-medium">{dia.charAt(0).toUpperCase() + dia.slice(1)}:</span>
                    {editando ? (
                      <input
                        type="text"
                        value={horario}
                        className="border border-gray-300 rounded p-1 text-center w-32"
                        onChange={(e) => alterarHorario(dia, e.target.value)}
                      />
                    ) : (
                      <span>{horario}</span>
                    )}
                  </li>
                ))}
              </ul>

              {editando && (
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                  onClick={() => {
                    setEditando(false);
                  }}
                >
                  Salvar
                </button>
              )}
            </div>
           
            


            {/* Cards dos produtos */}
           {/* Exibição dos produtos filtrados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {produtosFiltrados.comidas.map(produto => (
          <div key={produto.id} className="bg-white p-4 rounded-lg shadow-xl w-64 text-center">
            <img src={produto.imagem} alt={produto.nome} className="w-full h-40 object-cover rounded-md" />
            <h3 className="text-lg font-semibold mt-2">{produto.nome}</h3>
            <p className="text-sm text-gray-600">{produto.descricao}</p>
            <p className="text-lg font-bold mt-2">{produto.preco}</p>
          </div>
        ))}
        {produtosFiltrados.bebidas.map(produto => (
          <div key={produto.id} className="bg-white p-4 rounded-lg shadow-xl w-64 text-center">
            <img src={produto.imagem} alt={produto.nome} className="w-full h-40 object-cover rounded-md" />
            <h3 className="text-lg font-semibold mt-2">{produto.nome}</h3>
            <p className="text-sm text-gray-600">{produto.descricao}</p>
            <p className="text-lg font-bold mt-2">{produto.preco}</p>
          </div>
        ))}
      </div>


            {/* Botão de Fechar */}
            <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={toggleDiv}
              >
                Fechar
            </button>
            </div> 
      </>}
      {/* Seção Cliente */}
      {!mostrarDiv && <>{/* Ícone de administração no canto superior direito */}
      <button className="absolute top-4 right-4 bg-gray-700 text-white p-3 rounded-full shadow-lg" onClick={toggleDiv}
      >
        ⚙️ {/* Substitua por um ícone adequado, como de uma biblioteca de ícones */}
      </button>
     {/* Header estilizado */}
      <header className="bg-teal-700 py-4 shadow-lg text-white flex flex-col items-center rounded-b-3xl">
        <img
          src={logo}
          alt="Logo do Restaurante"
          className="w-34 h-34 rounded-full mb-2 border-4 border-white shadow-md"
        />
      </header>
      {/* Horários de funcionamento exibidos */}
      <div className="mt-6  p-6 rounded-lg w-96 m-auto text-center">
        <h3 className="text-lg font-semibold">Horários do Funcionamento</h3>
        <ul className="text-sm text-gray-700 mt-2 space-y-2">
          {Object.entries(horarios).map(([dia, horario]) => (
            <li key={dia} className="flex justify-between p-2">
              <span className="font-medium">{dia.charAt(0).toUpperCase() + dia.slice(1)}:</span>
              <span>{horario}</span>
            </li>
          ))}
        </ul>
      </div>
      <input
        type="text"
        placeholder="Pesquisar produto..."
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
        className="mb-4 p-2 border rounded"
      />

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
                  className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
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
                  onClick={handleCloseCardDrink}
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
        <h2 className="text-3xl font-semibold text-teal-700 mb-4 mt-6">
          Bebidas
        </h2>
        <ul className="list-none space-y-6 mb-8">
          {produtos.bebidas.map((comida) => (
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
                  className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
                  onClick={() => handleComprarDrink(comida)}
                >
                  Comprar
                </button>
              </div>
            </li>
          ))}
        </ul>
        {/* Card para seleção de quantidade */}
        {showCardDrink && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-gray-50 p-12 rounded-2xl shadow-2xl max-w-lg w-full relative">
              {/* Fechar Card */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                onClick={handleCloseCardDrink}
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

              {/* Botões de ação */}
              <div className="flex justify-around mt-6">
                <button
                  className="px-6 py-3 bg-gray-200 rounded-lg text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition duration-300 font-semibold"
                  onClick={handleCloseCardDrink}
                >
                  Cancelar
                </button>
                <button
                  className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 font-semibold"
                  onClick={handleConfirmarCompraDrink} // Lógica do botão
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
              {/* Botão para fechar o formulário */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                onClick={() => setMostrarFormulario(false)} // Fecha o formulário
              >
                ✕
              </button>

              {/* Cabeçalho */}
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
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
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
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="Digite seu endereço"
                  />
                </div>

                {/* Valor Total */}
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

                {/* Forma de Pagamento */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Forma de Pagamento:
                  </label>
                  <select
                    value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="Pix">Pix</option>
                    <option value="Dinheiro">Dinheiro</option>
                  </select>
                </div>

                {/* Campo Telefone */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Telefone:
                  </label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
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
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
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
                    onClick={handleEnviarWhatsApp} // Função para enviar via WhatsApp
                  >
                    Enviar para WhatsApp
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section></>} 


      


     
      </div>
  );
}

export default App;
