import { permanentRedirect } from "next/navigation";

export default function VaultRedirect() {
  permanentRedirect("/todo");
}
