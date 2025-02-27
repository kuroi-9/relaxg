import StandaloneTitleModal from "@/components/titles-manager/standaloneTitleModal";

export const dynamicParams = false;

export default async function TitlePage(
    {params}: {params: Promise<{ id: string }>;
}) {
    const id = (await params).id;
    //TODO await fetch modal content from DB by id

    return <StandaloneTitleModal id={id}/>
}