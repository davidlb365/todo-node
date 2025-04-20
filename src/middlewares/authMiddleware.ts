import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { prisma } from "../lib/prisma";

interface Token {
    id: number,
    username: string
}

interface RequestWithUsername extends Request {
    username?: string
}

export const verifyToken = (req: RequestWithUsername, res: Response, next: NextFunction ) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        res.status(401).json({ error: "Unauthorized" })
        return
    }
    try {
        if(token) {
            const validToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as Token
            req.username = validToken.username
            // console.log(validToken)
            next()
        }
    } catch (error) {
        res.status(401).json({ error })
        return
    }
}

export const isAdmin = async (req: RequestWithUsername, res: Response, next: NextFunction) => {
    const username = req.username
    if(!username) {
        res.status(401).json({ error: "Unauthorized" })
        return
    }
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                username
            },
            include: {
                roles: true
            }
        })
        if(!existingUser) {
            res.status(401).json({ error: "Unauthorized" })
            return
        }
        if(existingUser.roles.some(role => role.name === "ROLE_ADMIN")) {
            next()
        } else {
            res.status(403).json({ error: "Forbidden" })
        }
    } catch (error) {
        
    }
}