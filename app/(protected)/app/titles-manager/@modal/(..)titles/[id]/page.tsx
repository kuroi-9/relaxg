import { Modal } from "./modal";
import OverlayTitleModal from "@/app/components/titles-manager/overlayTitleModal";

export default async function TitleModal({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const titleId = (await params).id;

    return (
        <Modal>
            <OverlayTitleModal
                id={titleId}
                hostIp={process.env.VPS_IP ?? process.env.DOCKER_GATEWAY_HOST!}
                dev={process.env.NEXT_ENV_MODE === "developpment"}
            />
        </Modal>
    );
}
