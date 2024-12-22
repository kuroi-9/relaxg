import TitleList from "@/components/titleList";

export default async function Page() {
    //API is being rewriten, fetching its old state from gcloud run
    //const data = await fetch('http://backend:8080/titles')
    const data = await fetch('http://192.168.1.29:8080/titles');
    const titles = await data.json();

    return <TitleList titles={titles} />;
}