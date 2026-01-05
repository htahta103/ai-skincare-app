/**
 * Script to populate Vectorize with skincare knowledge
 * Run with: node scripts/upload-knowledge.js
 */

const fs = require('fs');
const path = require('path');

// Load knowledge base
const knowledgePath = path.join(__dirname, '../src/knowledge/skincare-db.json');
const knowledge = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));

/**
 * Generate embeddings for each knowledge entry
 * In production, you'd call Cloudflare AI to generate these
 * For now, we'll create a format ready for upload
 */
function prepareForUpload() {
  const vectors = knowledge.knowledge_base.map((entry, index) => {
    // Create searchable text from entry
    const searchText = `
      ${entry.condition}
      ${entry.symptoms.join(' ')}
      ${entry.recommendations.join(' ')}
      ${Object.values(entry.severity_indicators).join(' ')}
    `.toLowerCase();

    return {
      id: entry.id,
      // In real implementation, generate embedding from searchText
      // For now, we'll note that embeddings need to be generated
      metadata: {
        condition: entry.condition,
        recommendations: entry.recommendations,
        products: entry.products,
        roast_templates: entry.roast_templates,
        search_text: searchText
      }
    };
  });

  return vectors;
}

const vectors = prepareForUpload();

// Save to file for manual upload
const outputPath = path.join(__dirname, '../embeddings-ready.json');
fs.writeFileSync(outputPath, JSON.stringify({ vectors }, null, 2));

console.log(`✅ Prepared ${vectors.length} knowledge entries`);
console.log(`📁 Saved to: ${outputPath}`);
console.log(`\n📝 Next steps:`);
console.log(`1. Generate embeddings using Cloudflare AI:`);
console.log(`   wrangler vectorize insert skincare-knowledge --file=embeddings-ready.json`);
console.log(`\n2. Or use the Cloudflare dashboard to upload manually`);
console.log(`\n3. Alternatively, generate embeddings programmatically:`);
console.log(`   - Use @cf/baai/bge-base-en-v1.5 model`);
console.log(`   - Call AI.run() for each entry's search_text`);
console.log(`   - Insert resulting vectors into Vectorize`);
