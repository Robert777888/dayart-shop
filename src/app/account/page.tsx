"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

interface CustomerProfile {
  email: string;
  fullName: string;
  phone: string;
}

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<CustomerProfile>({
    email: "",
    fullName: "",
    phone: "",
  });

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token ?? null;
      if (!mounted) return;
      setSessionToken(token);
      if (token) {
        await loadProfile(token);
      }
    };

    boot();

    const { data: listener } = supabaseBrowser.auth.onAuthStateChange(async (_event, session) => {
      const token = session?.access_token ?? null;
      setSessionToken(token);
      if (token) {
        await loadProfile(token);
      } else {
        setProfile({ email: "", fullName: "", phone: "" });
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (token: string) => {
    const response = await fetch("/api/customer/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.success) {
      setProfile({
        email: data.profile.email ?? "",
        fullName: data.profile.fullName ?? "",
        phone: data.profile.phone ?? "",
      });
    }
  };

  const handleAuth = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "register") {
        const { error: signUpError } = await supabaseBrowser.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        setMessage("Sikeres regisztracio. Ha kell, erositsd meg az emailed.");
      } else {
        const { data, error: signInError } = await supabaseBrowser.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        if (data.session?.access_token) {
          setSessionToken(data.session.access_token);
          await loadProfile(data.session.access_token);
        }
        setMessage("Sikeres bejelentkezes.");
      }
    } catch (authError) {
      const msg = authError instanceof Error ? authError.message : "Hiba tortent az autentikacio kozben.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!sessionToken) return;

    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/customer/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(profile),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Profil mentese sikertelen.");
      }
      setMessage("Profil adatok elmentve.");
    } catch (saveError) {
      const msg = saveError instanceof Error ? saveError.message : "Hiba tortent mentes kozben.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabaseBrowser.auth.signOut();
    setSessionToken(null);
    setProfile({ email: "", fullName: "", phone: "" });
    setMessage("Kijelentkeztel.");
  };

  return (
    <main className="info-page">
      <div className="info-hero">
        <h1>Ugyfel fiok</h1>
        <p>Regisztracio, bejelentkezes, nev + telefonszam kezeles egy helyen.</p>
      </div>

      <div className="info-container">
        {!sessionToken ? (
          <section className="info-section">
            <h2>{mode === "login" ? "Bejelentkezes" : "Regisztracio"}</h2>
            <div className="mode-toggle" style={{ marginBottom: 16 }}>
              <button className={`mode-btn ${mode === "login" ? "active" : ""}`} type="button" onClick={() => setMode("login")}>Bejelentkezes</button>
              <button className={`mode-btn ${mode === "register" ? "active" : ""}`} type="button" onClick={() => setMode("register")}>Regisztracio</button>
            </div>

            <div className="form-grid">
              <div className="form-field full">
                <label>Email</label>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div className="form-field full">
                <label>Jelszo</label>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>
            </div>

            <button className="checkout-next-btn" type="button" onClick={handleAuth} disabled={loading || !email || password.length < 6}>
              {loading ? "Folyamatban..." : mode === "login" ? "Bejelentkezes" : "Regisztracio"}
            </button>
          </section>
        ) : (
          <section className="info-section">
            <h2>Profil adatok</h2>
            <div className="form-grid">
              <div className="form-field full">
                <label>Email</label>
                <input type="email" value={profile.email} onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))} />
              </div>
              <div className="form-field half">
                <label>Teljes nev</label>
                <input type="text" value={profile.fullName} onChange={(event) => setProfile((prev) => ({ ...prev, fullName: event.target.value }))} />
              </div>
              <div className="form-field half">
                <label>Telefonszam</label>
                <input type="text" value={profile.phone} onChange={(event) => setProfile((prev) => ({ ...prev, phone: event.target.value }))} />
              </div>
            </div>

            <div className="checkout-nav" style={{ marginTop: 12 }}>
              <button className="checkout-back-btn" type="button" onClick={handleSignOut}>Kijelentkezes</button>
              <button className="checkout-next-btn" type="button" onClick={handleSaveProfile} disabled={loading}>Mentem a profilom</button>
            </div>
          </section>
        )}

        {message && <div className="info-highlight-box" style={{ marginTop: 16 }}>{message}</div>}
        {error && <div className="error-message" style={{ marginTop: 16 }}>{error}</div>}
      </div>
    </main>
  );
}
