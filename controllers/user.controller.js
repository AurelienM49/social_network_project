const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

// select all users (en enlevant le password de la requête)
module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

// select un user par l'ID (en enlevant le password de la requête)
module.exports.userInfo = (req, res) => {
  console.log(req.params);
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknwown : " + err);
  }).select("-password");
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID invalid : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID invalid : " + req.params.id);

  try {
    await UserModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Succesfully deleted" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.follow = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  if (!ObjectID.isValid(req.body.idToFollow))
    return res.status(400).send("ID unknown : " + req.body.idToFollow);

  try {
    // add to the follower list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true }
      // (err, docs) => {
      //   if (!err) res.status(201).json(docs);
      //   else return res.status(400).jsos(err);
      // }
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }));
    // add to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true }
      // (err, docs) => {
      //   // if (!err) res.status(201).json(docs);
      //   if (err) return res.status(400).jsos(err);
      // }
    ).then((docs) => res.send(docs));
    // .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.unfollow = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  if (!ObjectID.isValid(req.body.idToUnfollow))
    return res.status(400).send("ID unknown : " + req.body.idToUnfollow);

  try {
    // add to the follower list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true }
      // (err, docs) => {
      //   if (!err) res.status(201).json(docs);
      //   else return res.status(400).jsos(err);
      // }
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }));
    // add to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true }
      // (err, docs) => {
      //   // if (!err) res.status(201).json(docs);
      //   if (err) return res.status(400).jsos(err);
      // }
    ).then((docs) => res.send(docs));
    // .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
