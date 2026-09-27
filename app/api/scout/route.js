import { NextResponse } from "next/server";
import { searchProspectsOnGoogle } from "@/lib/googlePlacesScout";
import { saveProspectsToDb } from "@/lib/supabase";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      city = "Marrakech",
      category = "Restaurant",
      minRating = 4.7,
      minReviews = 10,
      query = "",
    } = body;

    const prospects = await searchProspectsOnGoogle({
      query,
      city,
      category,
      minRating: parseFloat(minRating),
      minReviews: parseInt(minReviews, 10),
    });

    const saved = await saveProspectsToDb(prospects);

    return NextResponse.json({
      success: true,
      totalFound: prospects.length,
      prospects: saved || prospects,
    });
  } catch (error) {
    console.error("API Scout Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
