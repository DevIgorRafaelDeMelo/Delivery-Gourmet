import { useState, useEffect } from "react";
import { DB } from "../firebaseConfig"; // Certifique-se de importar sua configuração do Firebase
import { doc, getDoc, updateDoc } from "firebase/firestore";

const StatusProduto = ({ produtoSelecionado }) => {
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const produtoRef = doc(DB, "produtos", produtoSelecionado.id);
        const produtoSnap = await getDoc(produtoRef);

        if (produtoSnap.exists()) {
          setAtivo(produtoSnap.data().ativo);
        }
      } catch (error) {
        console.error("Erro ao buscar status do produto:", error);
      }
    };

    if (produtoSelecionado) {
      fetchStatus();
    }
  }, [produtoSelecionado]);

  const alternarStatus = async () => {
    try {
      const produtoRef = doc(DB, "produtos", produtoSelecionado.id);
      await updateDoc(produtoRef, { ativo: !ativo });
      setAtivo(!ativo);
    } catch (error) {
      console.error("Erro ao atualizar status do produto:", error);
    }
  };

  return (
    <div className="w-full flex justify-end ">
      <button
        onClick={alternarStatus}
        className={`px-4 py-2 bg-cyan-500 text-white font-medium rounded-md hover:bg-red-600 transition shadow-md ${
          ativo
            ? "bg-teal-500 hover:bg-teal-600"
            : "bg-gray-500 hover:bg-gray-600"
        }`}
      >
        {ativo ? "ATV" : "DST"}
      </button>
    </div>
  );
};

export default StatusProduto;
