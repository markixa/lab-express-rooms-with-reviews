const router = require("express").Router();
const Room = require("../models/Room.model");
const User = require("../models/User.model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.render("rooms/rooms-list", { rooms });
  } catch (error) {
    next(error);
  }
});

router.get("/create", isLoggedIn, (req, res, next) => {
  res.render("rooms/create-room");
});

router.post("/create", async (req, res, next) => {
  try {
    const { name, description, imageUrl, owner, reviews } = req.body;
    await Room.create({
      name,
      description,
      imageUrl,
      owner,
      reviews,
    });

    res.redirect("/rooms");
  } catch (error) {
    next(error);
  }
});

router.get("/:id/edit", async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    res.render("rooms/rooms-edit", room);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/edit", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, owner, reviews } = req.body;
    await Room.findByIdAndUpdate(
      id,
      {
        name,
        description,
        imgUrl,
        owner,
        reviews,
      },
      {
        new: true,
      }
    );

    res.redirect(`/rooms/${id}`);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/review", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { review } = req.body;
    await Room.findByIdAndUpdate(
      id, { reviews }
    );
    res.redirect(`/rooms/${id}`);
  } catch(err){
    next(err);
  }
});

module.exports = router;