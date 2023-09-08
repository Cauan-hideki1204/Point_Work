const mysql = require("mysql");
const express = require('express');
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "dbpointwork"
})

function calcularHorasTrabalhadasEsteMes(idFuncionario) {

    const primeiroDia = new Date(ano, mes - 1, 1);
    const ultimoDia = new Date(ano, mes, 0);

    let totalHorasTrabalhadasMes = 0;

    let dataAtual = new Date(primeiroDia);

    while (dataAtual <= ultimoDia) {
        const dataFormatada = `${dataAtual.getFullYear()}-${dataAtual.getMonth() + 1}-${dataAtual.getDate()}`;

        db.query(
            'SELECT hora_entrada, hora_saida_intervalo, hora_entrada_intervalo, hora_saida FROM tbregistro_ponto WHERE id_funcionario = ? AND DATE(hora_entrada) = ?',
            [idFuncionario, dataFormatada],
            (err, result) => {
                if (err) {
                    console.error(err);
                } else {
                    if (result.length > 0) {
                        let totalHorasTrabalhadasDia = 0;

                        for (const registro of result) {
                            const horaEntrada = new Date(registro.hora_entrada);
                            const horaSaidaIntervalo = new Date(registro.hora_saida_intervalo);
                            const horaEntradaIntervalo = new Date(registro.hora_entrada_intervalo);
                            const horaSaida = new Date(registro.hora_saida);

                            const duracaoIntervalo = horaSaidaIntervalo - horaEntradaIntervalo;

                            const diferencaSemIntervalo = (horaSaida - horaEntrada) - duracaoIntervalo;

                            const horasTrabalhadas = diferencaSemIntervalo / (1000 * 60 * 60);

                            totalHorasTrabalhadasDia += horasTrabalhadas;
                        }

                        totalHorasTrabalhadasMes += totalHorasTrabalhadasDia;

                    }
                }
            }
        );

        dataAtual.setDate(dataAtual.getDate() + 1);
    }

    db.query(
        'SELECT carga_horaria_mensal FROM tbfuncionario WHERE id = ?',
        [idFuncionario],
        (err, result) => {
            if(err) {
                console.log(err);
            } else {
                let horasExtras = totalHorasTrabalhadasMes - result[0].carga_horaria_mensal;
                console.log(result);
                console.log(horasExtras);

                // Definir horasExtras no escopo superior para uso no setTimeout
                setTimeout(() => {
                    db.query(
                        'SELECT * FROM tbhorasextras WHERE id_funcionario = ? AND mes = ? AND ano = ?',
                        [idFuncionario, mes, ano],
                        (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {

                                if (result.length > 0) {
                                    db.query(
                                        'UPDATE tbhorasextras SET quantidade_horas_extras = ? WHERE id_funcionario = ? AND mes = ? AND ano = ?',
                                        [horasExtras, idFuncionario, mes, ano],
                                        (err, result) => {
                                            if (err){
                                                console.log(err)
                                            }
                                        }
                                    )
                                } else {
                                    db.query(
                                        'INSERT INTO tbhorasextras (id_funcionario, quantidade_horas_extras, mes, ano) VALUES (?, ?, ?, ?)',
                                        [idFuncionario, horasExtras, mes, ano],
                                        (err, result) => {
                                            if(err){
                                                console.log(err)
                                            } 
                                        }
                                    )
                                }
                            }
                        }
                    )
                }, 5000);
            }
        }
    )
}


const hoje = new Date();
const ano = hoje.getFullYear();
const mes = hoje.getMonth() + 1;

function main() {

    app.listen(3001, () => {
        console.log("rodando")
    });
}

module.exports = {
    main,
    calcularHorasTrabalhadasEsteMes,
};
