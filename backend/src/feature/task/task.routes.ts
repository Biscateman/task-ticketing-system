import { Request, Response, Router } from "express";
import { TaskController } from "./task.controller";
import isAdmin from '../../middlewares/isAdmin'


const router = Router()

const taskController = new TaskController()

router.get('/all', (req: Request, res: Response) => {
    taskController.getAll(req, res)
})

router.post('/', isAdmin, (req: Request, res: Response) => {
    taskController.add(req, res)
})

router.get('/', (req: Request, res: Response) => {
    taskController.get(req, res)
})

router.get('/:id', (req: Request, res: Response) => {
    taskController.getUsersById(req, res)
})

router.post('/userstatus/:id', (req: Request, res: Response) => {
    taskController.setUserStatus(req, res)
})

// router.get('/assignments', (req: Request, res: Response) => {
//     taskController.getAllAssignments(req, res)
// })

router.put('/:id', (req: Request, res: Response) => {
    taskController.edit(req, res)
})

router.patch('/adminstatus/:id', isAdmin, (req: Request, res: Response) => {
    taskController.toggleAdminStatus(req, res)
})


// router.delete('/:id', (req: Request, res: Response) => {
//     taskController.delete(req, res)
// })

export default router