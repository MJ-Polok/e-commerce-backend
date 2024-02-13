const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const { Product, validate } = require('../models/product');

module.exports.createProduct = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send("Something went wrong!");
        const { error } = validate(_.pick(fields, ["name", "description", "price", "category", "quantity"]));
        if (error) return res.status(400).send(error.details[0].message);

        const product = new Product(fields);

        if (files.photo) {
            fs.readFile(files.photo.path, (err, data) => {
                if (err) return res.status(400).send("Problem in file data!");
                product.photo.data = data;
                product.photo.contentType = files.photo.type;
                product.save()
                    .then((result) => {
                        return res.status(201).send({
                            message: "Product Created Successfully!",
                            data: _.pick(result, ["name", "description", "price", "category", "quantity"])
                        })
                    })
                    .catch((err) => {
                        return res.status(500).send(err);
                    })
            })
        } else {
            return res.status(400).send("No image provided!");
        }
    })
}

// Query String
// api/product?order=desc&sortBy=name&limit=10
module.exports.getProducts = async (req, res) => {
    console.log(req.query);
    let order = req.query.order === 'desc' ? -1 : 1;
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const products = await Product.find()
        .select({ photo: 0 })
        .sort({ [sortBy]: order })
        .limit(limit)
        .populate('category', 'name');
    return res.status(200).send(products);
}

module.exports.getProductById = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId)
        .populate('category', 'name')
        .select({ photo: 0 })

    if (!product) {
        return res.status(404).send("Not Found!")
    }
    return res.status(200).send(product)
}

module.exports.getPhoto = async (req, res) => {
    const productId = req.params.id;

    const product = await Product.findById(productId)
        .select({ photo: 1, _id: 0 });

    res.set('Content-Type', product.photo.contentType);
    return res.status(200).send(product.photo.data);
}


module.exports.updateProductById = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId)
    let form = new formidable.IncomingForm();
    formKeepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).send("Something Wrong!");
        };
        const updatedFields = _.pick(fields, ["name", "description", "price", "category", "quantity"]);
        _.assignIn(product, updatedFields);

        if (files.photo) {
            fs.readFile(files.photo.path, (err, data) => {
                if (err) {
                    return res.status(400).send("Something Wrong!");
                }
                product.photo.data = data;
                product.photo.contentType = files.photo.type;
                product.save()
                    .then((result) => {
                        return res.status(200).send({
                            message: "Product Updated"
                        })
                    })
                    .catch(e => {
                        return res.status(500).send("Something failed!")
                    })
            })
        }
        else {
            product.save()
                .then((result) => {
                    return res.status(200).send({
                        message: "Product Updated"
                    })
                })
                .catch(e => {
                    return res.status(500).send("Something failed!")
                })
        }
    })
}


module.exports.filterProducts = async (req, res) => {
    console.log(req.query);
    let order = req.body.order === 'desc' ? -1 : 1;
    let sortBy = req.body.sortBy ? req.query.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.query.limit) : 10;
    let skip = parseInt(req.body.skip);
    let filters = req.body.filters;
    let args = {}

    for (let key in filters) {
        if (filters[key].length > 0) {
            if (key === 'price') {
                args['price'] = {
                    $gte: filters['price'][0],
                    $lte: filters['price'][1]
                }
                console.log(args);
            }
            if (key === 'category') {
                args['category'] = {
                    $in: filters['category']
                }
            }
        }
    }

    const product = await Product.find(args)
        .select({ photo: 0 })
        .populate('category', 'name')
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)
    return res.status(200).send(product)
}