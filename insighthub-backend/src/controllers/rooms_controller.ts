import mongoose from "mongoose";
import roomModel from "../models/room_model";


const getRoomIdByUserIds = async (req, res) => {
    const receiverUserId = req.params.receiverUserId;
    const initiatorUserId = req.query.userId;
    try {
        let roomIdDocument: any[] = await roomModel.aggregate(
            [
                {
                    $match: {
                        userIds: {
                            $in: [new mongoose.Types.ObjectId(receiverUserId), initiatorUserId]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                {
                    $limit: 1
                }
            ]
        );

        let roomId = roomIdDocument?.length > 0 ? roomIdDocument[0]._id : null;
        if (roomId) {
            return res.status(200).send(roomId.toString());
        }

        // Room not found, create one.
        const newRoom = await roomModel.create(
            { userIds: [new mongoose.Types.ObjectId(receiverUserId), initiatorUserId]});
        roomId = newRoom._id;
        return res.status(201).send(roomId.toString());
    }catch(error){
        res.status(400).send("Bad Request");
    }
};


export default { getRoomIdByUserIds };
