import mongoose from "mongoose";
import roomModel from "../models/room_model";
import { CustomRequest } from "types/customRequest";
import { Response } from "express";


export const getRoomByUserIds = async (req: CustomRequest, res: Response): Promise<void> => {
    const receiverUserId = req.params.receiverUserId as string;
    const initiatorUserId = req.user.id as string;
    try {
        let roomDocuments: any[] = await roomModel.aggregate(
            [
                {
                    $match: {
                        userIds: {
                            $in: [new mongoose.Types.ObjectId(receiverUserId)]
                        }
                    }
                },
                {
                    $match: {
                        userIds: {
                            $in: [new mongoose.Types.ObjectId(initiatorUserId)]
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
            room = roomDocuments[i];
            if (room.userIds[0].toString() == room.userIds[1].toString()) {
                break;
            }
        }
        if (room.userIds[0].toString() != room.userIds[1].toString() &&
            receiverUserId.toString() == initiatorUserId.toString()) {
            room = null;
        }

        if (room) {
            res.status(200).send(room);
            return;
        }

        // Room not found, create one.
        const newRoom = await roomModel.create({
            userIds: [
                new mongoose.Types.ObjectId(receiverUserId),
                new mongoose.Types.ObjectId(initiatorUserId)
            ]
        });

        room = newRoom.toObject();
        (room as any).messages = [];
        res.status(201).send(room);
        return;
    } catch(error){
        res.status(400).send("Bad Request");
    }
};
