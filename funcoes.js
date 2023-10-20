const mysql = require("mysql");
const { google } = require('googleapis');

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "dbpointwork"
});

const API_KEY = 'AIzaSyARFj40fmiiX3WDfRf8_Wx6Qxsd587Cq4k';
const calendar = google.calendar({ version: 'v3' });

async function buscarFeriados() {
    const hoje = new Date();
    const primeiroDiaDoAno = new Date(hoje.getFullYear(), 0, 1);
    const ultimoDiaDoAno = new Date(hoje.getFullYear(), 11, 31);

    const params = {
        calendarId: 'pt.brazilian#holiday@group.v.calendar.google.com',
        timeMin: primeiroDiaDoAno.toISOString(),
        timeMax: ultimoDiaDoAno.toISOString(),
        maxResults: 100,
        singleEvents: true,
        orderBy: 'startTime',
        key: API_KEY,
    };

    try {
        const res = await calendar.events.list(params);
        const events = res.data.items;
        const feriados = [];

        if (events.length) {
            events.forEach((event) => {
                const dataFeriado = new Date(event.start.date);
                const ano = dataFeriado.getFullYear();
                const mes = dataFeriado.getMonth() + 1;
                const dia = dataFeriado.getDate() + 1;
                const dataFormatada = `${ano}-${mes < 10 ? '0' + mes : mes}-${dia < 10 ? '0' + dia : dia}`;
                feriados.push(dataFormatada);

            });
        } else {
            console.log('Nenhum feriado encontrado');
        }

        return feriados;
    } catch (err) {
        console.error('Erro ao buscar feriados', err);
        return [];
    }
}

async function calcularHorasTrabalhadasEsteMes(idFuncionario) {
    const feriados = await buscarFeriados();
    
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth() + 1;
    const primeiroDia = new Date(ano, mes - 1, 1);
    const ultimoDia = new Date(ano, mes, 0);
    let quantidadeSabadosNoMes = 0;       

    let totalHorasTrabalhadasMes = 0;

    let dataAtual = new Date(primeiroDia);

    while (dataAtual <= ultimoDia) {
        const dataFormatada = `${dataAtual.getFullYear()}-${dataAtual.getMonth() + 1}-${dataAtual.getDate()}`;
        const diaDaSemana = dataAtual.getDay();
        if (diaDaSemana == 6 ) {

            quantidadeSabadosNoMes += 1;
            
        }

        if (!feriados.includes(dataFormatada)) {
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

                                const duracaoIntervalo = (horaSaidaIntervalo - horaEntradaIntervalo) / (1000 * 60 * 60);
                                const horasTrabalhadas = (horaSaida - horaEntrada) / (1000 * 60 * 60) + duracaoIntervalo;

                                totalHorasTrabalhadasDia += horasTrabalhadas;
                            }

                            totalHorasTrabalhadasMes += totalHorasTrabalhadasDia;
                        }
                    }
                }
            );
        }

        dataAtual.setDate(dataAtual.getDate() + 1);
    }
    db.query(
        'SELECT carga_horaria_mensal FROM tbfuncionario WHERE id = ?',
        [idFuncionario],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                let horasExtras = totalHorasTrabalhadasMes - result[0].carga_horaria_mensal + quantidadeSabadosNoMes * 8.8;
                
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
                                            if (err) {
                                                console.log(err);
                                                console.log("atualizado");
                                            }
                                        }
                                    )
                                } else {
                                    db.query(
                                        'INSERT INTO tbhorasextras (id_funcionario, quantidade_horas_extras, mes, ano) VALUES (?, ?, ?, ?)',
                                        [idFuncionario, horasExtras, mes, ano],
                                        (err, result) => {
                                            if (err) {
                                                console.log(err)
                                            } else {
                                                console.log('Inseridas horas extras no banco de dados');
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    )
            }
        }
    )
}

function pegarSalarioBase(idFuncionario) {
    return new Promise((resolve, reject) => {
        db.query('SELECT id_cargo FROM tbfuncionario WHERE id = ?', [idFuncionario], (err, result) => {
            if (err) {
                reject(err);
            } else {
                const idCargo = result[0].id_cargo;
                db.query('SELECT salario_base, carga_horaria FROM tbcargo WHERE id = ?', [idCargo], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0]);
                    }
                });
            }
        });
    });
}

function pegarHorasExtras(idFuncionario, salarioBase, cargaHoraria) {
    return new Promise((resolve, reject) => {
        db.query('SELECT quantidade_horas_extras FROM tbhorasextras WHERE id_funcionario = ? AND mes = ?', [idFuncionario, mes], (err, result) => {
            if (err) {
                reject(err);
            } else {
                const quantidadeHorasExtras = result[0].quantidade_horas_extras;
                const valorPorHoraExtra = (salarioBase / cargaHoraria) * 0.7;
                const valorHorasExtras = valorPorHoraExtra * quantidadeHorasExtras;
                resolve(valorHorasExtras);
            }
        });
    });
}

function calcularDescontos(salarioBase) {
    return new Promise((resolve, reject) => {
      if (salarioBase <= 1045) {
        const descontoINSS = salarioBase * 0.075;
        resolve(descontoINSS);
      } else if (salarioBase <= 2089.6) {
        const descontoINSS = (salarioBase - 1045) * 0.09 + 1045 * 0.075;
        resolve(descontoINSS);
      } else if (salarioBase <= 3134.4) {
        const descontoINSS = (salarioBase - 2089.6) * 0.12 + 1045 * 0.075 + (2089.6 - 1045) * 0.09;
        resolve(descontoINSS);
      } else if (salarioBase <= 6101.06) {
        const descontoINSS = (salarioBase - 3134.4) * 0.14 + 1045 * 0.075 + (2089.6 - 1045) * 0.09 + (3134.4 - 2089.6) * 0.12;
        resolve(descontoINSS);
      } else {
        const descontoINSS = 713.1; // Valor máximo de desconto do INSS
        resolve(descontoINSS);
      }
    });
  }
  


const hoje = new Date();
const ano = hoje.getFullYear();
const mes = hoje.getMonth() + 1;

module.exports = {
    calcularHorasTrabalhadasEsteMes,
    pegarSalarioBase,
    pegarHorasExtras,
    calcularDescontos,
};
