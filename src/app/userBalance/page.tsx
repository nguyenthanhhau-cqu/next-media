import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import ExportPDFButton from "@/component/userBalance/ExportPDFButton";
import UserBalanceList from "@/component/userBalance/UserBalanceList";

async function getUserBalances() {
    const users:any = await prisma.user.findMany({
        orderBy: {
            balance: 'asc'
        },
        select: {
            id: true,
            username: true,
            name: true,
            surname: true,
            avatar: true,
            balance: true,
        }
    });
    return users;
}

export default async function UserBalancePage() {
    const { userId } = auth();
    const users = await getUserBalances();
    const isAdmin = userId === 'user_2kyEFBJyLszkG66jjaEO3ryToc7';

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Balances</h1>
            <ExportPDFButton users={users} />
            <UserBalanceList initialUsers={users} isAdmin={isAdmin} />
        </div>
    );
}