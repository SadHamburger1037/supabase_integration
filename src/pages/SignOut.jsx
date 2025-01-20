import { createSignal, onMount } from "solid-js";
import { supabase } from "../services/supabase";

export default function SignOut(){
    const [result, setResult] = createSignal(null)
    onMount(async () => {
        const result = await supabase.auth.signOut();
        if (result.error){
            setResult("Odjava nije uspijela")
        }else{
            setResult("Odjava uspjesna")
        }
    })

    return(
        <>
            <Show when={result()}>{result()}</Show>
        </>
    )
}