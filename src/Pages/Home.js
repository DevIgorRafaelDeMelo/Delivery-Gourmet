import React, { useEffect, useState } from "react";
import logo from "../Img/1.png";
import { collection, addDoc, getDocs, getDoc, doc } from "firebase/firestore";
import { DB } from "../firebaseConfig";
import { FaMapMarkerAlt, FaClock, FaPhone } from "react-icons/fa";

function Home() {
  /*
  const [ingredients] = useState([
    { nome: "Tomate", valor: 1.5 },
    { nome: "Cebola", valor: 1.0 },
    { nome: "Queijo", valor: 2.5 },
    { nome: "Azeitonas", valor: 1.8 },
  ]);
  const handleComprar = (produto) => {
    setSelectedProduct(produto); // Define o produto selecionado
    setShowCard(true);
    // Exibe o card
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
  const handleCloseCard = () => {
    setShowCard(false); // Fecha o card
    setSelectedProduct(null); // Limpa o produto selecionado
  };*/
  const [total, setTotal] = useState(0);

  const [horarios, setHorarios] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para guardar o produto selecionado
  const [showCardDrink, setShowCardDrink] = useState(false); // Estado para controlar a exibição do card
  const [quantity, setQuantity] = useState(1); // Quantidade inicial predefinida
  const [carrinho, setCarrinho] = useState([]);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false); // Controle da visibilidade do carrinho
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [bairro, setBairro] = useState("");
  const [telefone, setTelefone] = useState("");
  const [complemento, setComplemento] = useState("");
  const numeroTelefone = "5551980253115"; //numero do forenecedor
  const [pedidosConfirmados, setPedidosConfirmados] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState("cardapio");
  const [paginaSelecionada, setPaginaSelecionada] = useState("pedidos");
  const [menuAberto, setMenuAberto] = useState(false);
  const [comidas, setComidas] = useState([]);
  const [empresa] = useState({
    nome: "Minha Empresa Ltda",
    cnpj: "00.000.000/0001-00",
    endereco: "Rua Exemplo, 123 - Cidade, Estado",
    telefone: "(00) 0000-0000",
    email: "contato@empresa.com",
    logo: logo, // Imagem temporária
  });
  const diasDaSemanaOrdenados = [
    "segunda",
    "terça",
    "quarta",
    "quinta",
    "sexta",
    "sábado",
    "domingo",
  ];
  const handleEnviarWhatsApp = (e) => {
    e.preventDefault();

    const novoPedido = {
      nome,
      endereco,
      telefone,
      formaPagamento,
      complemento,
      total,
      bairro,
      itens: carrinho.map((item) => ({
        nome: item.produto,
        quantidade: item.quantidade,
        precoFinal: total,
        ingredientes: item.ingredientes || [],
      })),
      status: "Não Atendido", // Valor inicial
      horario: new Date().toISOString(), // Adiciona o horário do pedido
    };

    // Adiciona ao Firebase
    addPedidoAoFirebase(novoPedido);

    setPedidosConfirmados((prevPedidos) => [...prevPedidos, novoPedido]);
    console.log("Pedido Confirmado:", novoPedido);

    const mensagemCodificada = encodeURIComponent(`
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
    + 5,00 tele
    Valor Total: R$${total}
    `);

    const linkWhatsApp = `https://wa.me/${numeroTelefone}?text=${mensagemCodificada}`;
    window.open(linkWhatsApp, "_blank");
    setCarrinho([]);
  };
  const handleComprarDrink = (produto) => {
    setSelectedProduct(produto); // Define o produto selecionado
    setShowCardDrink(true);
    // Exibe o card
  };
  const addPedidoAoFirebase = async (pedido) => {
    try {
      await addDoc(collection(DB, "pedidos"), pedido);
      console.log("Pedido salvo no Firebase:", pedido);
    } catch (error) {
      console.error("Erro ao salvar pedido:", error.message);
    }
  };
  const handleCloseCardDrink = () => {
    setShowCardDrink(false); // Fecha o card
    setSelectedProduct(null); // Limpa o produto selecionado
  };
  const handleConfirmarCompraDrink = () => {
    // Calcular o valor total (produto + ingredientes)
    const valorTotal =
      quantity *
        parseFloat(
          selectedProduct?.precoFinal.replace("R$", "").replace(",", ".")
        ) +
      selectedIngredients.reduce(
        (acc, ingredient) => acc + ingredient.valor,
        0
      );

    // Criar um novo item para o carrinho
    const novoItem = {
      produto: selectedProduct?.nome,
      quantidade: quantity,
      precoFinal: selectedProduct?.precoFinal,
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
  const alterarPagina = (pagina) => {
    setPaginaSelecionada(pagina);
    setPaginaAtual(pagina);
    setMenuAberto(!menuAberto);
  };
  const buscarHorarios = async () => {
    try {
      const docRef = doc(DB, "horarios", "usuario");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setHorarios(docSnap.data().horarios);
      } else {
        console.log("Nenhum horário encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar horários:", error);
    }
  };
  const buscarComidas = async () => {
    try {
      const querySnapshot = await getDocs(collection(DB, "produtos"));
      const listaComidas = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComidas(listaComidas);
    } catch (error) {
      console.error("Erro ao buscar comidas:", error);
    }
  };

  useEffect(() => {
    buscarHorarios();
    buscarComidas();
    const novoTotal =
      carrinho.reduce((acc, item) => {
        const valorProdutos =
          item.quantidade *
          parseFloat(item.precoFinal.replace("R$", "").replace(",", "."));
        const valorIngredientes = (item.ingredientes || []).reduce(
          (accIng, ingrediente) => accIng + ingrediente.valor,
          0
        );
        return acc + valorProdutos + valorIngredientes;
      }, 0) + (bairro === "sao-joao" ? 0 : 5); // Não soma R$ 5,00 se for "São João"

    setTotal(novoTotal.toFixed(2)); // Atualiza o estado total corretamente
  }, [bairro, carrinho]); // Dispara a atualização quando bairro ou carrinho mudar

  return (
    <div className=" bg-neutral-100 pb-20 min-h-screen h-full text-center rounded-lg">
      <>
        <header className="h-30">
          <header className="bg-teal-700  h-40 pt-20 sm:pt-10 py-5 w-full shadow-lg text-white flex flex-col items-center fixed top-0 left-0 right-0 ">
            <img
              src={empresa.logo}
              alt="Logo do Restaurante"
              className="w-30 h-30  rounded-full  border-4 border-green-500 shadow-md"
            />
          </header>
        </header>
        <nav className="bg-teal-700   fixed top-0 - sm:top-[180px] sm:w-[50%] sm:mx-[25%] sm:rounded-b left-0 w-full text-white p-4 sm:shadow-md">
          {/* Botão do menu hambúrguer */}
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold sm:hidden">DrinkUp 24h</h1>
            <button
              className="sm:hidden px-3 py-2 rounded bg-white text-teal-700"
              onClick={() => setMenuAberto(!menuAberto)}
            >
              {menuAberto ? "✖" : "☰"}
            </button>
          </div>

          {/* Menu */}
          <ul
            className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${
              menuAberto ? "block" : "hidden sm:flex"
            } mt-4 sm:mt-0`}
          >
            <li>
              <button
                className={`px-28 py-4 rounded ${
                  paginaSelecionada === "horario"
                    ? "bg-white text-teal-700"
                    : ""
                }`}
                onClick={() => alterarPagina("horario")}
              >
                Horário
              </button>
            </li>
            <li>
              <button
                className={`px-28 py-4 rounded ${
                  paginaSelecionada === "cardapio"
                    ? "bg-white text-teal-700"
                    : ""
                }`}
                onClick={() => alterarPagina("cardapio")}
              >
                Cardápio
              </button>
            </li>
            <li>
              <button
                className={`px-28 py-4 rounded ${
                  paginaSelecionada === "local" ? "bg-white text-teal-700" : ""
                }`}
                onClick={() => alterarPagina("local")}
              >
                Local
              </button>
            </li>
          </ul>
        </nav>
        <div className="h-20 sm:h-40"></div>
        {paginaAtual === "cardapio" && (
          <>
            {/* Seção Comidas */}
            <section className="w-full max-w-[90%] mx-auto sm:w-3/5">
              {/* <h2 className="text-2xl sm:text-3xl font-semibold text-teal-700 mb-4 mt-6 text-center sm:text-left">
                Comidas
              </h2>
              <ul className="list-none space-y-6 mb-8">
                {produtosState.comidas.map((comida) => (
                  <li
                    key={comida.id}
                    className="p-4 sm:p-6 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4"
                  >
                   
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden shadow-md">
                      <img
                        src={comida.imagem}
                        alt={comida.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col w-full sm:w-[50%] text-center sm:text-left">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                        {comida.nome}
                      </h3>
                      <p className="text-gray-600 mt-2 text-sm sm:text-base">
                        {comida.descricao}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                      <p className="text-lg sm:text-xl font-bold text-teal-700">
                        {comida.preco}
                      </p>
                      <button
                        className="bg-teal-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold shadow-md hover:bg-teal-600"
                        onClick={() => handleComprar(comida)}
                      >
                        Comprar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

             
              {showCard && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                  <div className="bg-gray-50 p-12 rounded-2xl shadow-2xl max-w-lg w-full relative">
                     
                    <button
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                      onClick={handleCloseCard}
                    >
                      ✕
                    </button>

               
                    <h2 className="text-3xl font-semibold mb-4 text-center text-teal-700">
                      {selectedProduct?.nome}
                    </h2>

                    
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
                       
                        <button
                          className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition duration-300 font-semibold"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          -
                        </button>
                        
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
                     
                        <button
                          className="text-white bg-teal-500 hover:bg-teal-600 px-3 py-1 rounded-lg transition duration-300 font-semibold"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                     
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
                            {ingredient.nome} - R$
                            {ingredient.valor.toFixed(2)}
                          </span>
                          <div className="flex items-center space-x-2">
                     
                            <button
                              className="bg-red-500 text-black px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300 font-semibold flex items-center space-x-2"
                              onClick={() => handleRemoveIngredient(ingredient)}
                            >
                              <FaMinus className="text-white" />{" "}
                              
                            </button>
                           
                            <button
                              className="bg-teal-500 text-white px-3 py-1 rounded-lg hover:bg-teal-600 transition duration-300 font-semibold flex items-center space-x-2"
                              onClick={() => handleAddIngredient(ingredient)}
                            >
                              <FaPlus className="text-white" />{" "}
                               
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
              )} */}
              <h2 className="text-2xl sm:text-3xl font-semibold text-teal-700 mb-4 mt-6 text-center sm:text-left">
                Bebidas
              </h2>
              <ul className="list-none space-y-6 mb-8">
                {comidas
                  .filter((comida) => comida.ativo && comida.QTD > 0)
                  .map((comida) => (
                    <li
                      key={comida.id}
                      className="p-4 sm:p-6 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden shadow-md">
                        <img
                          src={comida.imagem}
                          alt={comida.nome}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col w-full sm:w-[50%] text-center sm:text-left">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                          {comida.nome}
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm sm:text-base">
                          {comida.descricao}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <p className="text-lg sm:text-xl font-bold text-teal-700">
                          {comida.precoFinal}
                        </p>
                        <button
                          className="bg-teal-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold shadow-md hover:bg-teal-600"
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
                  <div className="bg-gray-50 p-12 m-2 sm:rounded-2xl shadow-2xl max-w-lg w-full relative">
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
                              selectedProduct?.precoFinal
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
            {/* Carrinho */}
            <section
              className={`fixed top-0 w-full sm:w-80 right-0 w-80 h-screen bg-gray-50 shadow-xl border-l border-gray-200 p-4 flex flex-col ${
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
                  <ul className="list-none space-y-4 ">
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
                                    item.precoFinal
                                      .replace("R$", "")
                                      .replace(",", ".")
                                  ) +
                                (item.ingredientes || []).reduce(
                                  (acc, ingrediente) => acc + ingrediente.valor,
                                  0
                                )
                              ).toFixed(2)}
                            </span>
                          </p>

                          {/* Ingredientes adicionais */}
                          {item.ingredientes &&
                            item.ingredientes.length > 0 && (
                              <p className="text-sm text-gray-600 mt-2">
                                Ingredientes adicionais:{" "}
                                <span className="text-gray-800">
                                  {item.ingredientes
                                    .map((ingrediente) => ingrediente.nome)
                                    .join(", ")}{" "}
                                  - R$
                                  {item.ingredientes
                                    .reduce(
                                      (acc, ingrediente) =>
                                        acc + ingrediente.valor,
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
                    <button
                      className="bg-teal-600 text-white p-4 rounded hover:text-teal-500 transition duration-300"
                      onClick={() => setMostrarCarrinho(false)}
                    >
                      🛒 Continuar Comprando
                    </button>
                  </ul>
                ) : (
                  <>
                    {" "}
                    <p className="text-gray-600 py-20">
                      O carrinho está vazio.
                    </p>
                    <button
                      className="bg-teal-600 text-white p-4 rounded hover:text-teal-500 transition duration-300"
                      onClick={() => setMostrarCarrinho(false)}
                    >
                      🛒 Continuar Comprando
                    </button>
                  </>
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
                                  item.precoFinal
                                    .replace("R$", "")
                                    .replace(",", ".")
                                ) +
                              (item.ingredientes || []).reduce(
                                (accIng, ingrediente) =>
                                  accIng + ingrediente.valor,
                                0
                              )
                            );
                          }, 0) // Adicionando R$ 5,00 ao total
                          .toFixed(2)}
                      </span>{" "}
                      +{" "}
                      <span className="font-bold text-orange-500">R$ 5,00</span>{" "}
                      tele entrega
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
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center overflow-auto">
                  <div className="bg-white p-8 h-full sm:h-auto sm:rounded-lg shadow-xl max-w-lg w-full relative overflow-y-auto">
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
                      {/* Local de entrega */}
                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                          Bairro de entrega:
                        </label>
                        <select
                          onChange={(e) => setBairro(e.target.value)} // Atualiza o estado
                          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                          <option value="">Selecione o bairro</option>
                          <option value="beira-rio">Beira Rio</option>
                          <option value="bela-vista">Bela Vista</option>
                          <option value="centro">Centro</option>
                          <option value="centro-uniao">Centro União</option>
                          <option value="floresta">Floresta</option>
                          <option value="industrial">Industrial</option>
                          <option value="moinho-velho">Moinho Velho</option>
                          <option value="portal-da-serra">
                            Portal da Serra
                          </option>
                          <option value="primavera">Primavera</option>
                          <option value="sao-joao">São João</option>
                          <option value="travessao">Travessão</option>
                          <option value="uniao">União</option>
                          <option value="vale-verde">Vale Verde</option>
                          <option value="vila-becker">Vila Becker</option>
                        </select>
                      </div>

                      {/* Campo Endereço */}
                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                          Endereço completo / Rua:
                        </label>
                        <input
                          type="text"
                          value={endereco}
                          onChange={(e) => setEndereco(e.target.value)}
                          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
                          placeholder="Digite seundereço completo / Rua:"
                        />
                      </div>

                      {/* Valor Total */}
                      <input
                        type="text"
                        value={`R$${total}`} // Agora o total se atualiza corretamente
                        className="border border-gray-300 rounded-lg p-3 w-full bg-gray-100 text-gray-600"
                        readOnly
                      />

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
                          <option value="Cartão de Crédito">
                            Cartão de Crédito
                          </option>
                          <option value="Cartão de Débito">
                            Cartão de Débito
                          </option>
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
                      <div className="flex pt-10 justify-end space-x-4">
                        <button
                          type="button"
                          className="px-4 py-2 w-[50%] bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300 font-semibold"
                          onClick={() => setMostrarFormulario(false)} // Fecha o formulário
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 font-semibold"
                          onClick={handleEnviarWhatsApp} // Função para enviar via WhatsApp
                        >
                          Confirma pedido
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
        {paginaAtual === "horario" && (
          <>
            {/* Horários de funcionamento exibidos */}
            <div className="mt-6 p-8 rounded-lg w-[90%] sm:w-[50%] m-auto text-center bg-white shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 border-b pb-3">
                🕒 Horários de Funcionamento
              </h3>
              <p className="text-gray-600 mt-2">
                Nosso estabelecimento está sempre pronto para atender você com
                conforto e qualidade!
              </p>
              <div className="p-4 max-w-md mx-auto">
                <ul className="text-lg text-gray-700 mt-4 space-y-4">
                  {diasDaSemanaOrdenados.map(
                    (dia) =>
                      horarios[dia] && (
                        <li
                          key={dia}
                          className="flex justify-between p-3 border-b border-gray-300"
                        >
                          <span className="font-semibold text-gray-900">
                            {dia.charAt(0).toUpperCase() + dia.slice(1)}:
                          </span>
                          <span className="text-teal-600 font-medium">
                            {horarios[dia]}
                          </span>
                        </li>
                      )
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
        {paginaAtual === "local" && (
          <>
            <section className="p-8 bg-gradient-to-r from-teal-600 to-teal-400   rounded-lg  w-[80%] m-auto text-center">
              <h2 className="text-4xl font-extrabold mb-6">📍 Onde Estamos?</h2>
              <p className="text-lg mb-6 max-w-lg mx-auto">
                Venha nos visitar! Nosso espaço foi pensado para proporcionar
                conforto e praticidade.
              </p>

              {/* Mapa incorporado (Google Maps) */}
              <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg border-4 border-white">
                <iframe
                  className="w-full h-full"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3154.9156360802534!2d-51.089588624672775!3d-29.585018734085524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95193191c02ee14b%3A0xe4e29a4648db3f8a!2sDois%20Irm%C3%A3os%2C%20RS%2C%20Brasil!5e0!3m2!1spt-BR!2sbr!4v1715266540179!5m2!1spt-BR!2sbr"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              {/* Informações do Local */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-lg">
                <div className="flex flex-col items-center bg-white text-teal-700 p-4 rounded-lg shadow-md">
                  <FaMapMarkerAlt size={40} className="text-teal-600 mb-2" />
                  <p className="font-semibold text-xl">Endereço</p>
                  <p className="text-gray-600">
                    Rua Exemplo, 123 - Centro, Dois Irmãos, RS
                  </p>
                </div>

                <div className="flex flex-col items-center bg-white text-teal-700 p-4 rounded-lg shadow-md">
                  <FaClock size={40} className="text-teal-600 mb-2" />
                  <p className="font-semibold text-xl">
                    Horário de Funcionamento
                  </p>
                  <p className="text-gray-600">
                    Seg-Sex: 08h - 18h | Sábado: 09h - 14h | Domingo: Fechado
                  </p>
                </div>

                <div className="flex flex-col items-center bg-white text-teal-700 p-4 rounded-lg shadow-md">
                  <FaPhone size={40} className="text-teal-600 mb-2" />
                  <p className="font-semibold text-xl">Contato</p>
                  <p className="text-gray-600">(51) 99999-9999</p>
                </div>
              </div>
            </section>
          </>
        )}
      </>
    </div>
  );
}

export default Home;
