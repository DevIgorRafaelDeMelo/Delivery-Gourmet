import React, { useState, useEffect } from "react";
import {
  where,
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  addDoc,
  query,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { DB } from "../firebaseConfig";
import logo from "../Img/1.png";
import StatusProduto from "../Conponets/StatusProduto";
import Estoque from "../Conponets/Estoque";
import Fechamento from "../Conponets/Fechamento";

function Admin() {
  const [produto] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [mostrarFormularioCard, setMostrarFormularioCard] = useState(false);
  const [visivel, setVisivel] = useState(true);
  const [pedidosConfirmados, setPedidosConfirmados] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [seçãoAtiva, setSeçãoAtiva] = useState("produtos");
  const [pesquisa, setPesquisa] = useState("");
  const [pedidoAberto, setPedidoAberto] = useState(null);
  const [empresaEditada, setEmpresaEditada] = useState("empressa");
  const [editando, setEditando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
  const [email, setEmail] = useState("");
  const [nome, setSenha] = useState("");
  const [mostrarModal, setMostrarModal] = useState(true);
  const [erro, setErro] = useState("");
  const [corBotao, setCorBotao] = useState("bg-green-500 hover:bg-green-600");  
  const [textoBotao, setTextoBotao] = useState("Atender");  
  const [empresa, setEmpresa] = useState({
    nome: "Minha Empresa Ltda",
    cnpj: "00.000.000/0001-00",
    endereco: "Rua Exemplo, 123 - Cidade, Estado",
    telefone: "(00) 0000-0000",
    email: "contato@empresa.com",
    logo: logo, // Imagem temporária
  });
  const diasDaSemana = [
    "segunda",
    "terça",
    "quarta",
    "quinta",
    "sexta",
    "sábado",
    "domingo",
  ];
  const [horarios, setHorarios] = useState(
    Object.fromEntries(diasDaSemana.map((dia) => [dia, ""]))
  );
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    descricao: "",
    preco: 0,
    precoFinal: 0, // Correção na atribuição
    imagem: "",
    ativo: true,
    QTD: 0,
  });
  const [produtoEditado, setProdutoEditado] = useState(
    produtoSelecionado || {}
  );
  const atualizarStatusPedido = async (pedidoId, novoStatus) => {
    try {
      const pedidoRef = doc(DB, "pedidos", pedidoId);
      await updateDoc(pedidoRef, { status: novoStatus });
      setPedidosConfirmados((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
    }
  };
  const salvarHorarios = async () => {
    try {
      await setDoc(doc(DB, "horarios", "usuario"), { horarios });
      console.log("Horários salvos com sucesso!");
      setEditando(false);
    } catch (error) {
      console.error("Erro ao salvar horários:", error);
    }
  };
  const fetchPedidos = async () => {
    try {
      const querySnapshot = await getDocs(collection(DB, "pedidos"));
      const pedidos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPedidosConfirmados(pedidos);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };
  const abrirProduto = (produto) => {
    setProdutoSelecionado(produto);
  };
  const fecharProduto = () => {
    setProdutoSelecionado(null);
  };
  const excluirProduto = async (id) => {
    try {
      const docRef = doc(DB, "produtos", id);
      await deleteDoc(docRef);
      console.log("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };
  const calcularNovoPreco = (precoString) => {
    // Remove "R$" e espaços da string e converte para número
    const precoNumerico = parseFloat(
      precoString.replace("R$", "").replace(",", ".")
    );

    // Soma 30% ao valor
    const novoPreco = precoNumerico * 1.3;

    // Retorna o valor formatado como moeda brasileira
    return `R$ ${novoPreco.toFixed(2).replace(".", ",")}`;
  };
  const adicionarProduto = async () => {
    if (!novoProduto.nome || !novoProduto.preco || !novoProduto.imagem) {
      alert("Preencha todos os campos, incluindo a imagem!");
      return;
    }

    try {
      const db = getFirestore();

      // Criando um novo objeto com precoFinal ajustado antes de enviar ao banco
      const produtoComPrecoFinal = {
        ...novoProduto,
        precoFinal: calcularNovoPreco(novoProduto.preco), // Corrigido o uso de ":" e passando apenas preco
      };

      await addDoc(collection(db, "produtos"), produtoComPrecoFinal);
      console.log("Produto cadastrado com sucesso!", produtoComPrecoFinal);

      // Resetar formulário após salvar
      setNovoProduto({
        nome: "",
        descricao: "",
        precoV: 0,
        precoFinal: 0, // Resetando precoFinal
        imagem: "",
        ativo: true,
        QTD: 0,
      });
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
    }
  };
  const formatarMoeda = (valor) => {
    // Remove qualquer caractere que não seja número
    const numeroLimpo = valor.replace(/\D/g, "");

    // Converte para número e formata para moeda BRL
    const numeroFormatado = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(numeroLimpo / 100); // Divide por 100 para incluir casas decimais corretamente

    return numeroFormatado;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpresaEditada((prevEmpresa) => ({
      ...prevEmpresa,
      [name]: value,
    }));
  };
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmpresaEditada((prevEmpresa) => ({
          ...prevEmpresa,
          logo: reader.result, // Atualiza logo no estado de edição
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const salvarEdicao = () => {
    setEmpresa(empresaEditada);
    setEditando(false);
  };
  const buscarProdutos = async () => {
    try {
      const produtosRef = collection(DB, "produtos"); // Acessa coleção "produtos"
      const querySnapshot = await getDocs(query(produtosRef)); // Obtém todos os documentos

      const produtosArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProdutos(produtosArray); // Atualiza o estado com os produtos buscados
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };
  const salvarProduto = async () => {
    setProdutoEditado({});
    try {
      const docRef = doc(DB, "produtos", produtoSelecionado.id);
      await updateDoc(docRef, produtoEditado);
      console.log("Produto atualizado com sucesso!");
      buscarProdutos();
      fecharProduto();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
    // Limpar estado após salvar
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
  const abrirModalExclusao = (produto) => {
    setProdutoParaExcluir(produto);
    setModalAberto(true);
  };
  const fecharModalExclusao = () => {
    setModalAberto(false);
    setProdutoParaExcluir(null);
  };
  const alterarHorario = (dia, valor) => {
    setHorarios((prevState) => ({
      ...prevState,
      [dia]: valor,
    }));
  };
  const handleLogin = async () => {
    try {
      const autenticado = await verificarLogin(email, nome);
      if (autenticado) {
        setMostrarModal(true);
      } else {
        setErro("Usuário ou senha inválidos!");
      }
    } catch (error) {
      setErro("Erro ao conectar com o banco.");
    }
  };
  const verificarLogin = async (email, nome) => {
    try {
      const querySnapshot = await getDocs(collection(DB, "usuario")); // Busca todos usuários
      let usuarioEncontrado = false;

      querySnapshot.forEach((doc) => {
        const dados = doc.data();
        if (dados.email === email && dados.nome === nome) {
          usuarioEncontrado = true;
        }
      });

      return usuarioEncontrado;
    } catch (error) {
      console.error("Erro ao verificar login:", error);
      throw error;
    }
  };
  const confirmarSaidaEstoque = async (pedido) => {
    console.log("Itens do pedido:", pedido.itens);
    setCorBotao("bg-gray-500 hover:bg-gray-600");
    const db = getFirestore();
    const produtosRef = collection(db, "produtos"); // Referência para a coleção correta

    for (const item of pedido.itens) {
      try {
        const produtosQuery = query(
          produtosRef,
          where("nome", "==", item.nome)
        ); // Busca pelo nome
        const produtosSnap = await getDocs(produtosQuery);

        if (!produtosSnap.empty) {
          produtosSnap.forEach(async (doc) => {
            const estoqueAtual = doc.data().QTD;
            const novoEstoque = estoqueAtual - item.quantidade;

            if (novoEstoque >= 0) {
              await updateDoc(doc.ref, { QTD: novoEstoque });
              console.log(
                `Item ${item.nome} atualizado. Novo estoque: ${novoEstoque}`
              );
            } else {
              console.warn(`Estoque insuficiente para ${item.nome}.`);
            }
          });
        } else {
          console.warn(`Item ${item.nome} não encontrado no estoque.`);
        }
      } catch (error) {
        console.error(`Erro ao atualizar estoque do item ${item.nome}:`, error);
      }
    }
  };
  const togglePedido = (index) => {
    setPedidoAberto(pedidoAberto === index ? null : index);
  };
  useEffect(() => {
    buscarProdutos();
    fetchPedidos();
    buscarHorarios();
    const interval = setInterval(() => {
      buscarHorarios();
      buscarProdutos();
      fetchPedidos();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className=" ">
        {!mostrarModal && (
          <div className="p-6 bg-green bg-white rounded-lg shadow-lg w-[90%] sm:w-[30%] border border-gray-300">
            <header className=" h-40 sm:pt-10 py-20 w-full  text-white flex flex-col items-center fixed top-0 left-0 right-0 ">
              <img
                src={empresa.logo}
                alt="Logo do Restaurante"
                className="w-30 h-30  rounded-full  border-4 border-green-500 shadow-md"
              />
            </header>
            <h2 className="text-center text-2xl font-bold mb-6 text-gray-700">
              Login
            </h2>

            <input
              type="email"
              placeholder="Numerica"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Senha"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={nome}
              onChange={(e) => setSenha(e.target.value)}
            />

            {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              Entrar
            </button>
          </div>
        )}
        {mostrarModal && (
          <>
            {/* Aba lateral */}
            <div
              className={`fixed  bg-neutral-100  left-0 items-center justify-start overflow-y-auto transition-transform duration-500 ease-in-out `}
            >
              <button
                onClick={() => setVisivel((prev) => !prev)}
                className="px-8 py-8 w-[100%] sm:w-20 text-start bg-teal-600 fixed top-0  text-white  hover:bg-teal-500  "
              >
                {visivel ? "Ocultar" : "☰"}
              </button>
              <div
                className={`flex-1 bg-teal-600 fixed top-0 w-[100%] sm:w-[20%] pt-50  h-[100vh] ${
                  visivel ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <div className=" ">
                  <header className=" h-40 sm:pt-10 py-20 w-full  text-white flex flex-col items-center fixed top-0 left-0 right-0 ">
                    <img
                      src={empresa.logo}
                      alt="Logo do Restaurante"
                      className="w-30 h-30  rounded-full  border-4 border-green-500 shadow-md"
                    />
                  </header>
                  <div className="w-full flex  flex-col items-center pt-10">
                    <div
                      onClick={() =>
                        setSeçãoAtiva(
                          "horarios",
                          setVisivel((prev) => !prev)
                        )
                      }
                      className="w-full py-6 text-center bg-teal-600 text-white shadow-lg cursor-pointer text-xl hover:bg-teal-700  "
                    >
                      Horários
                    </div>

                    <div
                      onClick={() =>
                        setSeçãoAtiva(
                          "produtos",
                          setVisivel((prev) => !prev)
                        )
                      }
                      className="w-full py-6 text-center bg-teal-600 text-white shadow-lg cursor-pointer text-xl hover:bg-teal-700  "
                    >
                      Produtos
                    </div>

                    <div
                      onClick={() =>
                        setSeçãoAtiva(
                          "pedidos",
                          setVisivel((prev) => !prev)
                        )
                      }
                      className="w-full py-6 text-center bg-teal-600 text-white cursor-pointer text-xl hover:bg-teal-700 transition"
                    >
                      Pedidos
                    </div>
                    <div
                      onClick={() =>
                        setSeçãoAtiva(
                          "estoque",
                          setVisivel((prev) => !prev)
                        )
                      }
                      className="w-full py-6 text-center bg-teal-600 text-white cursor-pointer text-xl hover:bg-teal-700 transition"
                    >
                      Estoque
                    </div>
                    <div
                      onClick={() =>
                        setSeçãoAtiva(
                          "fechamento",
                          setVisivel((prev) => !prev)
                        )
                      }
                      className="w-full py-6 text-center bg-teal-600 text-white cursor-pointer text-xl hover:bg-teal-700 transition"
                    >
                      Fechamento
                    </div>

                    <div className="text-sm text-center bg-teal-600 text-white fixed bottom-0 py-6">
                      V0.1 07.05.25 Devsystem 64
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Seções */}
            <div className="  ">
              {seçãoAtiva === "horarios" && (
                <section className="text-center sm:px-[20%]">
                  <div className="w-[90%] sm:[50%} h-[100vh] m-auto">
                    <h2 className="text-2xl font-extrabold text-teal-500  pt-30">
                      Gerenciamento de Horario
                    </h2>
                    {/* Horários de funcionamento com botão de edição e salvamento */}
                    <div className="mt-6 bg-gray-100 mt-16 p-6 rounded-lg shadow-md text-center">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                          Horários de Funcionamento
                        </h3>
                      </div>
                      <div className="p-4 max-w-md mx-auto">
                        <h2 className="text-lg font-semibold mb-4">
                          Definir Horários
                        </h2>
                        <ul className="space-y-2">
                          {diasDaSemana.map((dia) => (
                            <li
                              key={dia}
                              className="flex justify-between p-2 rounded-md shadow"
                            >
                              <span className="font-medium">
                                {dia.charAt(0).toUpperCase() + dia.slice(1)}:
                              </span>
                              {editando ? (
                                <input
                                  type="text"
                                  value={horarios[dia]}
                                  placeholder="HH:MM - HH:MM"
                                  className="bg-white p-2 rounded-md shadow"
                                  onChange={(e) =>
                                    alterarHorario(dia, e.target.value)
                                  }
                                  pattern="([01]\d|2[0-3]):[0-5]\d - ([01]\d|2[0-3]):[0-5]\d"
                                  title="Formato esperado: HH:MM - HH:MM"
                                />
                              ) : (
                                <span>{horarios[dia]}</span>
                              )}
                            </li>
                          ))}
                        </ul>

                        {!editando ? (
                          <button
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                            onClick={() => setEditando(true)}
                          >
                            Editar
                          </button>
                        ) : (
                          <button
                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
                            onClick={salvarHorarios}
                          >
                            Salvar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              )}
              {seçãoAtiva === "produtos" && (
                <section className="p-5 text-center sm:px-[20%]">
                  {/* Header */}
                  <header>
                    <div className="text-center  flex  justify-center sm:justify-end gap-4 pt-30 sm:pt-10 z-40">
                      <div className="flex items-center bg-white border  rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition duration-200 px-3 py-1">
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-4.35-4.35m-2.3-2.3a7.5 7.5 0 1 0-10.6-10.6 7.5 7.5 0 0 0 10.6 10.6z"
                          ></path>
                        </svg>
                        <input
                          type="text"
                          placeholder="Pesquisar produto..."
                          value={pesquisa}
                          onChange={(e) => setPesquisa(e.target.value)}
                          className="ml-2 flex-grow focus:outline-none px-4"
                        />
                      </div>
                    </div>
                    <h2 className="text-2xl font-extrabold text-teal-500  ">
                      Produtos
                    </h2>
                  </header>
                  {/* Cards dos produtos */}

                  <div className="flex sm:justify-end w-full">
                    <button
                      onClick={() => setMostrarFormularioCard(true)}
                      className="px-6 m-auto mt-4 py-3 sm:hidden bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                    >
                      Adicionar Produto
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full lg:grid-cols-4 gap-4 pt-10 pb-20">
                    <button
                      onClick={() => setMostrarFormularioCard(true)}
                      className="px-6 m-auto sm:mt-0 mt-4 hidden sm:block sm:py-3 h-full w-full bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                    >
                      Adicionar Produto
                    </button>
                    {produtos.length > 0 ? (
                      produtos.map((produto) => (
                        <div
                          key={produto.id}
                          className="bg-white p-4 rounded-lg shadow-xl w-full text-center flex flex-col items-center"
                        >
                          <StatusProduto
                            produtoSelecionado={produto}
                            className="p-2"
                          />
                          <img
                            src={produto.imagem}
                            alt={produto.nome}
                            className="w-full sm:w-[80%] h-40 object-cover rounded-md"
                          />
                          <h3 className="text-lg font-semibold mt-2">
                            {produto.nome}
                          </h3>
                          <p className="text-sm text-gray-600 h-20">
                            {produto.descricao}
                          </p>
                          <p className="text-lg font-bold mt-2">
                            {produto.preco}
                          </p>

                          <button
                            onClick={() => abrirProduto(produto)}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                          >
                            Editar produto
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-600">
                        Nenhum produto encontrado.
                      </p>
                    )}
                  </div>

                  {/* Modal dos produtos */}
                  {produtoSelecionado && produtoSelecionado.nome && (
                    <div className="fixed top-0 left-0 w-full p-4 h-[100vh]  items-center justify-center bg-black bg-opacity-50">
                      <div className=" mt-[50%]   sm:m-[10%]   bg-white p-6 rounded-lg shadow-xl  text-center border border-gray-200">
                        {/* Botão de fechar com melhor espaçamento e design */}
                        <button
                          onClick={() => abrirProduto(produto)}
                          className="mt-2 px-4 py-2 bg-blue-500 mb-4 text-white rounded-md hover:bg-blue-600 transition flex items-center gap-2 fixed top-2 right-2"
                        >
                          <span className="text-white text-xl font-bold">
                            ✖
                          </span>
                        </button>

                        {/* Nome do Produto */}
                        <input
                          type="text"
                          value={produtoEditado?.nome || ""}
                          onChange={(e) =>
                            setProdutoEditado((prev) => ({
                              ...prev,
                              nome: e.target.value,
                            }))
                          }
                          className="text-lg font-semibold mb-4 text-center border border-gray-300 rounded-md px-3 py-2 w-full"
                          placeholder="Nome do Produto"
                        />

                        {/* Preço do Produto */}
                        <input
                          type="text"
                          value={produtoEditado?.preco || ""}
                          onChange={(e) =>
                            setProdutoEditado((prev) => ({
                              ...prev,
                              preco: e.target.value,
                            }))
                          }
                          className="text-lg font-bold mb-4 text-center border border-gray-300 rounded-md px-3 py-2 w-full"
                          placeholder="Preço"
                        />

                        {/* Imagem do Produto */}
                        <input
                          type="text"
                          value={produtoEditado?.imagem || ""}
                          onChange={(e) =>
                            setProdutoEditado((prev) => ({
                              ...prev,
                              imagem: e.target.value,
                            }))
                          }
                          className="text-sm text-gray-600 mb-4 border border-gray-300 rounded-md px-3 py-2 w-full"
                          placeholder="URL da imagem"
                        />

                        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
                          <button
                            onClick={() =>
                              abrirModalExclusao(produtoSelecionado)
                            }
                            className="px-4 py-2  bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition flex-1 shadow-md"
                          >
                            Excluir
                          </button>

                          <button
                            onClick={salvarProduto}
                            className="px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition flex-1 shadow-md"
                          >
                            Atualizar
                          </button>

                          {/* Exibir Imagem */}
                          {produtoEditado?.imagem && (
                            <img
                              src={produtoEditado.imagem}
                              alt={produtoEditado.nome}
                              className="w-full h-48 object-cover rounded-md mt-4 shadow-md"
                            />
                          )}

                          {modalAberto && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                              <div className="bg-white p-6 rounded-md shadow-lg w-80 text-center">
                                <h2 className="text-lg font-bold mb-4">
                                  Confirmar Exclusão
                                </h2>
                                <p className="text-gray-700 mb-4">
                                  Tem certeza que deseja excluir{" "}
                                  <strong>{produtoParaExcluir?.nome}</strong>?
                                </p>

                                <div className="flex justify-between gap-4 mt-4">
                                  <button
                                    onClick={fecharModalExclusao}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition w-1/2 shadow-md"
                                  >
                                    Cancelar
                                  </button>

                                  <button
                                    onClick={() =>
                                      excluirProduto(produtoParaExcluir.id)
                                    }
                                    className="px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition w-1/2 shadow-md"
                                  >
                                    Confirmar
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Modal cadastro */}
                  {mostrarFormularioCard && (
                    <div className="fixed top-0 w-full h-[100vh] left-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white p-6 rounded-lg shadow-xl w-96 ">
                        {/* Botão de fechar no canto superior direito */}

                        <h3 className="text-2xl font-bold  ">
                          Adicionar Produto
                        </h3>

                        <input
                          type="text"
                          placeholder="Nome do produto"
                          value={novoProduto.nome}
                          onChange={(e) =>
                            setNovoProduto({
                              ...novoProduto,
                              nome: e.target.value,
                            })
                          }
                          className="mt-4 p-3 text-lg border border-gray-400 rounded-lg w-full"
                        />

                        <input
                          type="text"
                          placeholder="Descrição"
                          value={novoProduto.descricao}
                          onChange={(e) =>
                            setNovoProduto({
                              ...novoProduto,
                              descricao: e.target.value,
                            })
                          }
                          className="mt-4 p-3 text-lg border border-gray-400 rounded-lg w-full"
                        />

                        <input
                          type="text"
                          placeholder="Preço"
                          value={novoProduto.preco}
                          onChange={(e) => {
                            const valorFormatado = formatarMoeda(
                              e.target.value
                            );
                            setNovoProduto({
                              ...novoProduto,
                              preco: valorFormatado,
                            });
                          }}
                          className="mt-4 p-3 text-lg border border-gray-400 rounded-lg w-full"
                        />
                        {/*<select
                    value={novoProduto.tipo}
                    onChange={(e) => {
                      const tipoSelecionado = e.target.value;

                      setNovoProduto((prevProduto) => ({
                        ...prevProduto,
                        tipo: tipoSelecionado,
                        bebida:
                          tipoSelecionado === "bebida" ? prevProduto : null,
                        comida:
                          tipoSelecionado === "comida" ? prevProduto : null,
                      }));
                    }}
                    className="mt-4 p-3 text-lg border border-gray-400 rounded-lg w-full"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="bebida">Bebida</option>
                    <option value="comida">Comida</option>
                  </select>*/}

                        <div className="flex flex-col items-center gap-2 border rounded-lg  mt-3 shadow-sm    ">
                          <input
                            id="file-upload"
                            type="text" // Alterado para text para permitir entrada manual de URL
                            value={novoProduto.imagem}
                            onChange={(e) =>
                              setNovoProduto({
                                ...novoProduto,
                                imagem: e.target.value,
                              })
                            }
                            className="border border-gray-400 rounded-lg w-full p-2"
                            placeholder="Cole a URL da imagem aqui"
                          />
                        </div>
                        <button
                          onClick={() => setMostrarFormularioCard(false)}
                          className="text-gray-500  p-4 hover:text-gray-700 text-lg"
                        >
                          Cancelar
                        </button>

                        <button
                          onClick={adicionarProduto}
                          className="mt-4 px-6 py-3 bg-teal-600 text-white text-lg rounded-lg hover:bg-teal-700 transition"
                        >
                          Adicionar Produto
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              )}
              {seçãoAtiva === "pedidos" && (
                <section className="text-center sm:px-[20%]">
                  <div className="w-full h-screen overflow-auto">
                    <h2 className="text-2xl font-extrabold text-teal-500  py-30 sm:py-10">
                      Gerenciamento de Pedidos
                    </h2>
                    {/* Código de gerenciamento de usuários */}
                    <section className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg shadow-lg w-full mb-[20%] p-6">
                      {pedidosConfirmados.length === 0 ? (
                        <p className="text-gray-600 text-center text-lg font-semibold">
                          Nenhum pedido confirmado ainda.
                        </p>
                      ) : (
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                          <thead>
                            <tr className="bg-teal-500 text-white">
                              <th className="p-4 text-left">Status</th>
                              <th className="p-4 text-left">Cliente</th>
                              <th className="p-4 text-left">Horário</th>
                              <th className="p-4 text-left">Valor Total</th>
                              <th className="p-4 text-left">
                                Forma de Pagamento
                              </th>

                              <th className="p-4 text-left">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pedidosConfirmados
                              .slice()
                              .sort(
                                (a, b) =>
                                  new Date(b.horario).getTime() -
                                  new Date(a.horario).getTime()
                              ) // Ordenação decrescente
                              .map((pedido, index) => (
                                <React.Fragment key={index}>
                                  {/* Linha principal do pedido */}
                                  <tr
                                    className="border-b bg-gray-100 cursor-pointer hover:bg-gray-200 transition-all"
                                    onClick={() => togglePedido(index)}
                                  >
                                    <td
                                      className={`p-4 font-bold ${
                                        pedido.status === "Atendido"
                                          ? "text-green-600"
                                          : pedido.status === "Cancelado"
                                          ? "text-red-600"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {pedido.status}
                                    </td>
                                    <td className="p-4 text-gray-700">
                                      {pedido.nome}
                                    </td>
                                    <td className="p-4 text-gray-700">
                                      {new Date(
                                        pedido.horario
                                      ).toLocaleString()}
                                    </td>
                                    <td className="p-4 font-bold text-teal-700">
                                      R$ {pedido.total}
                                    </td>
                                    <td className="p-4 font-bold text-teal-700">
                                      {pedido.formaPagamento}
                                    </td>

                                    <td className="p-4">
                                      <div className="flex gap-2">
                                        <button
                                          className={`px-4 py-2 text-white rounded-md font-medium shadow ${
                                            pedido.status === "Atendido"
                                              ? "bg-green-500 hover:bg-green-600"
                                              : "bg-gray-500 hover:bg-gray-600"
                                          }`}
                                          onClick={() => {
                                            if (pedido.status === "Atendido") {
                                              const confirmar = window.confirm(
                                                "Este pedido já está marcado como 'Atendido'. Deseja confirmar novamente? Se for confirmado irá movimentar estoque novamente !"
                                              );

                                              if (!confirmar) {
                                                return; // Se o usuário cancelar, interrompe a ação
                                              }
                                            }
                                            setTextoBotao("Atendido");
                                            atualizarStatusPedido(
                                              pedido.id,
                                              "Atendido"
                                            ); // Atualiza status do pedido
                                            confirmarSaidaEstoque(pedido); // Atualiza estoque no Firebase
                                          }}
                                        >
                                          {textoBotao}
                                        </button>
                                      </div>
                                    </td>
                                  </tr>

                                  {/* Linha expandida com detalhes do pedido */}
                                  {pedidoAberto === index && (
                                    <tr className="bg-gray-50">
                                      <td colSpan="7" className="p-4">
                                        <h4 className="font-semibold text-gray-700">
                                          Itens do Pedido:
                                        </h4>
                                        <ul className="mt-2 space-y-2">
                                          {pedido.itens.map((item, i) => (
                                            <li
                                              key={i}
                                              className="flex justify-between bg-gray-200 p-3 rounded-md"
                                            >
                                              <span className="text-gray-800 font-medium">
                                                {item.quantidade}x {item.nome}
                                              </span>
                                            </li>
                                          ))}
                                        </ul>

                                        {/* Informações adicionais do pedido */}
                                        <div className="mt-4 p-4 bg-gray-100 rounded-md shadow-md">
                                          <p>
                                            <strong>Telefone:</strong>{" "}
                                            {pedido.telefone}
                                          </p>
                                          <p>
                                            <strong>Bairro:</strong>{" "}
                                            {pedido.bairro}
                                          </p>
                                          <p>
                                            <strong>Endereço:</strong>{" "}
                                            {pedido.endereco}
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))}
                          </tbody>
                        </table>
                      )}
                    </section>
                  </div>
                </section>
              )}
              {seçãoAtiva === "estoque" && (
                <section className="text-center ">
                  <Estoque />
                </section>
              )}
              {seçãoAtiva === "fechamento" && (
                <section className="text-center ">
                  <Fechamento />
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Admin;
