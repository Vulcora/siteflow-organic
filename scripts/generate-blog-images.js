import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import https from 'https';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// All blog images to generate
const blogImages = [
  // Actor-modellen
  {
    folder: 'actor-model',
    filename: 'hero-actor-model.png',
    prompt: 'Abstract visualization of the Actor Model: many small glowing orbs (actors) floating in space, each with its own soft glow, connected by thin light beams representing messages. Dark blue background with purple and cyan accents. Modern, clean, tech aesthetic. No text.'
  },
  {
    folder: 'actor-model',
    filename: 'office-analogy.png',
    prompt: 'Isometric illustration comparing two office layouts: Left side shows chaotic open office with people fighting over one document. Right side shows organized private offices with mailboxes outside each door. Clean modern style, blue and orange color scheme. No text.'
  },
  {
    folder: 'actor-model',
    filename: 'parallel-scaling.png',
    prompt: 'Abstract diagram showing scaling: small cluster of glowing nodes on left, massive cluster of thousands of glowing nodes on right, both running smoothly. Arrows indicating growth. Dark background, cyan and green colors. Tech visualization style. No text.'
  },
  {
    folder: 'actor-model',
    filename: 'whatsapp-discord-stats.png',
    prompt: 'Modern infographic style image showing server racks with small numbers (like 32, 100) handling massive data flow represented by thousands of message icons. Clean tech aesthetic, green and purple gradients. No text or logos.'
  },
  {
    folder: 'actor-model',
    filename: 'benefits-overview.png',
    prompt: 'Four abstract icons in a grid: scalability (expanding arrows), cost efficiency (downward graph), stability (solid foundation block), future-proof (rocket). Modern flat design, consistent blue and orange color scheme. No text.'
  },

  // Self-healing (självläkande)
  {
    folder: 'self-healing',
    filename: 'hero-self-healing.png',
    prompt: 'Phoenix bird made of digital code and light, rising from crashed/broken server components. Dramatic lighting, orange and blue flames transforming into clean code particles. Dark background. Epic and inspiring. No text.'
  },
  {
    folder: 'self-healing',
    filename: 'traditional-vs-letitcrash.png',
    prompt: 'Split image: Left shows tangled defensive code as messy wires and patches. Right shows clean simple system with automatic restart cycle visualized as a clean loop. Red vs Green color coding. Tech diagram style. No text.'
  },
  {
    folder: 'self-healing',
    filename: 'crash-recovery-timeline.png',
    prompt: 'Timeline visualization: crash icon, 1 millisecond marker, fresh restart icon, continue running. Ultra-fast recovery shown with speed lines. Clean minimal design, green and blue colors. No text.'
  },
  {
    folder: 'self-healing',
    filename: 'ericsson-uptime.png',
    prompt: 'Visualization of 99.9999999% uptime: a year calendar with only 31 milliseconds highlighted as downtime. Impressive stability concept. Blue and gold colors, premium feel. No text or numbers visible.'
  },
  {
    folder: 'self-healing',
    filename: 'supervisor-tree.png',
    prompt: 'Hierarchical tree diagram with supervisor nodes watching over worker nodes. When one worker node shows red/crashed, supervisor shows it restarting as green. Clean diagram style, blue background. No text.'
  },

  // Cost-effective (kostnadseffektivt)
  {
    folder: 'cost-effective',
    filename: 'hero-cost-savings.png',
    prompt: 'Abstract visualization of cost reduction: large expensive server farm shrinking into small efficient setup. Money/cost flowing downward. Green and blue gradients, modern tech style. No text.'
  },
  {
    folder: 'cost-effective',
    filename: 'resource-waste-comparison.png',
    prompt: 'Split comparison: Left shows mostly empty server racks (wasted resources). Right shows compact fully-utilized servers doing same work. Red vs green highlighting. Clean infographic style. No text.'
  },
  {
    folder: 'cost-effective',
    filename: 'whatsapp-discord-pinterest-stats.png',
    prompt: 'Three server icons with impressively small numbers next to massive user clouds. Showing efficiency of handling millions with minimal hardware. Clean tech infographic, purple and teal colors. No text or logos.'
  },
  {
    folder: 'cost-effective',
    filename: 'process-memory-comparison.png',
    prompt: 'Visual comparison: tiny 2KB cube vs massive 1MB cube, showing 500x size difference. Memory efficiency concept. Blue small cube, red large cube. Clean minimal 3D style. No text.'
  },
  {
    folder: 'cost-effective',
    filename: 'cost-calculation-infographic.png',
    prompt: 'Visual cost comparison: tall stack of 12 servers on left, short stack of 3 servers on right doing same work. Price tags showing dramatic savings. Green savings arrows. No specific numbers or text.'
  },

  // AI-ready (redo för AI)
  {
    folder: 'ai-ready',
    filename: 'hero-ai-agents.png',
    prompt: 'Futuristic visualization of AI agents: multiple glowing neural network nodes working in parallel, processing data streams. Purple and cyan colors, dark background, sci-fi aesthetic. No text.'
  },
  {
    folder: 'ai-ready',
    filename: 'ai-agent-workflow.png',
    prompt: 'Flowchart showing AI agent process: receive goal, break into subtasks, parallel execution (shown as branching paths), adapt and continue. Clean diagram style, blue and purple gradients. No text.'
  },
  {
    folder: 'ai-ready',
    filename: 'traditional-vs-actor-ai.png',
    prompt: 'Split comparison for AI: Left shows blocked sequential processing (traffic jam). Right shows smooth parallel AI agents flowing freely. Red vs green, modern tech style. No text.'
  },
  {
    folder: 'ai-ready',
    filename: 'parallel-agent-tasks.png',
    prompt: 'Multiple AI agents running simultaneously: flight search, hotel search, weather check, calendar check - all as parallel glowing processes. Connected to central coordinator. Tech visualization. No text.'
  },
  {
    folder: 'ai-ready',
    filename: 'multi-agent-system.png',
    prompt: 'Three AI agents collaborating: sales agent, support agent, pricing optimizer agent - shown as interconnected glowing orbs exchanging data streams. Futuristic, blue and purple. No text.'
  },

  // Massive concurrency
  {
    folder: 'massive-concurrency',
    filename: 'hero-massive-concurrency.png',
    prompt: 'Visualization of 100,000 simultaneous connections: massive web of glowing connection points, all active and flowing smoothly. Dark background, cyan and green data streams. Epic scale. No text.'
  },
  {
    folder: 'massive-concurrency',
    filename: 'hotel-reception-analogy.png',
    prompt: 'Split image: Left shows one receptionist with long queue of waiting people. Right shows 100 receptionists serving everyone instantly. Hotel reception setting, clean illustration style. No text.'
  },
  {
    folder: 'massive-concurrency',
    filename: 'thread-vs-process-memory.png',
    prompt: 'Visual memory comparison: heavy 1MB thread blocks stacking up vs lightweight 2KB process dots fitting thousands in same space. Size contrast visualization. Blue and orange. No text.'
  },
  {
    folder: 'massive-concurrency',
    filename: 'benchmark-comparison.png',
    prompt: 'Three server icons showing performance comparison: one small efficient server outperforming two larger struggling servers. Performance metrics visualized as bar heights. Tech infographic. No text or specific numbers.'
  },
  {
    folder: 'massive-concurrency',
    filename: 'use-cases-grid.png',
    prompt: 'Grid of 4 use case icons: real-time dashboard, IoT sensors network, trading charts, live streaming. Each showing high connection counts. Modern flat icon style, consistent blue palette. No text.'
  },
  {
    folder: 'massive-concurrency',
    filename: 'c10k-to-c10m-evolution.png',
    prompt: 'Evolution timeline: small 10K connections node growing to massive 10M connections network. Exponential growth visualization, from 1999 to 2025. Tech progress concept, blue to green gradient. No text.'
  }
];

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function generateImage(imageConfig) {
  const outputDir = path.join('siteflow-public', 'blog', imageConfig.folder);
  const outputPath = path.join(outputDir, imageConfig.filename);

  // Skip if already exists
  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  Skipping ${imageConfig.filename} (already exists)`);
    return;
  }

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`🎨 Generating: ${imageConfig.folder}/${imageConfig.filename}`);

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imageConfig.prompt,
      n: 1,
      size: '1792x1024',
      quality: 'standard',
      style: 'vivid'
    });

    const imageUrl = response.data[0].url;
    await downloadImage(imageUrl, outputPath);
    console.log(`✅ Saved: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error generating ${imageConfig.filename}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting blog image generation with DALL-E 3...\n');

  for (const imageConfig of blogImages) {
    await generateImage(imageConfig);
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✨ Done!');
}

main();
