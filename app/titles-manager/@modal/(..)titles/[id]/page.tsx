import { Modal } from "./modal";

export default async function TitleModal({
                                             params,
                                         }: {
    params: Promise<{ id: string }>;
}) {
    const titleId = (await params).id;
    return <Modal>{titleId}</Modal>;
}