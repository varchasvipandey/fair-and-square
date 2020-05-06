const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      minlength: 5,
      required: true
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error(`Invalid Email address`);
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      validate(value) {
        if (value.toLowerCase().includes("password"))
          throw new Error(`That's too lame buddy!`);
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    score: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

//generate token for a user
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  //generate token
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_USER_SECRET
  );
  //add this token to the user's tokens array
  user.tokens = user.tokens.concat({ token });
  await user.save(); //to save token to the user database
  //return generated token
  return token;
};

//login user by finding by credentials
//create a custom function findByCredentials to use when a user tries to login
userSchema.statics.findByCredentails = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to find a user with the entered email");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Incorrect password, try again");

  return user;
};

//hash password middleware pre save
userSchema.pre("save", async function(next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
