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
    database: "point_work"
})

app.use(express.json());
app.use(cors());

app.post("/register", (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;
    const nome = req.body.nome;
    const cpf = req.body.cpf;

    console.log(req);

    db.query("SELECT * FROM tbfuncionario WHERE email = ?", [email],
        (err, result) => {
            if (err) {
                res.send(err);
            }
            if (result.length == 0) {
                bcrypt.hash(senha, saltRounds, (err, hash) => {
                    db.query(
                        "INSERT INTO tbfuncionario (nome, email, senha, cpf) VALUES (?, ?, ?, ?)",
                        [nome, email, hash, cpf],
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
                bcrypt.compare(senha, result[0].senha, (erro, result) => {
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
    db.query("SELECT nome, cpf FROM tbfuncionario", (err, result) => {
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

    const sqlParts = [];
    const sqlValues = [];

    if (novoNome) {
        sqlParts.push("nome = ?");
        sqlValues.push(novoNome);
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
    const horaAtual = new Date(); // Obtém a hora atual

    // Verificar se o funcionário já registrou o ponto de entrada hoje
    db.query(
        'SELECT * FROM tbregistroponto WHERE id_funcionario = ? AND DATE(hora_entrada) = CURDATE()',
        [idFuncionario, horaAtual],
        (err, result) => {
            if (err) {
                console.error('Erro ao consultar registro de entrada:', err);
                return res.status(500).json({ msg: 'Erro no servidor verificação entrada' });
            }

            if (result.length === 0) {
                // O funcionário ainda não registrou o ponto hoje, então registramos a entrada
                db.query(
                    'INSERT INTO tbregistroponto (id_funcionario, hora_entrada) VALUES (?, ?)',
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
                    'UPDATE tbregistroponto SET hora_saida_intervalo = ? WHERE id_funcionario = ?',
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
                    'UPDATE tbregistroponto SET hora_entrada_intervalo = ? WHERE id_funcionario = ?',
                    [horaAtual, idFuncionario],
                    (err, result) => {
                        if(err){
                            console.error('Erro ao atualizar ponto de entrada do intervalo', err);
                            return res.status(500).json({ msg:'Erro no servidor verificação entrada do intervalo'});
                        }
                        res.json({ msg:'Ponto de entrada do intevalo registrado com sucesso'});
                    }
                );
            } else if (result.length === 1 && !result[0].hora_saida){
                //O funcionário já registrou a entrada do intervalo, mas não resgistrou a saída
                db.query(
                    'UPDATE tbregistroponto SET hora_saida = ? WHERE id_funcionario = ?',
                    [horaAtual, idFuncionario],
                    (err, result) => {
                        if(err) {
                            console.error('Erro ao atualizar ponto de saida', err);
                            return res.status(500).json({ msg: 'Erro no servidor verificação saída'});
                        }
                        res.json({ msg: 'Ponto de saída registrado com sucesso'});
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
app.get("/cartao-ponto/:id", (req,res) => {
    const idFuncionario = req.params.id
    db.query(
        'SELECT hora_entrada, hora_saida_intervalo, hora_entrada_intervalo, hora_saida FROM tbregistroponto WHERE id_funcionario = ?',
        [idFuncionario], (err, result) => {
            if(err){
                console.log("Erro ao obter registros de ponto", err);
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});
app.listen(3001, () => {
    console.log("rodando")
})