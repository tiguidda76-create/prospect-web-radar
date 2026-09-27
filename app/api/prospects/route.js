import { NextResponse } from "next/server";
import { fetchProspectsFromDb, updateProspectInDb } from "@/lib/supabase";
import { MOCK_SCOUTED_PROSPECTS } from "@/lib/googlePlacesScout";

export async function GET() {
  try {
    let prospects = await fetchProspectsFromDb();
    if (!prospects || prospects.length === 0) {
      prospects = MOCK_SCOUTED_PROSPECTS;
    }
    return NextResponse.json({ success: true, prospects });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, updates } = await request.json();
    if (!id || !updates) {
      return NextResponse.json({ success: false, error: "id et updates requis" }, { status: 400 });
    }

    const updated = await updateProspectInDb(id, updates);
    return NextResponse.json({ success: true, prospect: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
