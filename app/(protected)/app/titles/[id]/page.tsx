import StandaloneTitleModal from "@/app/components/titles-manager/standaloneTitleModal";

export const dynamicParams = false;

export default async function TitlePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;

    return <StandaloneTitleModal id={id} />;
}
