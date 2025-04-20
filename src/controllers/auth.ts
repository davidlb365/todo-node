import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const RegisterUserSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  username: z.string().nonempty({ message: "Username is required" }),
  email: z.string().nonempty({ message: "Email is required" }).email(),
  password: z.string().nonempty({ message: "Password is required" }),
});

const LoginUserSchema = RegisterUserSchema.pick({ password: true }).extend({
  usernameOrEmail: z
    .string()
    .nonempty({ message: "Username or email is required" }),
});

export const register = async (req: Request, res: Response) => {
  const validatedFields = RegisterUserSchema.safeParse(req.body);
  if (!validatedFields.success) {
    res.status(400).json({ message: validatedFields.error });
    return;
  }
  const { username, email, password } = validatedFields.data;
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        ...validatedFields.data,
        password: hashedPassword,
        roles: {
          connectOrCreate: {
            where: {
              name: "ROLE_USER",
            },
            create: {
              name: "ROLE_USER",
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const login = async (req: Request, res: Response) => {
  console.log("login");
  console.log(req.body);
  const validatedFields = LoginUserSchema.safeParse(req.body);
  if (!validatedFields.success) {
    res.status(400).json({ message: validatedFields.error });
    return;
  }
  const { usernameOrEmail, password } = validatedFields.data;
  try {
    // const existingUser = await prisma.user.findUnique({
    //     where: {
    //         username

    //     }
    // })
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
      include: {
        roles: true,
      },
    });
    console.log(existingUser);
    if (!existingUser) {
      res.status(401).json({ message: "Incorrect username or password" });
      return;
    }
    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      res.status(401).json({ message: "Incorrect username or password" });
      return;
    }
    const token = jwt.sign(
      {
        id: existingUser.id,
        username: existingUser.username,
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "7d" }
    );
    res.status(200).json({
      accessToken: token,
      role: existingUser.roles[0]?.name,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
