import { messageInRaw } from "svix";
import Booking from "../models/Booking.js"

const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const booking = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate }
        });
        const isAvailable = userBookingsDummyData.length === 0;
        return isAvailable;
    } catch (error) {

        console.error(error.message);

    }
}
// api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({
            checkInDate, checkOutDate, room
        });
        res.json({ success: true, isAvailable })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
// api/bookings/book
export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;
        const isAvailable = await checkAvailability({
            checkInDate, checkOutDate, room
        });
        if (!isAvailable) {
            return res.json({ success: false, message: "Room is not available" })
        }

        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3000 * 24));

        totalPrice *= nights;
        const booking = await Booking.create({
            user, room, hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate, checkOutDate, totalPrice
        })
        res.json({ success: true, message: "Booking created successfully" })


    } catch (error) {
        console.error(error.message);
        res.json({ success: true, message: "Failed to create booking" })

    }
}

export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await Booking.findOne({ user }).populate("room, hotel").sort({
            createAt: -1
        })
        res.json({
            success: true, bookings
        })
    } catch (error) {
        res.json({ success: true, message: "Failed to create booking" })

    }
}

export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.auth.userId });
        if (!hotel) {
            return res.json({ success: false, message: " No Hotel found" });
        }
        const bookings = (await Booking.find({ hotel: hotel._id }).populate("room hotel user")).toSorted({ createAt: -1 });
        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0)
        res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } })
    } catch (error) {
        res.json({ success: false, message: "Failed to create booking" })

    }
}
