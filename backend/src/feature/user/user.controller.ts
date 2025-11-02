import { NextFunction, Request, Response } from "express";
import prisma from '../../lib/prismaClient'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class UserController {
    async signup(req: Request, res: Response, next: NextFunction) {
        console.log('Hit')
        const { email, password, name, role } = req.body
        try {
            const hashedPassword = await bcrypt.hash(password, 12)
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    role,
                    password: hashedPassword
                }
            })

            if (user) {
                res.status(201).json(user)
            } else {
                res.status(400).json('User Registration Failed')
            }

        } catch (err) {
            console.log(err)
            res.status(500).json('Something went wrong')
        }
    }

    async signin(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body
        try {
            const user = await prisma.user.findFirst({
                where: {
                    email
                }
            })

            if (!user) {
                res.json("Invalid Credentials")
            } else {
                const result = await bcrypt.compare(password, user.password)

                if (result) {

                    const token = jwt.sign({
                        userID: user.id,
                        role: user.role
                    }, process.env.JWT_SECRET || '', { expiresIn: '1h' })

                    res.cookie('jwtToken', token, { maxAge: 60 * 60 * 1000 })
                    res.status(200).json('User Signed In Successfully')
                }
                else {
                    res.status(400).json('Invalid Credentials')
                }
            }

        } catch (err) {
            console.log(err)
        }

    }
}

