import "@/app/globals.css"
import "@/app/(protected)/app/titles-manager/titlesManager.css";

export default function TitlesManagerLayout(props: {
    children: React.ReactNode
    modal: React.ReactNode
}
)
{
    return (
        <section>
            {props.children}
            {props.modal}
            <div id="modal-root"/>
        </section>
    )
}