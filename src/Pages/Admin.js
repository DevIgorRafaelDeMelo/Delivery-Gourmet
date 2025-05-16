import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  query,
} from "firebase/firestore";
import { DB } from "../firebaseConfig";
import logo from "../Img/1.png";

function Admin() {
  const [produtos, setProdutos] = useState([]);
  const [mostrarFormularioCard, setMostrarFormularioCard] = useState(false);
  const [visivel, setVisivel] = useState(true);
  const [pedidosConfirmados, setPedidosConfirmados] = useState([]);
  const [editando, setEditando] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [seçãoAtiva, setSeçãoAtiva] = useState("produtos");
  const [pesquisa, setPesquisa] = useState("");
  const [pedidoAberto, setPedidoAberto] = useState(null);
  const [empresaEditada, setEmpresaEditada] = useState("empressa");
  const [empresa, setEmpresa] = useState({
    nome: "Minha Empresa Ltda",
    cnpj: "00.000.000/0001-00",
    endereco: "Rua Exemplo, 123 - Cidade, Estado",
    telefone: "(00) 0000-0000",
    email: "contato@empresa.com",
    logo: logo, // Imagem temporária
  });
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
  const [horarios, setHorarios] = useState({
    segunda: "10h00 - 22h00",
    terca: "10h00 - 22h00",
    quarta: "10h00 - 22h00",
    quinta: "10h00 - 22h00",
    sexta: "10h00 - 23h00",
    sabado: "11h00 - 23h00",
    domingo: "11h00 - 21h00",
  });
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    descricao: "",
    preco: "",
    imagem: "",
  });
  const atualizarStatusPedido = async (pedidoId, novoStatus) => {
    try {
      const pedidoRef = doc(DB, "pedidos", pedidoId);
      await updateDoc(pedidoRef, { status: novoStatus });
      console.log(`Pedido ${pedidoId} atualizado para: ${novoStatus}`);

      // Atualiza localmente os pedidos
      setPedidosConfirmados((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
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
  const alterarHorario = (dia, novoHorario) => {
    setHorarios((prevHorarios) => ({
      ...prevHorarios,
      [dia]: novoHorario,
    }));
  };
  const atualizarProduto = (id, categoria, campo, valor) => {
    setProdutos((prevProdutos) => ({
      ...prevProdutos,
      [categoria]: prevProdutos[categoria].map((produto) =>
        produto.id === id ? { ...produto, [campo]: valor } : produto
      ),
    }));

    setProdutoSelecionado((prevProduto) => ({
      ...prevProduto,
      [campo]: valor,
    }));
  };
  const adicionarProduto = async () => {
    if (!novoProduto.nome || !novoProduto.preco || !novoProduto.imagem) {
      alert("Preencha todos os campos, incluindo a imagem!");
      return;
    }

    try {
      const db = getFirestore();
      await addDoc(collection(db, "produtos"), novoProduto);
      console.log("Produto cadastrado com sucesso!", novoProduto);

      // Resetar formulário após salvar
      setNovoProduto({
        nome: "",
        descricao: "",
        preco: "",
        imagem: "",
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
  const togglePedido = (index) => {
    setPedidoAberto(pedidoAberto === index ? null : index);
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

  useEffect(() => {
    buscarProdutos();
    fetchPedidos();
  }, []);

  return (
    <>
      {/* Aba lateral */}
      <div
        className={`fixed  bg-neutral-100  left-0 items-center justify-start overflow-y-auto transition-transform duration-500 ease-in-out `}
      >
        <button
          onClick={() => setVisivel((prev) => !prev)}
          className="px-8 py-8 w-[100%] sm:w-20 text-start bg-teal-600 fixed top-0  text-white  hover:bg-teal-500 transition"
        >
          {visivel ? "Ocultar" : "☰"}
        </button>
        <div
          className={`flex-1 bg-teal-600 fixed top-0 w-[100%] sm:w-[20%] pt-50  h-[100vh] ${
            visivel ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="">
            <header className=" h-40 sm:pt-10 py-20 w-full  text-white flex flex-col items-center fixed top-0 left-0 right-0 ">
              <img
                src={empresa.logo}
                alt="Logo do Restaurante"
                className="w-30 h-30  rounded-full  border-4 border-green-500 shadow-md"
              />
            </header>
            <div className="w-full flex flex-col items-center pt-10">
              <div
                onClick={() =>
                  setSeçãoAtiva(
                    "horarios",
                    setVisivel((prev) => !prev)
                  )
                }
                className="w-full py-6 text-center bg-teal-600 text-white shadow-lg cursor-pointer text-xl hover:bg-teal-700 transition"
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
                className="w-full py-6 text-center bg-teal-600 text-white shadow-lg cursor-pointer text-xl hover:bg-teal-700 transition"
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
                    "empressa",
                    setVisivel((prev) => !prev)
                  )
                }
                className="w-full py-6 text-center bg-teal-600 text-white cursor-pointer text-xl hover:bg-teal-700 transition"
              >
                Empressa
              </div>

              <div className="text-sm text-center bg-teal-600 text-white fixed bottom-0 py-6">
                V0.1 07.05.25 Devsystem 64
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Seções */}
      <div className="  bg-neutral-100 px-[5%] sm:px-[21%] text-center">
        {seçãoAtiva === "horarios" && (
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

              <ul className="text-sm text-gray-700 mt-2 space-y-2">
                {Object.entries(horarios).map(([dia, horario]) => (
                  <li
                    key={dia}
                    className="flex justify-between  p-2 rounded-md shadow"
                  >
                    <span className="font-medium">
                      {dia.charAt(0).toUpperCase() + dia.slice(1)}:
                    </span>
                    {editando ? (
                      <input
                        type="text"
                        value={horario}
                        placeholder="HH:MM - HH:MM"
                        className="flex justify-between bg-white p-2 rounded-md shadow"
                        onChange={(e) => alterarHorario(dia, e.target.value)}
                        pattern="([01]\d|2[0-3]):[0-5]\d - ([01]\d|2[0-3]):[0-5]\d"
                        title="Formato esperado: HH:MM - HH:MM"
                      />
                    ) : (
                      <span>{horario}</span>
                    )}
                  </li>
                ))}
              </ul>

              {!editando && (
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                  onClick={() => setEditando(!editando)}
                >
                  Editar
                </button>
              )}

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
          </div>
        )}
        {seçãoAtiva === "produtos" && (
          <div className="h-full  bg-neutral-100">
            <button
              onClick={() => setMostrarFormularioCard(true)}
              className="fixed bottom-4 right-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
            >
              Adicionar Produto
            </button>
            {mostrarFormularioCard && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
                  {/* Botão de fechar no canto superior direito */}
                  <button
                    onClick={() => setMostrarFormularioCard(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
                  >
                    ✖
                  </button>

                  <h3 className="text-2xl font-bold mt-4">Adicionar Produto</h3>

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
                      const valorFormatado = formatarMoeda(e.target.value);
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
                    onClick={adicionarProduto}
                    className="mt-4 px-6 py-3 bg-teal-600 text-white text-lg rounded-lg hover:bg-teal-700 transition"
                  >
                    Adicionar Produto
                  </button>
                </div>
              </div>
            )}
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
            {/* Cards dos produtos */}
            <div className="">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-10 pb-20">
                {produtos.length > 0 ? (
                  produtos.map((produto) => (
                    <div
                      key={produto.id}
                      className="bg-white p-4 rounded-lg shadow-xl text-center flex flex-col items-center"
                    >
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
                      <p className="text-lg font-bold mt-2">{produto.preco}</p>

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
            </div>
            {/* modal dos produtos */}
            {produtoSelecionado && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-md shadow-lg w-80 text-center">
                  <input
                    type="text"
                    value={produtoSelecionado.nome}
                    onChange={(e) =>
                      atualizarProduto(
                        produtoSelecionado.id,
                        "comidas",
                        "nome",
                        e.target.value
                      )
                    }
                    className="text-lg font-semibold mb-4 text-center border border-gray-300 rounded-md px-2"
                  />

                  <input
                    type="text"
                    value={produtoSelecionado.preco}
                    onChange={(e) =>
                      atualizarProduto(
                        produtoSelecionado.id,
                        "comidas",
                        "preco",
                        e.target.value
                      )
                    }
                    className="text-lg font-bold mt-2 text-center border border-gray-300 rounded-md px-2"
                  />

                  <input
                    type="text"
                    value={produtoSelecionado.imagem}
                    onChange={(e) =>
                      atualizarProduto(
                        produtoSelecionado.id,
                        "comidas",
                        "imagem",
                        e.target.value
                      )
                    }
                    className="text-sm text-gray-600 mt-2 border border-gray-300 rounded-md px-2"
                    placeholder="URL da imagem"
                  />

                  <img
                    src={produtoSelecionado.imagem}
                    alt={produtoSelecionado.nome}
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />

                  <button
                    onClick={fecharProduto}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition w-full"
                  >
                    salvar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {seçãoAtiva === "pedidos" && (
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
                <ul className="space-y-6">
                  {pedidosConfirmados
                    .slice() // Evita modificar o array original
                    .sort(
                      (a, b) =>
                        new Date(b.horario).getTime() -
                        new Date(a.horario).getTime()
                    ) // Ordena pelo horário do pedido
                    .map((pedido, index) => (
                      <li
                        key={index}
                        className={`w-full p-6 rounded-lg shadow-lg flex flex-col gap-4 transition ${
                          pedido.status === "Atendido"
                            ? "bg-green-200 border-green-500"
                            : pedido.status === "Cancelado"
                            ? "bg-red-200 border-red-500"
                            : "bg-white border-gray-300"
                        } border-2`}
                      >
                        <div
                          className="flex flex-col md:flex-row justify-between items-center border-b pb-3 cursor-pointer transition-all duration-300 p-4 rounded-md"
                          onClick={() => togglePedido(index)}
                        >
                          <h3 className="font-bold text-2xl text-gray-800 tracking-wide">
                            Pedido {index + 1}
                          </h3>

                          <div className="flex flex-col text-gray-700 text-lg space-y-1">
                            <p>
                              <strong>Cliente:</strong> {pedido.nome}
                            </p>
                            <p>
                              <strong>Data do Pedido:</strong>{" "}
                              {new Date(pedido.horario).toLocaleDateString()}
                              <strong>Horário:</strong>{" "}
                              {new Date(pedido.horario).toLocaleTimeString()}
                            </p>
                            <p className="text-gray-900 font-semibold">
                              <strong>Total:</strong> R$ {pedido.valorTotal}
                            </p>
                          </div>
                        </div>

                        {/* Botões de status lado a lado */}
                        <div className=" flex flex-wrap gap-3 justify-center mt-4">
                          <button
                            className="px-6 py-3 w-full md:w-auto bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold shadow-md "
                            onClick={() =>
                              atualizarStatusPedido(pedido.id, "Em andamento")
                            }
                          >
                            Pedido em andamento
                          </button>

                          <button
                            className="px-6 py-3 w-full md:w-auto bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow-md  "
                            onClick={() =>
                              atualizarStatusPedido(pedido.id, "Atendido")
                            }
                          >
                            Confirmar pedido
                          </button>

                          <button
                            className="px-6 py-3 w-full  md:w-auto bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow-md  "
                            onClick={() =>
                              atualizarStatusPedido(pedido.id, "Cancelado")
                            }
                          >
                            Cancelar pedido
                          </button>
                        </div>

                        {/* Exibir detalhes do pedido quando aberto */}
                        {pedidoAberto === index && (
                          <>
                            <h4 className="font-semibold mt-4 border-t pt-3 text-gray-800">
                              Itens do Pedido:
                            </h4>
                            <ul className="flex flex-col gap-2">
                              {pedido.itens.map((item, i) => (
                                <li
                                  key={i}
                                  className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md border border-gray-300"
                                >
                                  <div className="flex flex-col md:flex-row gap-4 items-center">
                                    <span className="text-gray-800 font-medium text-lg">
                                      {item.quantidade}x {item.nome} (
                                      {item.preco})
                                    </span>
                                  </div>

                                  <div className="flex flex-col text-sm text-gray-700 bg-white p-3 rounded-lg shadow-inner border border-gray-200">
                                    <p className="py-1">
                                      <strong className="text-gray-900">
                                        Telefone:
                                      </strong>{" "}
                                      {pedido.telefone}
                                    </p>
                                    <p className="py-1">
                                      <strong className="text-gray-900">
                                        Forma de Pagamento:
                                      </strong>{" "}
                                      {pedido.formaPagamento}
                                    </p>
                                    <p className="py-1">
                                      <strong className="text-gray-900">
                                        Endereço:
                                      </strong>{" "}
                                      {pedido.endereco}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </li>
                    ))}
                </ul>
              )}
            </section>
          </div>
        )}
        {seçãoAtiva === "empressa" && (
          <div className="py-30 sm:w-[50vh] m-auto h-[100vh] bg-neutral-100">
            <h2 className="text-2xl font-extrabold text-teal-500  py-10">
              Dados da Empresa
            </h2>
            <div className="  p-6  bg-white rounded-lg shadow-xl w-full ">
              {/* Campo para visualizar e editar logo */}
              <div className="flex flex-col items-center mb-4">
                <img
                  src={empresaEditada.logo}
                  alt="Logo da Empresa"
                  className="w-32 h-32 object-cover   shadow-md"
                />
              </div>

              {editando ? (
                <div className="space-y-2">
                  <label
                    htmlFor="upload-logo"
                    className="mt-2 px-4 bg-neutral-100  py-2 bg-blue-500 text-white  hover:bg-blue-600 transition cursor-pointer"
                  >
                    Alterar Logo
                  </label>
                  <input
                    id="upload-logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <input
                    type="text"
                    name="nome"
                    value={empresaEditada.nome}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    placeholder="Nome da Empresa"
                  />
                  <input
                    type="text"
                    name="cnpj"
                    value={empresaEditada.cnpj}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    placeholder="CNPJ"
                  />
                  <input
                    type="text"
                    name="endereco"
                    value={empresaEditada.endereco}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    placeholder="Endereço"
                  />
                  <input
                    type="text"
                    name="telefone"
                    value={empresaEditada.telefone}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    placeholder="Telefone"
                  />
                  <input
                    type="email"
                    name="email"
                    value={empresaEditada.email}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    placeholder="Email"
                  />

                  <button
                    onClick={salvarEdicao}
                    className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    Salvar Alterações
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p>
                    <strong>Nome:</strong> {empresa.nome}
                  </p>
                  <p>
                    <strong>CNPJ:</strong> {empresa.cnpj}
                  </p>
                  <p>
                    <strong>Endereço:</strong> {empresa.endereco}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {empresa.telefone}
                  </p>
                  <p>
                    <strong>Email:</strong> {empresa.email}
                  </p>

                  <button
                    onClick={() => setEditando(true)}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    Editar Dados
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Admin;
