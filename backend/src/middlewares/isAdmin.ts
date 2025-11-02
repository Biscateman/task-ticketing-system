import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

const isAdmin = (req: Request, res: Response, next: NextFunction) => {


    if (req.role === 'ADMIN') {
        next()
    } else {
        res.status(401).json('Unauthorized: only admins are allowed')
    }

}

export default isAdmin