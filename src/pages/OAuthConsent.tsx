import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import sonfiLogo from "@/assets/sonfi-logo-vertical.png";

// Local typed wrapper — the Supabase JS `auth.oauth` namespace is beta.
type OAuthClient = { name?: string; client_uri?: string; redirect_uris?: string[] };
type AuthorizationDetails = {
  client?: OAuthClient;
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
};
type OAuthResult<T> = { data: T | null; error: { message: string } | null };
const oauth = (supabase.auth as unknown as {
  oauth: {
    getAuthorizationDetails: (id: string) => Promise<OAuthResult<AuthorizationDetails>>;
    approveAuthorization: (id: string) => Promise<OAuthResult<AuthorizationDetails>>;
    denyAuthorization: (id: string) => Promise<OAuthResult<AuthorizationDetails>>;
  };
}).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthorizationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id in URL.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src={sonfiLogo} alt="Sonfi" className="h-14 mx-auto mb-2" />
        </div>
        <div className="sonfi-card">
          {error ? (
            <div>
              <h1 className="text-lg font-semibold mb-2">Could not load this authorization request</h1>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" onClick={() => window.history.back()}>Go back</Button>
            </div>
          ) : !details ? (
            <p className="text-sm text-muted-foreground">Loading authorization request…</p>
          ) : (
            <div>
              <h1 className="text-lg font-semibold mb-1">
                Connect {details.client?.name ?? "an app"} to Sonfi
              </h1>
              <p className="text-sm text-muted-foreground mb-4">
                {details.client?.name ?? "This app"} will be able to use Sonfi's tools while you are signed in.
                It can read your accounts, transactions, budgets, and goals as you.
              </p>
              <div className="rounded-xl border p-4 mb-4 space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Requested access:</span>
                  <ul className="list-disc list-inside mt-1">
                    <li>Share your basic profile</li>
                    <li>Use Sonfi's tools as you</li>
                  </ul>
                </div>
                {details.client?.client_uri && (
                  <div>
                    <span className="text-muted-foreground">App URL:</span>{" "}
                    <span className="break-all">{details.client.client_uri}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                This does not bypass Sonfi's permissions or backend policies.
              </p>
              <div className="flex gap-2">
                <Button className="flex-1" disabled={busy} onClick={() => decide(true)}>
                  {busy ? "Please wait…" : "Approve"}
                </Button>
                <Button className="flex-1" variant="outline" disabled={busy} onClick={() => decide(false)}>
                  Cancel connection
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
