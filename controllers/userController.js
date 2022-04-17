const { Users, UserBook, Book } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("./sendMail");
const moment = require("moment");

const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const fetch = require("node-fetch");

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

const { CLIENT_URL } = process.env;

const userCtrl = {
  register: async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        idStudent,
        classUser,
        birthday,
        gender,
        address,
      } = req.body;

      if (
        !name ||
        !email ||
        !password ||
        !idStudent ||
        !classUser ||
        !birthday ||
        !gender ||
        !address
      )
        return res.status(400).json({ msg: "Please fill in all fields." });

      if (!validateEmail(email))
        return res.status(400).json({ msg: "Invalid emails." });

      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "This email already exists." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters." });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new Users({
        name,
        email,
        idStudent,
        classUser,
        birthday,
        gender,
        address,
        password: passwordHash,
      });

      await newUser.save();

      res.json({ msg: "Account has been created!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: "This email does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Password is incorrect." });
      if(user.status === false){
        return res.status(400).json({ msg: "Your account was blocked" });
      }
      const refresh_token = createRefreshToken({ id: user._id });
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/v1/auth/refresh-token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ msg: "Login success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAccessToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: "Please login now!" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ msg: "Please login now!" });

        const access_token = createAccessToken({ id: user.id });
        res.json({ access_token });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: "This email does not exist." });

      const access_token = createAccessToken({ id: user._id });
      const url = `${CLIENT_URL}/user/reset/${access_token}`;

      sendMail(email, url, "Reset your password");
      res.json({ msg: "Re-send the password, please check your email." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      console.log(password);
      const passwordHash = await bcrypt.hash(password, 12);

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: passwordHash,
        }
      );

      res.json({ msg: "Password successfully changed!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserInfor: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");

      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUsersAllInfor: async (req, res) => {
    try {
      const users = await Users.find().select("-password");

      res.json(users);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/v1/auth/refresh-token" });
      return res.json({ msg: "Logged out." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { name, avatar, birthday, gender, address } = req.body;
      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          name,
          avatar,
          birthday,
          gender,
          address,
        }
      );

      res.json({ msg: "Update Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUsersRole: async (req, res) => {
    try {
      const { role } = req.body;

      await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          role,
        }
      );

      res.json({ msg: "Update Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await Users.findByIdAndDelete(req.params.id);

      res.json({ msg: "Deleted Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  googleLogin: async (req, res) => {
    try {
      const { tokenId } = req.body;

      const verify = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.MAILING_SERVICE_CLIENT_ID,
      });

      const { email_verified, email, name, picture } = verify.payload;

      const password = email + process.env.GOOGLE_SECRET;

      const passwordHash = await bcrypt.hash(password, 12);

      if (!email_verified)
        return res.status(400).json({ msg: "Email verification failed." });

      const user = await Users.findOne({ email });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ msg: "Password is incorrect." });

        const refresh_token = createRefreshToken({ id: user._id });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ msg: "Login success!" });
      } else {
        const newUser = new Users({
          name,
          email,
          password: passwordHash,
          avatar: picture,
        });

        await newUser.save();

        const refresh_token = createRefreshToken({ id: newUser._id });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ msg: "Login success!" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  facebookLogin: async (req, res) => {
    try {
      const { accessToken, userID } = req.body;

      const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;

      const data = await fetch(URL)
        .then((res) => res.json())
        .then((res) => {
          return res;
        });

      const { email, name, picture } = data;

      const password = email + process.env.FACEBOOK_SECRET;

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await Users.findOne({ email });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ msg: "Password is incorrect." });

        const refresh_token = createRefreshToken({ id: user._id });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ msg: "Login success!" });
      } else {
        const newUser = new Users({
          name,
          email,
          password: passwordHash,
          avatar: picture.data.url,
        });

        await newUser.save();

        const refresh_token = createRefreshToken({ id: newUser._id });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ msg: "Login success!" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  // ------------------borrow book
  borrowBook: async (req, res) => {
    try {
      const { book, startDate, endDate } = req.body;
      const user = req.user.id;
      if (!book || !startDate || !endDate)
        return res.status(400).json({ msg: "Please fill in all fields." });

      const isExist = await UserBook.findOne({ user, startDate });
      if (isExist)
        return res.status(400).json({ msg: "Bạn đã mượn sách vào hôm nay" });

      const newBorrow = new UserBook({
        user,
        book,
        startDate,
        endDate,
      });

      await newBorrow.save();

      res.json({ msg: "Bạn đã đăng ký thuê sách thành công!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  acceptBorrowBook: async (req, res) => {
    try {
      await UserBook.findOneAndUpdate(
        { _id: req.params.id },
        {
          status: "borrowing",
        }
      );
      let books = await UserBook.find({ _id: req.params.id }).select("book");
      books = books[0].book;
      for (let i = 0; i < books.length; i++) {
        await Book.findOneAndUpdate(
          { _id: books[i] },
          {
            status: false,
          }
        );
      }
      res.json({ msg: "Accept Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  cancelBorrowBook: async (req, res) => {
    try {
      await UserBook.findOneAndUpdate(
        { _id: req.params.id },
        {
          status: "cancel",
        }
      );

      res.json({ msg: "Cancel Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  giveBookBack: async (req, res) => {
    try {
      await UserBook.findOneAndUpdate(
        { _id: req.params.id },
        {
          status: "gived",
        }
      );
      let books = await UserBook.find({ _id: req.params.id }).select("book");
      books = books[0].book;
      for (let i = 0; i < books.length; i++) {
        await Book.findOneAndUpdate(
          { _id: books[i] },
          {
            status: true,
          }
        );
      }
      res.json({ msg: "Gived Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllOrder: async (req, res) => {
    try {
      const orders = await UserBook.find().populate("user").populate("book");

      res.json(orders);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getOrderByUser: async (req, res) => {
    try {
      const orders = await UserBook.find({
        user: req.params.id,
      })
        .populate("user")
        .populate("book");

      res.json(orders);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  checkDateBorrow: async (req, res) => {
    try {
      // await UserBook.findOneAndUpdate(
      //   { _id: req.params.id },
      //   {
      //     status: "borrowing",
      //   }
      // );
      const date = moment(new Date()).format("DD/MM/YYYY");

      let now = new Date(date).getTime();
      let books = await UserBook.find({ status: "borrowing" })
        .populate("user")
        .select("endDate user");

      console.log(books);
      let user = "";

      for (let i = 0; i < books.length; i++) {
        let endDate = new Date(books[i].endDate).getTime();
        if (endDate < now) {
          await Users.findOneAndUpdate(
            { _id: books[i].user._id },
            {
              status: false,
            }
          );
          if (user.length == 0) {
            user += books[i].user.name;
          } else {
            user += ", " + books[i].user.name;
          }
        }
      }

      if (user.length > 0) {
        return res.status(200).json({
          msg: `${user} was blocked`,
        });
      } else {
        res.json({ msg: "Checked Success!" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  toggleUser: async (req, res) => {
    try {
     let id = req.params.id;
     let statusCurrent = await Users.find({_id: id}).select("status")
     statusCurrent = statusCurrent[0].status
     console.log(statusCurrent)
     await Users.findByIdAndUpdate({_id: id},{status: !statusCurrent})
        if(statusCurrent){
          res.json({ msg: "Blocked user Success!" });
        }else{
          res.json({ msg: "Unblock user Success!" });
        }
      
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

// const createActivationToken = (payload) => {
//     return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
// }

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = userCtrl;
