import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextAuthOptions";

export const auth = (req?: any, res?: any) => getServerSession(req, res, authOptions as any);
