const Product = require('../models/Product')

const multer = require('multer')
const Firm = require('../models/Firm')

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  

  const upload = multer({storage: storage})

  const addProduct = async(req, res)=>{
    try {
        const {productName, price, category, bestSeller, description,} = req.body
        const image = res.file?req.file.filename:undefined;

        const firmId = req.params.firmId
        const firm = await Firm.findById(firmId)

        if(!firm){
            return res.status(404).json({error: "No firm found"})
        }

        const product = new Product({
            productName, price, category, bestSeller, description, image, firm: firm._id

        }) 
        const savedProduct = await product.save()
        firm.products.push(savedProduct)
        await firm.save()
        res.status(200).json(savedProduct)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Internal server error"})
    }
  }

  const getProductByFirm = async(req, res)=>{
    try {
      const firmId = req.params.firmId;
      const firm = await Firm.findById(firmId);
      if(!firm){
        return res.status(404).json({error: "No firm found"})
      }
      const restaurantName = firm.firmName;
      const products = await Product.find({firm: firmId})
      res.status(200).json({restaurantName,products})
    } catch (error) {
      console.error(error)
        return res.status(500).json({message:"Internal server error"})
    }
  }

  const deleteProductById = async(req, res)=>{
    try {
      const productId = req.params.productId;
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if(!deletedProduct){
        return res.status(404).json({error: "No product found"})
      }
    } catch (error) {
      console.error(error)
        return res.status(500).json({message:"Internal server error"})
      }
  }
  module.exports = {addProduct:[upload.single('image'), addProduct], getProductByFirm, deleteProductById}