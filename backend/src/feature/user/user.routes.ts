import { NextFunction, Router, Request, Response } from "express"
import { UserController } from "./user.controller"

const router = Router()

const userController = new UserController()

router.post('/signup', (req: Request, res: Response, next: NextFunction) => {
    userController.signup(req, res, next)
})

router.post('/signin', (req: Request, res: Response, next: NextFunction) => {
    userController.signin(req, res, next)
})

// router.get('/', (req: Request, res: Response) => {})

export default router