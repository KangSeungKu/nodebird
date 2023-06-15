import { RequestHandler } from "express";
import { follow as followService } from "../services/user";

const follow: RequestHandler = async (req, res, next) => {
    try {
        const result = await followService(req.user!.id, req.params.id);
        if(result === 'ok') {
            res.send('success');
        } else {
            res.status(404).send(result);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export { follow };