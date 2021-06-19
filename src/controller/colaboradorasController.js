const colaboradoras = require("../models/colaboradoras")
const SECRET = process.env.SECRET;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



// const authorizated = (req, res) => {
//   const { email, password } = req.body;

//   if(email != undefined) {

//     const findUser = colaboradoras.findOne({email: req.body.email})

//     if(findUser != undefined) {
       
//       if(findUser.password == colaboradoras.password) {
//         res.status(200). send({ message: "tudo certo!"})
//       } else {
//         res.status(400).send({ message: "credenciais inválidas"})
//       }
//     }else {
//       res.status(400).send({ message: "O email enviado não existe na base de dados"})
//     }

//   } else {
//     res.status(400).send({ message: "o email enviado é inválido"})
//   }
// }

const getAll = (req, res) => {
  const authHeader = req.get('authorization');
  const token = authHeader.split(' ')[1];
  console.log('Meu header:', token);

  if(!authHeader) {
    return res.status(401).json("Sem autorização para continuar");
  }
  
    jwt.verify(token, SECRET, function(erro) {
      if(erro) {
        return res.status(401).send('Erro na verificação. Não autorizado');
      }
    }) 
    colaboradoras.find(function (err, colaboradoras){
      res.status(200).send(colaboradoras)
   
    }) 
};


const postColaboradora = (req, res) => {

  const senhacomHash = bcrypt.hashSync(req.body.password, 10);
  req.body.password = senhacomHash;
  let colaboradora = new colaboradoras(req.body);

    colaboradora.save(function(err){
    if (err) res.status(500).send({ message: err.message })

    res.status(201).send(colaboradora.toJSON());
  })
};

const login = (req, res) => {
  colaboradoras.findOne({ email: req.body.email}, function(error, colaboradora) {
    if(!colaboradora) {
      return res.status(404).send(`Não existe colaboradora com o email ${req.body.email}`)
    }
    const senhaValida = bcrypt.compareSync(req.body.password, colaboradora.password);
    
    if(!senhaValida) {
      return res.status(403).send('Senha inválida!')
    }

    const token = jwt.sign({ email: req.body.email }, SECRET);
    return res.status(200).send(token)
  })
}





module.exports = {
    getAll,
    postColaboradora,
    // authorizated
    login
}
