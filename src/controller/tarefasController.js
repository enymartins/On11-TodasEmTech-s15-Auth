const tarefas = require("../models/tarefas")
const SECRET = process.env.SECRET;
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
// const bcrypt = require("bcrypt");

const getAll = (req, res) => {
    const authHeader = req.get('authorization');
    const token = authHeader.split(' ')[1];
  
    if(!token) {
      return res.status(401).json("Sem autorização para continuar");
    }

      jwt.verify(token, SECRET, function(erro) {
        if(erro) {
          return res.status(401).send('Erro na verificação. Não autorizado');
        } else {
          tarefas.find(function (err, tarefas){
            res.status(200).send(tarefas);
          })
        }
      });

     
  }

  const postTarefa = (req, res) => {
    let tarefa = new tarefas({
      _id: new mongoose.Types.ObjectId(),
      descricao: req.body.descricao, 
      dataInclusao: req.body.dataInclusao,
      nomeColaboradora: req.body.nomeColaboradora
  })
  
      tarefa.save(function(err){
      if (err) { 
        return res.status(500).send({ message: err.message })
      }
  
      res.status(201).send(tarefa.toJSON());
    })
  };


  module.exports = {
      getAll,
      postTarefa
  }