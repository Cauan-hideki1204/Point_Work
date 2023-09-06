const express = require('express');
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "dbpointwork"
})
let horaAtual = new Date();
let dia = horaAtual.getDate();
let mes = horaAtual.getMonth() + 1;
let ano = horaAtual.getFullYear();
let dataFormatada = `${ano}-${mes < 10 ? '0' + mes : mes}-${dia < 10 ? '0' + dia : dia}`;

app.use(express.json());
app.use(cors());

app.post("/cadastrar-cargo", (req, res) => {
    const cargo = req.body.cargo;
    const salario_base = req.body.salario_base;
    const carga_horaria = req.body.carga_horaria;

    db.query("SELECT * FROM tbcargo WHERE cargo = ?", [cargo],
        (err, result) => {
            if (err) {
                res.send(err);
            }
            if (result.length == 0) {
                db.query(
                    'INSERT INTO tbcargo (cargo, salario_base, carga_horaria) VALUES (?, ?, ?)',
                    [cargo, salario_base, carga_horaria],
                    (err, result) => {
                        if (err) {
                            res.send(err);
                        }
                        res.send({ msg: "Cargo " + cargo + " cadastrado com sucesso" });
                    }
                );
            } else {
                res.send({ msg: "Cargo " + cargo + " já cadastrado anteriormente" })
            }
        });
});

app.post("/registrar", (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;
    const nome = req.body.nome;
    const cpf = req.body.cpf;
    const idCargo = req.body.cargo;
    const dataAdimissao = req.body.admissao;
    const dataDemissao = req.body.demissao;

    db.query("SELECT * FROM tbfuncionario WHERE email = ?", [email],
        (err, result) => {
            if (err) {
                res.send(err);
            }
            if (result.length == 0) {
                bcrypt.hash(senha, saltRounds, (err, hash) => {
                    db.query(
                        "INSERT INTO tbfuncionario (nome, email, senha, cpf, id_cargo, data_admissao, data_demissao) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        [nome, email, hash, cpf, idCargo, dataAdimissao, dataDemissao],
                        (err, result) => {
                            if (err) {
                                res.send(err);
                            }

                            res.send({ msg: "Cadastrado com sucesso" });
                        }
                    );
                });

            } else {
                res.send({ msg: "Usuário já cadastrado" });
            }
        });
})

app.post('/login', (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    db.query("SELECT * FROM tbfuncionario WHERE email = ?", [email],
        (err, result) => {
            if (err) {
                res.send(err);
            }
            if (result.length > 0) {
                bcrypt.compare(senha, result[0].senha, (err, result) => {
                    if (err) {
                        res.send(err);
                    }
                    if (result) {
                        res.send({ msg: "Usuário logado com sucesso" })
                    } else {
                        res.send({ msg: "Senha incorreta" })
                    }
                });

            } else {
                res.send({ msg: "Usuário não encontrado" })
            }
        });
});

app.get('/funcionarios', (req, res) => {
    db.query("SELECT id, nome, email, cpf FROM tbfuncionario", (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

app.put("/alterar-funcionario/:id", (req, res) => {
    const idFuncionario = req.params.id;
    const novoNome = req.body.novoNome;
    const novoCpf = req.body.novoCpf;
    const novoEmail = req.body.novoEmail;

    const sqlParts = [];
    const sqlValues = [];

    if (novoNome) {
        sqlParts.push("nome = ?");
        sqlValues.push(novoNome);
    }

    if (novoEmail) {
        sqlParts.push("email = ?");
        sqlValues.push(novoEmail);
    }

    if (novoCpf) {
        sqlParts.push("cpf = ?");
        sqlValues.push(novoCpf);
    }

    if (sqlParts.length === 0) {
        return res.status(400).send({ msg: "Nenhum dado para atualizar" });
    }

    const sqlQuery = `UPDATE tbfuncionario SET ${sqlParts.join(", ")} WHERE id = ?`;

    sqlValues.push(idFuncionario);

    db.query(sqlQuery, sqlValues, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send({ msg: "Funcionário alterado com sucesso" });
        }
    });
});


app.delete("/funcionarios/:id", (req, res) => {
    const idFuncionario = req.params.id;

    db.query(
        "DELETE FROM tbfuncionario WHERE id = ?",
        [idFuncionario],
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send({ msg: "Funcionário deletado com sucesso" });
            }
        }
    );
});

app.post('/cartao-ponto/:id', (req, res) => {
    const idFuncionario = req.params.id;

    // Verificar se o funcionário já registrou o ponto de entrada hoje
    db.query(
        'SELECT * FROM tbregistro_ponto WHERE id_funcionario = ? AND DATE(hora_entrada) = CURDATE()',
        [idFuncionario, horaAtual],
        (err, result) => {
            if (err) {
                console.error('Erro ao consultar registro de entrada:', err);
                return res.status(500).json({ msg: 'Erro no servidor verificação entrada' });
            }

            if (result.length === 0) {
                // O funcionário ainda não registrou o ponto hoje, então registramos a entrada
                db.query(
                    'INSERT INTO tbregistro_ponto (id_funcionario, hora_entrada) VALUES (?, ?)',
                    [idFuncionario, horaAtual],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({ msg: 'Erro no servidor registro entrada' });
                        }
                        res.json({ msg: 'Ponto de entrada registrado com sucesso' });
                    }
                );
            } else if (result.length === 1 && !result[0].hora_saida_intervalo) {
                // O funcionário já registrou a entrada hoje, mas ainda não registrou a saída para o intervalo
                db.query(
                    'UPDATE tbregistro_ponto SET hora_saida_intervalo = ? WHERE id_funcionario = ?',
                    [horaAtual, idFuncionario],
                    (err, result) => {
                        if (err) {
                            console.error('Erro ao atualizar ponto de saída do intervalo:', err);
                            return res.status(500).json({ msg: 'Erro no servidor verificação saida do intervalo' });
                        }
                        res.json({ msg: 'Ponto de saída do intervalo registrado com sucesso' });
                    }
                );
            } else if (result.length === 1 && !result[0].hora_entrada_intervalo) {
                // O funcionário já registrou a saida para o intervalo, mas ainda não registrou a entrada do intervalo
                db.query(
                    'UPDATE tbregistro_ponto SET hora_entrada_intervalo = ? WHERE id_funcionario = ?',
                    [horaAtual, idFuncionario],
                    (err, result) => {
                        if (err) {
                            console.error('Erro ao atualizar ponto de entrada do intervalo', err);
                            return res.status(500).json({ msg: 'Erro no servidor verificação entrada do intervalo' });
                        }
                        res.json({ msg: 'Ponto de entrada do intevalo registrado com sucesso' });
                    }
                );
            } else if (result.length === 1 && !result[0].hora_saida) {
                //O funcionário já registrou a entrada do intervalo, mas não resgistrou a saída
                db.query(
                    'UPDATE tbregistro_ponto SET hora_saida = ? WHERE id_funcionario = ?',
                    [horaAtual, idFuncionario],
                    (err, result) => {
                        if (err) {
                            console.error('Erro ao atualizar ponto de saida', err);
                            return res.status(500).json({ msg: 'Erro no servidor verificação saída' });
                        }
                        res.json({ msg: 'Ponto de saída registrado com sucesso' });
                    }
                );
            } else {
                // O funcionário já registrou a entrada e saída hoje
                res.status(400).json({ msg: 'Você já registrou o ponto de entrada e saída hoje' });
            }
        }
    );
});

// Obter Registros do dia 
app.get("/cartao-ponto/:id", (req, res) => {
    const idFuncionario = req.params.id
    db.query(
        'SELECT hora_entrada, hora_saida_intervalo, hora_entrada_intervalo, hora_saida FROM tbregistro_ponto WHERE id_funcionario = ?',
        [idFuncionario], (err, result) => {
            if (err) {
                console.log("Erro ao obter registros de ponto", err);
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.post("/registrar-avisos/:id", (req, res) => {
    const idFuncionario = req.params.id;
    const tituloAviso = req.body.titulo;
    const conteudoAviso = req.body.conteudo;
    if (idFuncionario || tituloAviso || conteudoAviso != null) {
        db.query(
            'INSERT INTO tbavisos (titulo, conteudo, data_criacao, id_funcionario) VALUES (?, ?, ?, ?)',
            [tituloAviso, conteudoAviso, dataFormatada, idFuncionario],
            (err, result) => {
                if (err) {
                    console.error("erro aqui", err);
                    res.send(err);
                } else {
                    res.send({ msg: "Aviso registrado" })
                }
            }

        );
    } else {
        res.send({ msg: "Todos os campos devem ser preenchidos" })
    }
});

app.get("/avisos", (req, res) => {
    db.query(
        'SELECT id, titulo, conteudo, data_criacao FROM tbavisos',
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.delete('/avisos/delete/:id', (req, res) => {
    const idAviso = req.params.id;

    db.query(
        'DELETE FROM tbavisos WHERE id = ?',
        [idAviso],
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send({ msg: 'Aviso deletado' });
            }
        }
    );
});

app.delete('/avisos/deletar-todos', (req,res) =>{
    db.query(
        'DELETE FROM tbavisos',
        (err,result) => {
            if(err) {
                res.send(err);
            } else {
                res.send({msg: 'Todos os avisos foram deletados'});
            }
        }
    );
});

app.listen(3001, () => {
    console.log("rodando")
})