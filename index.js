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
        if(err) {
            res.send(err);
        }
        if (result.length == 0) {
            bcrypt.hash(senha,saltRounds, (err, hash) => {
                db.query(
                    "INSERT INTO tbfuncionario (nome, email, senha, cpf) VALUES (?, ?, ?, ?)",
                    [nome, email, hash, cpf],
                    (err, result) => {
                        if (err) {
                            res.send(err);
                        }
    
                        res.send({msg: "Cadastrado com sucesso" });
                    }
                );
            });
           
        }else{
            res.send({msg: "Usuário já cadastrado" });
        }
    });
})

app.post('/login', (req,res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    db.query("SELECT * FROM tbfuncionario WHERE email = ?", [email],
    (err, result) =>{
        if (err) {
            res.send(err);
        }
        if (result.length > 0){
            bcrypt.compare(senha, result[0].senha, (erro, result) => {
                if(err){
                    res.send(err);
                }
                if(result){
                    res.send({msg: "Usuário logado com sucesso"})
                }else{
                    res.send({msg: "Senha incorreta"})
                }
            });
            
        }else{
            res.send({msg: "Usuário não encontrado"})
        }
    });
});

app.get('/funcionarios', (req,res) => {
    db.query("SELECT nome, cpf FROM tbfuncionario", (err, result) =>{
        if(err){
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

app.put("/alterar-funcionario/:id", (req, res) =>{
    const idFuncionario = req.params.id;
    const novoNome = req.body.novoNome;
    const novoCpf = req.body.novoCpf;

    db.query(
        "UPDATE tbfuncionario SET nome = ?, cpf = ? WHERE id = ?",
        [novoNome, novoCpf, idFuncionario],
        (err, result) => {
            if (err){
                res.send(err);
            } else {
                res.send({ msg: "Funcionário alterado com sucesso" });
            }
        }
    );
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


app.listen(3001, () => {
    console.log("rodando")
})