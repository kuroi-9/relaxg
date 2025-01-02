export const dynamicParams = false;

export default async function TitlePage(params: {
    params: Promise<{ id: string }>;
}) {
    const id = (await (params).params).id;
    console.log(id);
    return <div className="title-card">{id}</div>;
}