import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { CreateRooms, getOnwerRooms, getRooms, toggleRoomAvailability } from "../controllers/roomController.js";


const roomRouter = express.Router();

roomRouter.post('/', upload.array("images", 4), protect, CreateRooms)
roomRouter.get('/', getRooms);
roomRouter.get('/owner', protect, getOnwerRooms)
roomRouter.post('/toggle-availability', protect, toggleRoomAvailability)



export default roomRouter;