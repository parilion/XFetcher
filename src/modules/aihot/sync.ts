import { fetchAihotItemsPage } from "@/lib/aihot";
import { db } from "@/lib/db";
import { syncAihotItems } from "./store";

export async function syncLatestAihotItems() {
  const page = await fetchAihotItemsPage({
    mode: "selected",
    take: 100,
  });

  return syncAihotItems({
    db,
    items: page.items,
  });
}
