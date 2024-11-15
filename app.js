const express = require('express');
const productRoutes = require('./routes/productRoutes');
const app = express();

app.use(express.json());
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;

const axios = require('axios');
const SUPABASE_URL = 'https://ntxojkqcpodoxtdspldy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50eG9qa3FjcG9kb3h0ZHNwbGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyNjA1MTQsImV4cCI6MjA0NjgzNjUxNH0.7G02T-DfoIF-sXN0zphtWMo4N6lVepmC6HSRXow3OJ4';

const getAllProducts = async (req, res) => {
  try {
    const response = await axios.get(`${SUPABASE_URL}/rest/v1/products`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    if (response.data.length > 0) {
      res.json(response.data[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const response = await axios.post(`${SUPABASE_URL}/rest/v1/products`, {
      name, price, description
    }, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const response = await axios.patch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
      name, price, description
    }, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await axios.delete(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};


const API_URL = 'http://<BACKEND_VM_IP>:3000/api/products';

document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const description = document.getElementById('description').value;

  const product = { name, price, description };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (response.ok) {
    alert('Produto cadastrado com sucesso!');
    loadProducts();
  } else {
    alert('Erro ao cadastrar produto');
  }
});

const loadProducts = async () => {
  const response = await fetch(API_URL);
  const products = await response.json();

  const productList = document.getElementById('productList');
  productList.innerHTML = '';
  products.forEach(product => {
    const li = document.createElement('li');
    li.textContent = `${product.name} - R$ ${product.price} - ${product.description}`;
    productList.appendChild(li);
  });
};

loadProducts();

