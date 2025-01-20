import { createSignal } from "solid-js";
import { useAuth } from "../components/AuthProvider"
import { supabase } from "../services/supabase";
import { useNavigate } from "@solidjs/router";

export default function SignIn(props) {
    const navigate = useNavigate()
    const [result, setResult] = createSignal(null)

    const session = useAuth()
    async function formSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target)
        const email = formData.get("email")
        const password = formData.get("password")
        
        const result = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        console.log(result)
        if(result.error){
            setResult("Dogodila se greska prilikom prijave")
        }else{
            setResult("Prijava je uspjela")
            navigate("/", {replace: true})
        }
    }

    return (
    <>
        <form onSubmit={formSubmit}>
            <label>Email adresa</label>
            <input type="email" name="email" required=""/><br />

            <label>Lozinka</label>
            <input type="password" name="password" required="" min="3"/><br />

            <input type="Submit" value="Pošalji" class="bg-slate-600 text-white p-2 rounded"/>
        </form>
        <div>
            Korisnik: {session() ? "prijavljen" : "nije prijavljen"}
        </div>
        
        <Show when={result()}>{result()}</Show>
    </>
    )
}