const { Book } = require("../models");

const book = {
  createBook: async (req, res) => {
    try {
      const {
        name,
        idBook,
        category,
        author,
        company,
        dateImport,
        publicYear,
        image,
        price,
      } = req.body;

      if (
        !name ||
        !idBook ||
        !category ||
        !author ||
        !company ||
        !dateImport ||
        !publicYear ||
        !price ||
        !image
      )
        return res.status(400).json({ msg: "Please fill in all fields." });

      const book = await Book.findOne({ idBook, name });
      if (book)
        return res.status(400).json({ msg: "This book already exists." });

      const newBook = new Book({
        name,
        idBook,
        category,
        author,
        company,
        dateImport,
        publicYear,
        price,
        image,
      });

      await newBook.save();

      res.json({ msg: "Book has been created!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getBook: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id)
        .populate("author")
        .populate("company")
        .populate("category");

      res.json(book);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllBook: async (req, res) => {
    try {
      const Books = await Book.find()
        .populate("author")
        .populate("company")
        .populate("category");;

      res.status(200).json(Books);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateBook: async (req, res) => {
    try {
      const {
        name,
        idBook,
        category,
        author,
        company,
        dateImport,
        publicYear,
        image,
        price,
      } = req.body;
      await Book.findOneAndUpdate(
        { _id: req.params.id },
        {
          name,
          idBook,
          category,
          author,
          company,
          dateImport,
          publicYear,
          image,
          price,
        }
      );

      res.status(200).json({ msg: "Update Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteBook: async (req, res) => {
    try {
      await Book.findByIdAndDelete(req.params.id);

      res.staus(200).json({ msg: "Deleted Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = book;
