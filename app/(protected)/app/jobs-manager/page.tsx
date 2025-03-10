import SocketManager from "@/components/jobs-manager/socketManager";


export default async function JobsPage() {
    const jobs = await fetch(`https://api${(process.env.MODE === 'developpment') ? '-dev' : ''}.relaxg.app/jobs/`);

    console.log(`https://api${(process.env.MODE === 'developpment')}`)
    return (
        <>
            <SocketManager
                jobs={await jobs.json()}
                host={process.env.VPS_IP ?? process.env.DOCKER_GATEWAY_HOST!}
                dev={(process.env.MODE === 'developpment')}
            />
        </>
    )
}