const form = document.getElementById("form");
const resultado = document.getElementById("resultado");

const moeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

function calcularFinanciamento(valor, entrada, taxa, prazo) {
    const financiado = valor - entrada;

    if (taxa === 0) {
        return {
            financiado,
            parcela: financiado / prazo,
            totalPago: financiado,
            juros: 0
        };
    }

    const i = taxa / 100;
    const fator = Math.pow(1 + i, prazo);
    const parcela = financiado * (i * fator) / (fator - 1);
    const totalPago = parcela * prazo;

    return {
        financiado,
        parcela,
        totalPago,
        juros: totalPago - financiado
    };
}

function gerarAnalise(juros, financiado) {
    const percentual = (juros / financiado) * 100;

    if (percentual > 100) {
        return { texto: "⚠️ Você pagará mais de um carro apenas em juros.", classe: "alerta" };
    }
    if (percentual > 50) {
        return { texto: "⚠️ Juros elevados. Considere reduzir o prazo ou aumentar a entrada.", classe: "alerta" };
    }
    return { texto: "✅ Financiamento dentro de um nível aceitável.", classe: "ok" };
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const valor = Number(document.getElementById("valor").value);
    const entrada = Number(document.getElementById("entrada").value);
    const taxa = Number(document.getElementById("taxa").value);
    const prazo = Number(document.getElementById("prazo").value);
    const seguro = Number(document.getElementById("seguro").value) || 0;
    const ipva = Number(document.getElementById("ipva").value) || 0;

    if (entrada >= valor) {
        alert("A entrada deve ser menor que o valor do veículo.");
        return;
    }

    const dados = calcularFinanciamento(valor, entrada, taxa, prazo);
    const extras = ((seguro + ipva) / 12) * prazo;
    const analise = gerarAnalise(dados.juros, dados.financiado);

    resultado.hidden = false;
    resultado.innerHTML = `
        <h2>📊 Resumo</h2>
        <p>Valor financiado: <strong>${moeda.format(dados.financiado)}</strong></p>
        <p>Parcela mensal: <strong>${moeda.format(dados.parcela)}</strong></p>
        <p>Total pago: <strong>${moeda.format(dados.totalPago)}</strong></p>
        <p class="alerta">Juros pagos: <strong>${moeda.format(dados.juros)}</strong></p>

        <h3>🚗 Custos Extras</h3>
        <p>Seguro + IPVA (estimado): <strong>${moeda.format(extras)}</strong></p>

        <h3>📌 Análise</h3>
        <p class="${analise.classe}">${analise.texto}</p>
    `;
});
