import { A, useParams } from "@solidjs/router"
import { createSignal, onMount, Show } from "solid-js";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../services/supabase";

export default function Tasks(props) {
    const params = useParams();
    const session = useAuth();

    const [project, setProject] = createSignal(null)
    const [isOwner, setIsOwner] = createSignal(false)
    const [tasks, setTasks] = createSignal([])
    const [descriptionVisible, setDescriptionVisible] = createSignal(false)

    function toggleDescription() {
        setDescriptionVisible(old => !old)
    }

    onMount(async () => {
        const { data, error } = await supabase
            .from('projects')
            .select()
            .eq('id', params.id)
        if (error) return;

        setProject(data[0])
        if (session().user.ID === project().autor_id) {
            setIsOwner(true)
        }

        loadTasks()
    })

    async function formSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target)
        const name = formData.get("name")

        const { error } = await supabase
            .from("tasks")
            .insert({
                name: name,
                done: false,
                project_id: project().id
            })
        if (!error) {
            event.target.reset()
            loadTasks()
        } else {
            alert("Spremanje nije uspijelo :(")
        }
    }

    async function loadTasks() {
        const { data, error } = await supabase
            .from('tasks')
            .select()
            .eq('project_id', project().id)
        if (error) return;
        setTasks(data)
    }

    async function takeOWnership(taskID) {
        const { error } = await supabase
            .from('tasks')
            .update({ owner_id: session().user.id })
            .eq('id', taskID)
        if (error) {
            alert("Preuzimanje nije uspijelo!")
        } else {
            loadTasks()
        }
    }

    async function finishTask(taskID) {
        const { error } = await supabase
            .from('tasks')
            .update({ done: true })
            .eq('id', taskID)
        if (error) {
            alert("Operacija nije uspijela!")
        } else {
            await loadTasks()
        }
    }

    async function deleteTask(taskId) {
        const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", taskId);
        if (error) {
            alert("Brisanje nije uspijelo")
        } else {
            await loadTasks();
        }

    }

    return (
        <>
            <Show when={project()}>
                <div class="text-xl font-semibold">{project().name}</div>
                <Show when={isOwner()}><div>Vi ste vlasnik projekta.</div>
                    <form onSubmit={formSubmit} class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Naziv projekta</label>
                            <input type="text" name="name" required="" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <input type="Submit" value="Pošalji" class="w-full bg-slate-600 text-white py-2 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </form>
                </Show>
                <div>
                    <button class="bg-white text-lime-500 p-4 rounded" onclick={() => toggleDescription()}>Prikaži/Sakrij opis</button>
                </div>
                <Show when={descriptionVisible()}>
                    <div class="mb-4">{project().description}</div>
                </Show>
                <For each={tasks()} fallback={<div>Nema zadataka</div>}>
                    {(item) => <div class="bg-lime-500 text-white p-4 rounded m-5 flex flex-col gap-2 items-end">
                        <div class="place-self-start mb-5 text-xl">{item.name}</div>
                        <Show when={item.owner_id}>

                        </Show>
                        <Show when={!item.owner_id}>
                            <button onclick={() => takeOWnership(item.id)} class="bg-white text-lime-500 p-4 rounded text-xl">Preuzmi</button>
                        </Show>
                        <Show when={item.owner_id === session().user.id}>
                            <div>Vi ste preuzeli zadatak.</div>
                        </Show>
                        <Show when={isOwner() && item.done !== true}>
                            <button onclick={() => deleteTask(item.id)} class="bg-white text-lime-500 p-4 rounded text-xl">Briši</button>
                        </Show>
                        <Show when={item.done === false && item.owner_id === session().user.id}>
                            <button onclick={() => finishTask(item.id)} class="bg-white text-lime-500 p-4 rounded text-xl">Završeno</button>
                        </Show>
                        <Show when={item.done}>
                            <div>Zadatak je završen.</div>
                        </Show>
                    </div>}
                </For>
            </Show>
            <Show when={!project()}>
                <div>Projekt ne postoji!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</div>
            </Show>
        </>
    );
}