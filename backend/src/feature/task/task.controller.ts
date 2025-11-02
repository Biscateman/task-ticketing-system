import { Request, Response } from "express";
import prisma from "../../lib/prismaClient";
import { Prisma, Status } from "@prisma/client";
import { AdminStatus } from "../../../generated/prisma";

type CreateTaskBody = {
    title: string
    description: string
    deadline: string
    assignedTo: string[]
}




export class TaskController {
    async getAll(req: Request, res: Response) {
        try {

            const tasks = await prisma.task.findMany()
            if (tasks.length === 0) {
                return res.status(404).json('No tasks found');
            }
            return res.status(200).json(tasks);
        } catch (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({
                success: false,
                message: 'Server error while fetching users.',
            });
        }

    }

    async add(req: Request, res: Response) {

        const { title, description, deadline, assignedTo } = req.body

        try {
            const task = await prisma.task.create({
                data: {
                    title: title,
                    description: description,
                    deadline: new Date(deadline),
                    assignments: {
                        create: assignedTo.map((id: string) => ({
                            user: { connect: { id } },
                            status: "INPROGRESS",
                        })),
                    },
                }
            })

            res.status(201).json(task)
        } catch (err) {
            console.log(err)
            res.status(500).json('Something went wrong')
        }
    }

    async get(req: Request, res: Response) {
        const userID = req.userID
        const tasks = await prisma.user.findUnique({
            where: {
                id: userID
            },
            select: {
                assignments: { select: { task: true } },
            }
        })
        res.status(200).json(tasks)
    }

    async getAllAssignments(taskId: string) {
        const assignments = await prisma.assignment.findMany({
            where: { taskId }
        })
        return assignments
    }

    async setUserStatus(req: Request, res: Response) {
        const userId = req.userID
        const taskId = req.params.id

        const assignment = await prisma.assignment.findUnique({
            where: { userId_taskId: { userId, taskId } },
        })

        if (!assignment) throw new Error("Assignment not found")

        let newStatus: Status
        switch (assignment.status) {

            case "INPROGRESS":
                newStatus = "COMPLETED"
                break
            default:
                newStatus = "INPROGRESS"
        }

        const updated = await prisma.assignment.update({
            where: { userId_taskId: { userId, taskId } },
            data: { status: newStatus },
        })

        const assignments = await this.getAllAssignments(taskId)

        const completed = assignments.every(asn => asn.status === 'COMPLETED')

        if (completed) {
            await prisma.task.update({
                data: {
                    userStatus: 'COMPLETED'
                },
                where: {
                    id: taskId
                }
            })
        }

        res.json(updated)

    }

    async edit(req: Request, res: Response) {
        const { title, description, deadline, assignedTo } = req.body

        const taskId = req.params.id

        console.log(assignedTo)

        // await prisma.assignment.deleteMany({
        //     where: {
        //         taskId
        //     }
        // })

        try {
            const task = await prisma.task.update({
                data: {
                    title,
                    description,
                    deadline: new Date(deadline),
                    assignments: {
                        create: assignedTo.map((id: string) => ({
                            user: { connect: { id } },
                            status: "INPROGRESS",
                        }))
                    }
                },
                where: {
                    id: taskId
                }
            })

            res.status(201).json(task)
        } catch (err) {
            console.log(err)
            res.status(500).json('Something went wrong')
        }

    }

    async getUsersById(req: Request, res: Response) {
        const id = req.params.id
        const users = await prisma.task.findUnique({
            where: { id },
            select: {
                assignments: {
                    select: {
                        user: {
                            select: { email: true }
                        },
                        status: true
                    }
                }
            }
        })
        const userEmails = users?.assignments.map(a => a.user.email)
        res.status(200).json(userEmails)
    }

    async toggleAdminStatus(req: Request, res: Response) {

        const id = req.params.id

        const task = await prisma.task.findUnique({
            where: { id }
        })

        const currentStatus = task?.adminStatus

        if (!currentStatus) {
            return res.status(404).json('Task not found')
        }

        let newStatus: AdminStatus
        switch (currentStatus) {
            case "OPEN":
                newStatus = "CLOSED"
                break
            case "CLOSED":
                newStatus = "OPEN"
                break
            default:
                newStatus = "OPEN"
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { adminStatus: newStatus }
        })

        res.status(200).json(updatedTask)

    }
}