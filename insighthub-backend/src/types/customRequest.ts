import { UserData } from "./user_types";
import { Request } from 'express';


export interface CustomRequest extends Request {
    user: UserData;
}