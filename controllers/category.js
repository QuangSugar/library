const { Category } = require("../models");

const category = {
  createCategory: async (req, res) => {
    try {
      const {
        name
      } = req.body;

      if (
        !name
      )
        return res.status(400).json({ msg: "Please fill in all fields." });

     
      const category = await Category.findOne({ name });
      if (category)
        return res.status(400).json({ msg: "This category already exists." });


      const newCategory = new Category({
        name
      });

      await newCategory.save();

      res.json({ msg: "Category has been created!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getCategory: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);

      res.json(category);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllCategory: async (req, res) => {
    try {
      const categorys = await Category.find();

      res.status(200).json(categorys);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          name
        }
      );

      res.status(200).json({ msg: "Update Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);

      res.staus(200).json({ msg: "Deleted Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = category;
