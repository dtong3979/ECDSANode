const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  // private: ce1a89b7e449191811df10208246fd5aff244bc6f59fbc0ddb8cdd50be5bf42a
  '037482484fae016f445093d89acd5fcb56bab2cd373b10b6f6a4de12bc8fc7e455': 100,
  // private: 4b8964a8ba0cba35890fcc11e2ab317815e73fa1e97f5be49e8f0c0b5ebb65fb
  '03749fd04cbe0dc3a4795ddb0401b02402d0e5325f864f5f0c5d76ebfcc63f8410': 50,
  // private: a49b40a0c8d07151c5e675a84b576665814b1b740875ff3355967f3b32c3046c
  '02d11fd7326fe5c1ee4baa0cf283f444d242c17cbf2eb14dc03750c41a60de9619': 75,
};

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: 'Not enough funds!' });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
