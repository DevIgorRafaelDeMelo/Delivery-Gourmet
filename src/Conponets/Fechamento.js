import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

const Fechamento = () => {
  const [pedidosAtendidos, setPedidosAtendidos] = useState([]);
  const [dataInicio, setDataInicio] = useState(() => {
    const hoje = new Date();
    hoje.setDate(hoje.getDate() - 1);
    return hoje.toISOString().split("T")[0]; // Define o dia atual
  });

  const [dataFim, setDataFim] = useState(() => {
    const amanhã = new Date();
    amanhã.setDate(amanhã.getDate() - 0); // Define o dia seguinte
    return amanhã.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  });

  const [horaInicio, setHoraInicio] = useState("20:00"); // Padrão: 8 da noite
  const [horaFim, setHoraFim] = useState("04:00");
  const pedidosFiltrados = pedidosAtendidos.filter((pedido) => {
    const pedidoData = new Date(pedido.horario); // Converter data do pedido

    // Criar datas completas com hora
    const inicio =
      dataInicio && horaInicio
        ? new Date(`${dataInicio}T${horaInicio}:00`)
        : null;
    const fim =
      dataFim && horaFim ? new Date(`${dataFim}T${horaFim}:59`) : null;

    if (inicio && fim) {
      return pedidoData >= inicio && pedidoData <= fim;
    }
    return true; // Se nenhuma data/hora for selecionada, exibir todos os pedidos
  });

  const formatarData = (isoString) => {
    const data = new Date(isoString);

    // Opções para exibir a data no formato brasileiro (dd/MM/yyyy hh:mm)
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/Sao_Paulo", // Ajusta para o horário do Brasil
    };

    return data.toLocaleString("pt-BR", options);
  };
  const gerarRelatorioPDF = () => {
    const doc = new jsPDF();

    // Estiliza o título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Relatório de Pedidos Atendidos", 105, 15, { align: "center" });

    // Mostra período filtrado no relatório
    doc.setFontSize(12);
    doc.text(
      `Período selecionado: ${dataInicio} ${horaInicio} até ${dataFim} ${horaFim}`,
      14,
      25
    );

    // Formata os dados da tabela
    const dadosTabela = pedidosFiltrados.map((pedido) => [
      pedido.nome,
      formatarData(pedido.horario),
      `R$ ${pedido.total}`,
      pedido.formaPagamento,
    ]);

    // Gera a tabela de pedidos
    autoTable(doc, {
      startY: 35,
      head: [["Cliente", "Horário", "Valor Total", "Forma de Pagamento"]],
      body: dadosTabela,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [26, 148, 136] }, // Cor do cabeçalho
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Alternância de cores nas linhas
      margin: { left: 14, right: 14 },
    });

    // Calcula o total geral dos pedidos filtrados
    const totalGeral = pedidosFiltrados
      .reduce((acc, pedido) => acc + Number(pedido.total || 0), 0)
      .toFixed(2);

    // Adiciona os totais no PDF com estilo
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Totais por Forma de Pagamento:", 14, finalY);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Pix: R$ ${totalPix}`, 14, finalY + 10);
    doc.text(`Cartão (Crédito/Débito): R$ ${totalCartao}`, 14, finalY + 20);
    doc.text(`Dinheiro: R$ ${totalDinheiro}`, 14, finalY + 30);

    // Adiciona o total geral de pedidos no relatório
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Geral: R$ ${totalGeral}`, 14, finalY + 50);

    // Salva o arquivo PDF
    doc.save("relatorio-pedidos.pdf");
  };
  const totalPix = pedidosFiltrados
    .filter((pedido) => pedido.formaPagamento === "Pix")
    .reduce((acc, pedido) => acc + Number(pedido.total || 0), 0)
    .toFixed(2);

  const totalCartao = pedidosFiltrados
    .filter(
      (pedido) =>
        pedido.formaPagamento === "Cartão de Crédito" ||
        pedido.formaPagamento === "Cartão de Débito"
    )
    .reduce((acc, pedido) => acc + Number(pedido.total || 0), 0)
    .toFixed(2);

  const totalDinheiro = pedidosFiltrados
    .filter((pedido) => pedido.formaPagamento === "Dinheiro")
    .reduce((acc, pedido) => acc + Number(pedido.total || 0), 0)
    .toFixed(2);

  useEffect(() => {
    const fetchPedidosAtendidos = async () => {
      try {
        const db = getFirestore();
        const pedidosRef = collection(db, "pedidos");
        const q = query(pedidosRef, where("status", "==", "Atendido"));
        const querySnapshot = await getDocs(q);

        const pedidos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPedidosAtendidos(pedidos);
      } catch (error) {
        console.error("Erro ao buscar pedidos atendidos:", error);
      }
    };

    fetchPedidosAtendidos();
  }, []);

  return (
    <section className="text-center sm:h-[100vh] h-full sm:px-[10%] px-4 p-12">
      <h2 className="text-2xl pt-20 font-semibold text-teal-700 mb-4 text-center">
        Fechamento Dia
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 w-[100%] sm:w-[50%] lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Data Início:
          </label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full bg-white focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Hora Início:
          </label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full bg-white focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Data Fim:
          </label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full bg-white focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Hora Fim:
          </label>
          <input
            type="time"
            value={horaFim}
            onChange={(e) => setHoraFim(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full bg-white focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        {pedidosFiltrados.length > 0 ? (
          <table className="w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-teal-500 text-white">
                <th className="p-4 text-left">Cliente</th>
                <th className="p-4 text-left">Horário</th>
                <th className="p-4 text-left">Valor Total</th>
                <th className="p-4 text-left">Forma de Pagamento</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id} className="border-b bg-gray-100">
                  <td className="p-4 text-gray-700">{pedido.nome}</td>
                  <td className="p-4 text-gray-700">
                    {formatarData(pedido.horario)}
                  </td>
                  <td className="p-4 font-bold text-teal-700">
                    R$ {pedido.total}
                  </td>
                  <td className="p-4 font-bold text-teal-700">
                    {pedido.formaPagamento}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">
            Nenhum pedido encontrado no período selecionado.
          </p>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-700">
          Totais por Forma de Pagamento:
        </h3>

        <p className="text-teal-700 font-semibold">
          Pix: R${" "}
          {Number(
            pedidosFiltrados
              .filter((pedido) => pedido.formaPagamento === "Pix")
              .reduce((acc, pedido) => acc + Number(pedido.total || 0), 0)
          ).toFixed(2)}
        </p>

        <p className="text-teal-700 font-semibold">
          Cartão (Crédito/Débito): R${" "}
          {Number(
            pedidosFiltrados
              .filter(
                (pedido) =>
                  pedido.formaPagamento === "Cartão de Crédito" ||
                  pedido.formaPagamento === "Cartão de Débito"
              )
              .reduce((acc, pedido) => acc + Number(pedido.total || 0), 0)
          ).toFixed(2)}
        </p>

        <p className="text-teal-700 font-semibold">
          Dinheiro: R${" "}
          {Number(
            pedidosFiltrados
              .filter((pedido) => pedido.formaPagamento === "Dinheiro")
              .reduce((acc, pedido) => acc + Number(pedido.total || 0), 0)
          ).toFixed(2)}
        </p>
      </div>
      <button
        onClick={gerarRelatorioPDF}
        className="mt-4 px-4 py-2 mb-20 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 font-semibold"
      >
        Gerar Relatório em PDF 📄
      </button>
    </section>
  );
};

export default Fechamento;
