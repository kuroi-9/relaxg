'use client'

import TitleCard from "./titleCard";
import {useState} from "react";
import TitleActionsModal from "@/components/titleActionsModal";
import Image from "next/image";

export default function TitleList({titles}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTitle, setCurrentTitle] = useState("no selected title");

    return (
        <>
            <ul className="flex flex-row flex-wrap justify-center">
                {Object.values(titles.map((title) => (
                    <div key={title.id} className="w-2/5 m-2">
                        <Image
                            src={null}
                            alt="nothing to show"
                            onClick={() => {
                                setIsModalOpen(true);
                                setCurrentTitle(title["title-name"]);
                            }}
                            className="border-2 m-2 w-full mb-0 border-b-0"/>
                        <TitleCard key={title.id} title={title}></TitleCard>
                    </div>
                )))}

            </ul>
            {isModalOpen && <TitleActionsModal
                titleName={currentTitle}
                setIsModalOpen={setIsModalOpen}/>}
        </>
    )
}