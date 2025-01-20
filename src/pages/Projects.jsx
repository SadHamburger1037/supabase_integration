import { createSignal, Show } from "solid-js";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../services/supabase";

export default function Projects(props) {

    const session = useAuth();

    const [success, setSuccess] = createSignal(false);

    async function formSubmit(event) {
        setSuccess(false);
        event.preventDefault();
        const formData = new FormData(event.target)
        const name = formData.get("name")
        const description = formData.get("description")
        console.log(session())
        const author_id = session().user.id

        const { error } = await supabase
            .from("projects")
            .insert({
                name: name,
                ...(description !== "" ? { description: description } : {}),
                author_id: author_id
            })
        if (!error) {
            event.target.reset()
            setSuccess(true)
        } else {
            alert("Spremanje nije uspijelo :(")
        }

    }


    return (
        <>
            <Show when={success()}>
                <div class="bg-green-400 text-white p-2 rounded mt-7 mb-7">
                    Projekt uspješno spremljen!
                </div>
            </Show>
            <form onSubmit={formSubmit} class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Naziv projekta</label>
                    <input type="text" name="name" required="" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Opis projekta</label>
                    <textarea name="description" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>

                <div>
                    <input type="Submit" value="Pošalji" class="w-full bg-slate-600 text-white py-2 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </form>

        </>
    )
}