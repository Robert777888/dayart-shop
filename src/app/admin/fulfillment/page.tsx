"use client";

import { useMemo, useState } from "react";

type AdminOrder = {
  order_id: string;
  created_at: string;
  total_cents: number;
  currency: string;
  order_status: string;
  fulfillment_status: string;
  production_status: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  address_line1: string | null;
  item_count: number;
  internal_note: string | null;
  shipping_tracking_code: string | null;
  shipping_carrier: string | null;
};

const STATUS_OPTIONS = ["new", "printing", "ready", "shipped", "completed", "cancelled"];

export default function AdminFulfillmentPage() {
  const [adminKey, setAdminKey] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});
  const [trackingDraft, setTrackingDraft] = useState<Record<string, string>>({});
  const [carrierDraft, setCarrierDraft] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hasAuth = adminKey.trim().length > 0;

  const loadOrders = async () => {
    if (!hasAuth) return;
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("query", query.trim());
      if (status) params.set("status", status);

      const response = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: { "x-admin-key": adminKey.trim() },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Lista betoltese sikertelen.");
      setOrders(data.orders ?? []);
      setMessage(`Betoltve: ${(data.orders ?? []).length} rendelés.`);
    } catch (loadError) {
      const msg = loadError instanceof Error ? loadError.message : "Hiba a listazas kozben.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, nextStatus: string) => {
    if (!hasAuth) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({
          status: nextStatus,
          productionStatus: nextStatus === "printing" ? "in_progress" : nextStatus === "completed" ? "done" : "pending",
          internalNote: noteDraft[orderId] || "",
          shippingCarrier: carrierDraft[orderId] || "",
          shippingTrackingCode: trackingDraft[orderId] || "",
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Statusz mentes sikertelen.");
      setMessage(`Rendeles frissitve: ${orderId.slice(0, 8)}... (${nextStatus})`);
      await loadOrders();
    } catch (updateError) {
      const msg = updateError instanceof Error ? updateError.message : "Hiba a statusz frissites kozben.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const orderCountText = useMemo(() => `${orders.length} rendelés`, [orders.length]);

  return (
    <main className="info-page">
      <div className="info-hero">
        <h1>Admin Fulfillment</h1>
        <p>Rendelesek, ugyfeladatok es teljesitesi statusz kezeles egy feluleten.</p>
      </div>

      <div className="info-container">
        <section className="info-section">
          <h2>Admin hozzaferes</h2>
          <div className="form-grid">
            <div className="form-field full">
              <label>Admin kulcs (ADMIN_PANEL_KEY)</label>
              <input
                type="password"
                value={adminKey}
                onChange={(event) => setAdminKey(event.target.value)}
                placeholder="Add meg az admin kulcsot"
              />
            </div>
          </div>

          <div className="checkout-nav" style={{ marginTop: 12 }}>
            <button className="checkout-next-btn" type="button" onClick={loadOrders} disabled={loading || !hasAuth}>
              {loading ? "Betoltes..." : "Rendelesek betoltese"}
            </button>
          </div>
        </section>

        <section className="info-section">
          <h2>Szuresek</h2>
          <div className="form-grid">
            <div className="form-field half">
              <label>Kereses (email, nev, telefon, order id)</label>
              <input value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>
            <div className="form-field half">
              <label>Fulfillment statusz</label>
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="">Mind</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="checkout-nav" style={{ marginTop: 12 }}>
            <button className="checkout-next-btn" type="button" onClick={loadOrders} disabled={loading || !hasAuth}>Szures alkalmazasa</button>
          </div>
        </section>

        <section className="info-section">
          <h2>Rendelesek ({orderCountText})</h2>
          <div className="faq-list">
            {orders.map((order) => {
              const isOpen = selectedOrder === order.order_id;
              return (
                <details
                  key={order.order_id}
                  className="faq-item"
                  open={isOpen}
                  onToggle={(event) => {
                    const target = event.currentTarget;
                    setSelectedOrder(target.open ? order.order_id : null);
                  }}
                >
                  <summary className="faq-question">
                    #{order.order_id.slice(0, 8)} · {(order.full_name || order.email || "ismeretlen ugyfel")} · {(order.total_cents || 0).toLocaleString("hu-HU")} {order.currency || "HUF"}
                  </summary>
                  <div className="faq-answer" style={{ marginTop: 12 }}>
                    <p><strong>Ugyfel:</strong> {order.full_name || "-"} · {order.email || "-"} · {order.phone || "-"}</p>
                    <p><strong>Cim:</strong> {order.city || "-"}, {order.address_line1 || "-"}</p>
                    <p><strong>Allapot:</strong> order={order.order_status || "-"}, fulfillment={order.fulfillment_status || "-"}, production={order.production_status || "-"}</p>
                    <p><strong>Tetelek:</strong> {order.item_count || 0}</p>

                    <div className="form-grid" style={{ marginTop: 8 }}>
                      <div className="form-field full">
                        <label>Belső megjegyzes</label>
                        <textarea
                          value={noteDraft[order.order_id] ?? order.internal_note ?? ""}
                          onChange={(event) =>
                            setNoteDraft((prev) => ({ ...prev, [order.order_id]: event.target.value }))
                          }
                          rows={2}
                        />
                      </div>
                      <div className="form-field half">
                        <label>Futar</label>
                        <input
                          value={carrierDraft[order.order_id] ?? order.shipping_carrier ?? ""}
                          onChange={(event) =>
                            setCarrierDraft((prev) => ({ ...prev, [order.order_id]: event.target.value }))
                          }
                        />
                      </div>
                      <div className="form-field half">
                        <label>Tracking kod</label>
                        <input
                          value={trackingDraft[order.order_id] ?? order.shipping_tracking_code ?? ""}
                          onChange={(event) =>
                            setTrackingDraft((prev) => ({ ...prev, [order.order_id]: event.target.value }))
                          }
                        />
                      </div>
                    </div>

                    <div className="shipping-methods" style={{ marginTop: 8 }}>
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`option-pill ${order.fulfillment_status === opt ? "selected" : ""}`}
                          onClick={() => updateStatus(order.order_id, opt)}
                          disabled={loading}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        {message && <div className="info-highlight-box" style={{ marginTop: 16 }}>{message}</div>}
        {error && <div className="error-message" style={{ marginTop: 16 }}>{error}</div>}
      </div>
    </main>
  );
}
