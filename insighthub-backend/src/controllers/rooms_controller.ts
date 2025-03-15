import mongoose from "mongoose";
import roomModel from "../models/room_model";


const getRoomIdByUserIds = async (req, res) => {
    const receiverUserId = req.params.receiverUserId;
    const initiatorUserId = req.query.userId;
    try {
        let roomIdDocument: any = await roomModel.aggregate(
            [
                {
                    $addFields: {
                        allElementsTrue: {
                            $and: [
                                { $in: [new mongoose.Schema.Types.ObjectId(receiverUserId), "$userIds"] },
                                { $in: [initiatorUserId, "$userIds"] },
                            ]
                        }	
                    }
                },
                {
                    $match: {
                        allElementsTrue: true
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                }
            ]
        );

        let roomId = roomIdDocument?._id;
        if (!roomIdDocument) {
            // Room not found, create one.
            const newRoom = await roomModel.create(
                { userIds: [new mongoose.Schema.Types.ObjectId(receiverUserId), initiatorUserId]});
            roomId = newRoom._id;
        }

        res.status(200).send(roomId);
    }catch(error){
        res.status(400).send("Bad Request");
    }
};


export default { getRoomIdByUserIds };
