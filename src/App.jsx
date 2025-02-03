import { Route, Router } from "@solidjs/router";

import Home from "./pages/Home";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignOut";
import { A } from "@solidjs/router";
import { Show } from "solid-js";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";

export default function App() {
  return (
    <AuthProvider>
      <Router root={Layout}>
        <Route path="/" component={Home} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signout" component={SignOut} />
        <Route path="/projects" component={Projects} />
        <Route path="/tasks/:id" component={Tasks}/>  
      </Router>
    </AuthProvider>
  );
}

function Layout(props) {
  const session = useAuth()
  const appName = import.meta.env.VITE_APP_NAME;

  return (
    <div class="p-4 flex-col gap-4 text-center">
      <div>
        <div class="text-4xl text-neutral-500 uppercase">
          {appName}
        </div>
        <div class="flex gap-2 snap-center">
          <A href="/" class="bg-orange-600 p-2 rounded-lg hover:bg-orange-400">Projekti</A>  
          <Show when={session()}>
            <A href="/projects" class="bg-orange-600 p-2 rounded-lg hover:bg-orange-400">Novi projekt</A>
          </Show>
          <Show when={!session()}>
            <A href="/signin" class="bg-orange-600 p-2 rounded-lg hover:bg-orange-400">Prijava</A>
          </Show>
          <Show when={session()}>
            <A href="/signout" class="bg-orange-600 p-2 rounded-lg hover:bg-orange-400">Odjava</A>
          </Show>
        </div>
      </div>

      <div class="min-h-[75vh] w-10/12 mx-auto">
        {props.children}
      </div>

      <div class="text-center text-xs text-neutral-500">
        Sva prava pridržana {new Date().getFullYear()}. Sale i gaseri
      </div>

    </div>
  )
}