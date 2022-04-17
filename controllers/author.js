const { Author } = require("../models");

const author = {
  createAuthor: async (req, res) => {
    try {
      const { name } = req.body;

      if (!name)
        return res.status(400).json({ msg: "Please fill in all fields." });

      const author = await Author.findOne({ name });
      if (author)
        return res.status(400).json({ msg: "This author already exists." });

      const newAuthor = new Author({
        name,
      });

      await newAuthor.save();

      res.json({ msg: "Author has been created!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAuthor: async (req, res) => {
    try {
      const author = await Author.findById(req.params.id);

      res.json(author);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllAuthor: async (req, res) => {
    try {
      const Authors = await Author.find();

      res.status(200).json(Authors);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateAuthor: async (req, res) => {
    try {
      const { name } = req.body;
      await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          name,
        }
      );

      res.status(200).json({ msg: "Update Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteAuthor: async (req, res) => {
    try {
      await Author.findByIdAndDelete(req.params.id);

      res.staus(200).json({ msg: "Deleted Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = author;
