# Components Reference

This document provides a **high-level overview** of the React components located in `src/components`.  
For brevity only the **public props** and main purpose of each component are listed.

---

| Component | File | Props | Description & Usage Example |
|-----------|------|-------|-----------------------------|
| `AuthStatus` | `AuthStatus.tsx` | _none_ | Displays current auth state and offers a **Log Out** button.<br>`<AuthStatus />` |
| `CodeChefSummary` | `CodeChefSummary.tsx` | `username: string` – handle<br>`onDisconnect: () => void` – callback | Renders CodeChef statistics card.<br>`<CodeChefSummary username="tourist" onDisconnect={cb} />` |
| `CodeforcesSummary` | `CodeforcesSummary.tsx` | `username: string`, `onDisconnect: () => void` | Codeforces rating & activity overview. |
| `LeetCodeSummary` | `LeetCodeSummary.tsx` | `username: string`, `onDisconnect: () => void` | LeetCode solved-count and heat-map. |
| `ConnectCodeChefModal` | `ConnectCodeChefModal.tsx` | `isOpen: boolean`, `onConnect(username)`, `onClose()` | Modal to link a CodeChef account. |
| `ConnectCodeforcesModal` | `ConnectCodeforcesModal.tsx` | Same props as above. | Modal to link a Codeforces account. |
| `ConnectLeetcodeModal` | `ConnectLeetcodeModal.tsx` | Same props as above. | Modal to link a LeetCode account. |
| `Header` | `Header.tsx` | _none_ | Persistent site navigation bar. Include once at the top-level layout.<br>`<Header />` |
| `Footer` | `Footer.tsx` | _none_ | Simple informational footer. |
| `NoAuth` | `NoAuth.tsx` | _none_ | Guards pages that should only be accessed when **not** authenticated. |

---

## Example integration

```tsx
import { useState } from "react";
import CodeforcesSummary from "@/components/CodeforcesSummary";
import ConnectCodeforcesModal from "@/components/ConnectCodeforcesModal";

export default function Dashboard() {
  const [handle, setHandle] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      {handle ? (
        <CodeforcesSummary username={handle} onDisconnect={() => setHandle(null)} />
      ) : (
        <button className="btn" onClick={() => setOpen(true)}>
          Connect Codeforces
        </button>
      )}

      <ConnectCodeforcesModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConnect={(h) => {
          setHandle(h);
          setOpen(false);
        }}
      />
    </>
  );
}
```

---

*All components are written in TypeScript/JSX and styled with Tailwind CSS.*