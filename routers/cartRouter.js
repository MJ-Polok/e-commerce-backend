const router = require('express').Router();
const {
    createCartItem,
    getCartItem,
    updateCartItems,
    deleteCartItems
} = require('../controllers/cartControllers');
const authorize = require('../middlewares/authorize');

router.route('/')
    .get(authorize, getCartItem)
    .post(authorize, createCartItem)
    .put(authorize, updateCartItems);

router.route('/:id')
    .delete(authorize, deleteCartItems);

module.exports = router;