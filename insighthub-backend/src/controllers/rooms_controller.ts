import mongoose from "mongoose";
import roomModel from "../models/room_model";


const getRoomByUserIds = async (req, res) => {
    const receiverUserId = req.params.receiverUserId;
    const initiatorUserId = req.query.userId;
    try {
        let roomDocuments: any[] = await roomModel.aggregate(
            [
                {
                    $match: {
                        userIds: {
                            $in: [new mongoose.Types.ObjectId(receiverUserId), initiatorUserId]
                        }
                    }
                },
                {
                    $lookup: {
                      from: 'messages',
                      localField: '_id',
                      foreignField: 'roomId',
                      as: 'messages'
                    }
                }
            ]
        );

        // Handle that a user could send to himself
        let room = null;
        for (let i = 0; i < roomDocuments.length; i++) {
            const currentRoomDocument = roomDocuments[i];
            room = currentRoomDocument;
            if (room.userIds[0].toString() == room.userIds[1].toString()) {
                break;
            }
        }

        if (room) {
            return res.status(200).send(room);
        }

        // Room not found, create one.
        const newRoom = await roomModel.create(
            { userIds: [new mongoose.Types.ObjectId(receiverUserId), initiatorUserId]});
        room = {...newRoom, messages: []};
        return res.status(201).send(room);
    }catch(error){
        res.status(400).send("Bad Request");
    }
};

export default { getRoomByUserIds };
