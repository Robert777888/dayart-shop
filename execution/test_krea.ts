import { generateDesignImageViaKrea } from "../src/lib/krea";

async function main() {
  console.log("=== KREA AI TESTER ===");
  try {
    const start = Date.now();
    
    // Alapértelmezett beállítások: alkalom, stílus, kinek, motivum
    const alkalom = "Custom";
    const stilus = "Streetwear";
    const kinek = "Gamer";
    const motivum = "Cybernetic Controller with Neon Smoke";
    
    console.log(`Sending job with:
  Occasion: ${alkalom}
  Style:    ${stilus}
  For:      ${kinek}
  Motif:    ${motivum}
    `);

    const imageUrl = await generateDesignImageViaKrea(
      alkalom,
      stilus,
      kinek,
      motivum
    );

    const time = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`\n✅ Generated successfully in ${time} seconds!`);
    console.log(`Image URL: ${imageUrl}`);
    
  } catch (error) {
    console.error("❌ Test failed:");
    console.error(error);
  }
}

main();
