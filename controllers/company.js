const { Company } = require("../models");

const company = {
  createCompany: async (req, res) => {
    try {
      const { name } = req.body;

      if (!name)
        return res.status(400).json({ msg: "Please fill in all fields." });

      const company = await Company.findOne({ name });
      if (company)
        return res.status(400).json({ msg: "This company already exists." });

      const newCompany = new Company({
        name,
      });

      await newCompany.save();

      res.json({ msg: "Company has been created!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getCompany: async (req, res) => {
    try {
      const company = await Company.findById(req.params.id);

      res.json(company);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllCompany: async (req, res) => {
    try {
      const Companys = await Company.find();

      res.status(200).json(Companys);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCompany: async (req, res) => {
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
  deleteCompany: async (req, res) => {
    try {
      await Company.findByIdAndDelete(req.params.id);

      res.staus(200).json({ msg: "Deleted Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = company;
