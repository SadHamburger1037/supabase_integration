import { createEffect, createResource, createSignal, For, Show } from "solid-js"
import { getCountries, supabase } from "../services/supabase"
import { useAuth } from "../components/AuthProvider";
import { A } from "@solidjs/router";

export default function Home(props){
    const session = useAuth();

    const [projects, setProjects] = createSignal(null)

    createEffect(async() => {
        await loadProjects()
    })

    async function loadProjects() {
        if(session()){
            const {data, error} = await supabase
            .from("projects")
            .select("*, tasks(count)")

            if(!error){
                setProjects(data)
            }
        }
    }

    async function deleteProject(projectId) {
        const {error} = await supabase
            .from("projects")
            .delete()
            .eq("id", projectId);
        if (error) {
            alert("Brisanje nije uspijelo")
        } else {
            await loadProjects();
        }
        
    }

    return(
        <>
            <Show when={!session()}>
                <div class="bg-red-600 text-white text-3xl p-10 rounded">Prijavi se</div>
            </Show>
            <Show when={session() && projects()}>
                <For each={projects()} fallback={<div>Nema projekta</div>}>
                    {(item) => <div class="bg-lime-500 text-white p-4 rounded m-5">
                        <div class="place-self-start mb-5 text-xl">{item.name}</div>
                        <div class="place-self-start mb-5 text-xl line-clamp-3">{item.description}</div>
                        <A href={`/tasks/${item.id}`} class="bg-white text-lime-500 p-4 rounded">Prikaži</A>
                        <Show when={item.tasks[0].count === 0}>
                            <button class="bg-white text-lime-500 p-4 rounded" onclick={() => deleteProject(item.id)}>Briši</button>
                        </Show>
                    </div>}
                </For>
            </Show>
        </>
    )
}