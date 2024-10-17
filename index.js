const express = require('express')
const bodyParser = require('body-parser');
var mysql = require('mysql');
const port = 5000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE",
  );
  next();
});
app.use(express.json());


var con = mysql.createConnection({
  host: "korawit.ddns.net",
  user: "webapp",
  password: "secret2024",
  port: "3307",
  database: "shop"
});
con.connect(function(err){
  if(err) throw err;
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/products',(req,res)=>{
  con.query("SELECT * FROM products",function(err,result,fields){
    if(err) throw res.status(400).send('Not found any products');
    console.log(result);
    res.send(result);
  });
});

app.get('/api/products/:id',(req,res)=>{
  const id = req.params.id;
  con.query("SELECT * FROM products where id="+id,function(err,result,fields){
    if(err) throw err;
    let product=result;
    if(product.length>0){
      res.send(product);
    }
    else{
      res.status(400).send('Not found product for'+id);
    }
    console.log(result);
  })
})

app.post('/api/addproduct',function(req,res){
  const name=req.body.name;
  const price=req.body.price;
  const img=req.body.img;
  console.log(name,price,img);
  var sql = "INSERT INTO products (name,price,img) VALUES('${name}','${price}','${img})";
  con.query(sql,function(err,result,fields){
    if(err) throw err;
    let product=result;
    if(product.length>0){
      res.send(product);
    }
    else{
      res.status(400).send('Not found product for'+id);
    }
    console.log(result);
  })
})

app.delete('/api/delproduct/:id',function(req,res){
  const id =req.params.id;
  con.query("DELETE FROM products where id="+id,function(err,result,fields){
    if(err) throw err;
    con.query("SELECT * FROM products",function (err,result,fields){
      if(err) throw err;
      res.send(result);
      console.log(result);
    });
  });
});

app.put('/api/delproduct/:id',function(req,res){
  const id =req.params.id;
  const name=req.body.name;
  const price=req.body.price;
  const img=req.body.img;
  con.query("UPDATE FROM products SET name='${name}',price='${price}',img='${img}' WHERE id =${id}",function(err,result,fields){
    if(err) throw err;
    con.query("SELECT * FROM products",function (err,result,fields){
      if(err) throw err;
      res.send(result);
      console.log(result);
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
