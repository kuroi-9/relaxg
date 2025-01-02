import {Modal} from "./modal";
import OverlayTitleModal from "@/components/overlayTitleModal";

export default async function TitleModal(
    {params}: {params: Promise<{ id: string }>;
}) {
    const titleId = (await params).id;
    //TODO await fetch modal content from DB by id

    return (
        <Modal>
            <OverlayTitleModal id={titleId}/>
        </Modal>)
}