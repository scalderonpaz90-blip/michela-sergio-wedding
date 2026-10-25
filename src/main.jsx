
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import "./styles.css";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

const copy = {
  es: {
    choose: "Elige tu idioma",
    date: "24 de abril de 2027 · Avigliana, Italia",
    intro: "Con mucha ilusión, queremos compartir nuestro día contigo.",
    names: "Michela & Sergio",
    invitation: "¡Nos casamos!",
    details: "Los detalles",
    ceremony: "La ceremonia",
    venue: "Santuario Madonna dei Laghi",
    address: "Avigliana, Italia",
    map: "Ver ubicación",
    transport: "Autobús",
    transportText: "Indícanos si necesitarás autobús de ida o de vuelta.",
    rsvp: "Confirma tu asistencia",
    deadline: "Nos encantará saber si podrás acompañarnos.",
    name: "Nombre y apellidos",
    email: "Correo electrónico (opcional)",
    attending: "¿Podrás venir?",
    yes: "¡Sí, allí estaré!",
    no: "Lo siento, no podré asistir",
    guests: "Número de personas incluyéndote",
    allergies: "¿Tienes alergias o necesidades alimentarias?",
    allergiesYes: "Sí",
    allergiesNo: "No",
    allergiesText: "Cuéntanos cuáles",
    busOut: "Necesito autobús de ida",
    busBack: "Necesito autobús de vuelta",
    message: "Mensaje para los novios (opcional)",
    consent: "Acepto que mis datos se utilicen para gestionar la asistencia a la boda.",
    send: "Enviar confirmación",
    success: "¡Gracias! Hemos recibido tu respuesta.",
    error: "No se ha podido guardar tu respuesta. Inténtalo de nuevo.",
    required: "Completa tu nombre y acepta el consentimiento.",
    footer: "Con cariño, Michela & Sergio",
  },
  it: {
    choose: "Scegli la lingua",
    date: "24 aprile 2027 · Avigliana, Italia",
    intro: "Con tanta gioia, desideriamo condividere questo giorno con te.",
    names: "Michela & Sergio",
    invitation: "Ci sposiamo!",
    details: "I dettagli",
    ceremony: "La cerimonia",
    venue: "Santuario Madonna dei Laghi",
    address: "Avigliana, Italia",
    map: "Vedi la posizione",
    transport: "Autobus",
    transportText: "Indicaci se avrai bisogno dell'autobus all'andata o al ritorno.",
    rsvp: "Conferma la tua presenza",
    deadline: "Saremo felici di sapere se potrai essere con noi.",
    name: "Nome e cognome",
    email: "Email (facoltativa)",
    attending: "Potrai venire?",
    yes: "Sì, ci sarò!",
    no: "Mi dispiace, non potrò esserci",
    guests: "Numero di persone, incluso te",
    allergies: "Hai allergie o esigenze alimentari?",
    allergiesYes: "Sì",
    allergiesNo: "No",
    allergiesText: "Indicaci quali",
    busOut: "Ho bisogno dell'autobus all'andata",
    busBack: "Ho bisogno dell'autobus al ritorno",
    message: "Un messaggio agli sposi (facoltativo)",
    consent: "Acconsento all'uso dei miei dati per gestire la partecipazione al matrimonio.",
    send: "Invia la conferma",
    success: "Grazie! Abbiamo ricevuto la tua risposta.",
    error: "Non è stato possibile salvare la risposta. Riprova.",
    required: "Inserisci il tuo nome e accetta il consenso.",
    footer: "Con affetto, Michela & Sergio",
  },
};

function App() {
  const [lang, setLang] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    attending: "yes",
    guest_count: "1",
    has_allergies: "no",
    allergies: "",
    bus_outbound: false,
    bus_return: false,
    message: "",
    consent: false,
  });

  const t = copy[lang || "es"];
  const update = (key, value) =>
    setForm((old) => ({ ...old, [key]: value }));

  async function submit(e) {
    e.preventDefault();
    setStatus("");

    if (!form.name.trim() || !form.consent) {
      setStatus(t.required);
      return;
    }

    if (!supabase) {
      setStatus(
        lang === "it"
          ? "La configurazione del modulo non è ancora completata."
          : "El formulario todavía no está conectado a la base de datos."
      );
      return;
    }

    const { error } = await supabase.from("wedding_rsvps").insert({
      name: form.name.trim(),
      email: form.email.trim() || null,
      attending: form.attending === "yes",
      guest_count: form.attending === "yes" ? Number(form.guest_count) : 1,
      has_allergies: form.has_allergies === "yes",
      allergies: form.has_allergies === "yes" ? form.allergies.trim() : null,
      bus_outbound: form.attending === "yes" && form.bus_outbound,
      bus_return: form.attending === "yes" && form.bus_return,
      message: form.message.trim() || null,
      consent: form.consent,
    });

    if (error) {
      setStatus(t.error);
      return;
    }

    setStatus(t.success);
    setForm({
      name: "",
      email: "",
      attending: "yes",
      guest_count: "1",
      has_allergies: "no",
      allergies: "",
      bus_outbound: false,
      bus_return: false,
      message: "",
      consent: false,
    });
  }

  if (!lang) {
    return (
      <main className="language-screen">
        <span className="eyebrow">24 · 04 · 2027</span>
        <div className="language-flower">✿</div>
        <h1>Michela <i>&</i> Sergio</h1>
        <p>Una giornata, una promessa, una vita insieme.</p>
        <p className="language-prompt">Elige tu idioma · Scegli la lingua</p>
        <div className="language-buttons">
          <button onClick={() => setLang("es")}>Español</button>
          <button onClick={() => setLang("it")}>Italiano</button>
        </div>
      </main>
    );
  }

  return (
    <main>
      <header className="hero">
        <nav>
          <span>M <i>&</i> S</span>
          <button className="language-switch" onClick={() => setLang(lang === "es" ? "it" : "es")}>
            {lang === "es" ? "Italiano" : "Español"}
          </button>
        </nav>
        <div className="hero-content">
          <span className="eyebrow">{t.date}</span>
          <h1>{t.names}</h1>
          <p className="hero-subtitle">{t.invitation}</p>
          <div className="ornament">✧ &nbsp; ✿ &nbsp; ✧</div>
          <p>{t.intro}</p>
          <a className="primary-link" href="#rsvp">{t.rsvp}</a>
        </div>
      </header>

      <section className="details section">
        <p className="eyebrow">{t.details}</p>
        <h2>{t.ceremony}</h2>
        <div className="small-flower">❦</div>
        <h3>{t.venue}</h3>
        <p>{t.address}</p>
        <p>24 · 04 · 2027</p>
        <a
          className="text-link"
          href="https://www.google.com/maps/search/?api=1&query=Santuario+Madonna+dei+Laghi+Avigliana"
          target="_blank"
          rel="noreferrer"
        >
          {t.map} ↗
        </a>
      </section>

      <section className="transport section">
        <p className="eyebrow">{t.transport}</p>
        <h2>{t.transport}</h2>
        <p>{t.transportText}</p>
      </section>

      <section className="rsvp section" id="rsvp">
        <p className="eyebrow">RSVP</p>
        <h2>{t.rsvp}</h2>
        <p>{t.deadline}</p>

        <form onSubmit={submit}>
          <label>{t.name} *
            <input required value={form.name} onChange={(e) => update("name", e.target.value)} />
          </label>

          <label>{t.email}
            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </label>

          <fieldset>
            <legend>{t.attending}</legend>
            <label className="choice">
              <input type="radio" name="attending" checked={form.attending === "yes"} onChange={() => update("attending", "yes")} />
              {t.yes}
            </label>
            <label className="choice">
              <input type="radio" name="attending" checked={form.attending === "no"} onChange={() => update("attending", "no")} />
              {t.no}
            </label>
          </fieldset>

          {form.attending === "yes" && (
            <>
              <label>{t.guests}
                <select value={form.guest_count} onChange={(e) => update("guest_count", e.target.value)}>
                  {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>

              <fieldset>
                <legend>{t.allergies}</legend>
                <label className="choice">
                  <input type="radio" name="allergies" checked={form.has_allergies === "yes"} onChange={() => update("has_allergies", "yes")} />
                  {t.allergiesYes}
                </label>
                <label className="choice">
                  <input type="radio" name="allergies" checked={form.has_allergies === "no"} onChange={() => update("has_allergies", "no")} />
                  {t.allergiesNo}
                </label>
              </fieldset>

              {form.has_allergies === "yes" && (
                <label>{t.allergiesText}
                  <textarea rows="3" value={form.allergies} onChange={(e) => update("allergies", e.target.value)} />
                </label>
              )}

              <label className="choice">
                <input type="checkbox" checked={form.bus_outbound} onChange={(e) => update("bus_outbound", e.target.checked)} />
                {t.busOut}
              </label>
              <label className="choice">
                <input type="checkbox" checked={form.bus_return} onChange={(e) => update("bus_return", e.target.checked)} />
                {t.busBack}
              </label>
            </>
          )}

          <label>{t.message}
            <textarea rows="3" value={form.message} onChange={(e) => update("message", e.target.value)} />
          </label>

          <label className="choice consent">
            <input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} />
            {t.consent} *
          </label>

          <button className="submit-button" type="submit">{t.send}</button>
          {status && <p className="form-status" role="status">{status}</p>}
        </form>
      </section>

      <footer>
        <div>❦</div>
        <p>{t.footer}</p>
        <span>24 · 04 · 2027</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
