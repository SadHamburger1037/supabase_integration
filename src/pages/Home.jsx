import { createEffect, createResource, createSignal, For, Show } from "solid-js"
import { getCountries, supabase } from "../services/supabase"
import { useAuth } from "../components/AuthProvider";
import { A } from "@solidjs/router";

export default function Home(props){
    const session = useAuth();

    const [projects, setProjects] = createSignal(null)

    createEffect(async() => {
        if(session()){
            const {data, error} = await supabase
            .from("projects")
            .select()

            if(!error){
                setProjects(data)
            }
        }

    })

    return(
        <>
            <Show when={!session()}>
                <div class="bg-red-600 text-white text-3xl p-10 rounded">Prijavi se</div>
            </Show>
            <Show when={session() && projects()}>
                <For each={projects()} fallback={<div>Nema projekta</div>}>
                    {(item) => <div class="bg-lime-500 text-white p-4 rounded m-5">
                        <div class="place-self-start mb-5 text-xl">{item.name}</div>
                        <A href={`/tasks/${item.id}`} class="bg-white text-lime-500 p-4 rounded">Prikaži</A>    
                    </div>}
                </For>
            </Show>
        </>
    )
}