import React from 'react';
import RightMenu from "@/component/rightMenu/RightMenu";
import LeftMenu from "@/component/LeftMenu";
import { getTeamDivision } from "@/lib/action";
import Image from 'next/image';
import Link from "next/link";

const TeamPage = async () => {
    const teamDivision = await getTeamDivision();

    if (!teamDivision) {
        return (
            <div className='flex gap-6 pt-6'>
                <div className="hidden xl:block w-[20%]"><LeftMenu/></div>
                <div className="w-full lg:w-[70%] xl:w-[50%]">
                    <div className="p-4 bg-white shadow-md rounded-lg">
                        <p>No team division available.</p>
                    </div>
                </div>
                <div className="hidden lg:block w-[30%]"><RightMenu/></div>
            </div>
        );
    }

    const { teamA, teamB, substitutes } = teamDivision;

    const TeamDisplay = ({ team, title }: any) => (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">{title} ({team.length} players)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {team.map((player:any) => (
                    <div key={player.id} >
                        <Link className="flex flex-col items-center cursor-pointer" href={`/profile/${player.username}`}>
                            <Image
                            src={player.avatar || "/noAvatar.png"}
                            alt={player.name || player.username}
                            width={64}
                            height={64}
                            className="rounded-full"
                        />
                        <p className="mt-2 text-center">{player.name || player.username}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
    return (
        <div className='flex gap-6 pt-6'>
            <div className="hidden xl:block w-[20%]"><LeftMenu/></div>
            <div className="w-full lg:w-[70%] xl:w-[50%]">
                <div className="p-4 bg-white shadow-md rounded-lg">
                    <TeamDisplay team={teamA} title="Team A"/>
                    <TeamDisplay team={teamB} title="Team B"/>
                    {substitutes.length > 0 && (
                        <TeamDisplay team={substitutes} title="Substitutes"/>
                    )}
                </div>
            </div>
            <div className="hidden lg:block w-[30%]"><RightMenu/></div>
        </div>
    );
};

export default TeamPage;