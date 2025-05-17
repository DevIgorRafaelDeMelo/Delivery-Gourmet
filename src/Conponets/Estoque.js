import { useState, useEffect } from "react";
import { DB } from "../firebaseConfig"; // Importa a configuração do Firebase
import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
function Estoque() {
  const [comidas, setComidas] = useState([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [quantidadeNova, setQuantidadeNova] = useState(0);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const abrirModal = (produto) => {
    setProdutoSelecionado(produto);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setQuantidadeNova(0);
  };

  const handleAdicionarEstoque = async () => {
    if (!produtoSelecionado) return;

    try {
      const itemRef = doc(DB, "produtos", produtoSelecionado.id);
      const docSnap = await getDoc(itemRef);

      if (!docSnap.exists()) {
        console.error(
          `Erro: O produto '${produtoSelecionado.id}' não existe no Firestore.`
        );
        return;
      }

      await updateDoc(itemRef, {
        QTD: docSnap.data().QTD + Number(quantidadeNova),
      });

      console.log("Quantidade atualizada com sucesso!");

      fecharModal();
    } catch (error) {
      console.error("Erro ao atualizar estoque:", error);
    }
    fetchComidas();
  };
  const fetchComidas = async () => {
    const querySnapshot = await getDocs(collection(DB, "produtos")); // 'estoque' é o nome da coleção no Firestore
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setComidas(items);
  };

  useEffect(() => {
    fetchComidas();
  }, []);

  return (
    <section className="text-center sm:h-[100vh] sm:px-[10%] px-4">
      <div>
        <h2 className="text-lg sm:text-2xl pt-40 font-extrabold text-teal-500 py-6 sm:py-10">
          Gerenciamento de Estoque
        </h2>

        {/* Tabela Responsiva */}
        <div className="overflow-x-auto">
          <table className="min-w-full  bg-white border border-gray-300 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-teal-500 text-white">
                <th className="p-4 text-left"></th>
                <th className="p-4 text-left">Nome</th>
                <th className="p-4 text-left">Preço/C</th>
                <th className="p-4 text-left">Preço/V</th>
                <th className="p-4 text-left">Quantidade</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {comidas.map((produto, index) => (
                <tr
                  key={produto.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <td className="p-4">
                    <div className="w-14   sm:block h-14 sm:w-16 sm:h-16 rounded overflow-hidden shadow-md">
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-4=2">{produto.nome}</td>
                  <td className="p-4">{produto.preco}</td>
                  <td className="p-4">{produto.precoFinal}</td>
                  <td className="p-4">{produto.QTD} UN</td>
                  <td className="p-4 text-center">
                    <button
                      className="bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded shadow-md hover:bg-green-600"
                      onClick={() => abrirModal(produto)}
                    >
                      Adicionar Estoque
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Responsivo */}
        {modalAberto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center max-w-sm sm:max-w-md">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                Adicionar Estoque para {produtoSelecionado.nome}
              </h3>
              <input
                type="number"
                className="border p-2 rounded w-full text-center"
                placeholder="Quantidade a adicionar"
                value={quantidadeNova}
                onChange={(e) => setQuantidadeNova(e.target.value)}
              />
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <button
                  className="bg-teal-500 text-white px-4 py-2 rounded shadow-md hover:bg-teal-600"
                  onClick={handleAdicionarEstoque}
                >
                  Confirmar
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Estoque;
