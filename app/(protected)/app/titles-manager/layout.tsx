import "@/app/globals.css"

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