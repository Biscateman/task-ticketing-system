import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'

const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwtToken

    if (!token) {
        return res.status(400).send('Unauthorized')
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || ' ') as JwtPayload
        req.userID = payload.userID
        req.role = payload.role
        next()
    } catch (err) {
        console.log(err)
        res.status(400).send('Unauthorized')
    }


}

export default auth