import { fetchAihotItemsPage } from "@/lib/aihot";
import { db } from "@/lib/db";
import { syncAihotItems } from "./store";

export async function syncLatestAihotItems() {
  const [selectedPage, allPage] = await Promise.all([
    fetchAihotItemsPage({
      mode: "selected",
      take: 100,
    }),
    fetchAihotItemsPage({
      mode: "all",
      take: 100,
    }),
  ]);
  const selectedResult = await syncAihotItems({
    db,
    items: selectedPage.items,
    mode: "selected",
  });
  const allResult = await syncAihotItems({
    db,
    items: allPage.items,
    mode: "all",
  });

  return {
    all: allResult,
    fetchedCount: selectedResult.fetchedCount + allResult.fetchedCount,
    insertedCount: selectedResult.insertedCount + allResult.insertedCount,
    selected: selectedResult,
    updatedCount: selectedResult.updatedCount + allResult.updatedCount,
  };
}
