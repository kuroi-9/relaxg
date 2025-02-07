import {Modal} from "./modal";
import OverlayTitleModal from "@/components/overlayTitleModal";

export default async function TitleModal(
    {params}: {params: Promise<{ id: string }>;
}) {
    const titleId = (await params).id;
    //TODO await fetch modal content from DB by id

    return (
        <Modal>
            <OverlayTitleModal id={titleId} hostIp={process.env.VPS_IP ?? process.env.DOCKER_GATEWAY_HOST!}/>
        </Modal>)
}